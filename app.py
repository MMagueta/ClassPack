import database
from configparser import ConfigParser
from flask import Flask, Response, Blueprint, g
from flask_cors import CORS

config = ConfigParser()
config.read('cp_config.ini')

URL_PREFIX        = config.get('ClassPack', 'url.prefix', fallback='/')
FORTRAN_EXEC_NAME = config.get('ClassPack', 'fortran.exec.name', fallback='teste.x')
FORTRAN_EXEC_PATH = config.get('ClassPack', 'fortran.exec.path', fallback='script')

app = Flask(__name__)
CORS(app)

bp = Blueprint('mainapp', __name__)

@bp.route('/')
def index():
	return "Index"

@bp.route('/optimize')
def optimizer():
	import subprocess
	from flask import request, send_file
	data = list(request.args.values())[1:-1]

	args = [data[4]] + data[2:4] + data[0:2] + data[5:]
        
	obstacles = list(list(float(args[7 + 3 * i + j]) for j in range(0, 3)) for i in range(0, int(args[6])))
	
	client = database.connect()

	if client is not None: g._client = client

	try:
		loaded_json = database.get_chairs(client, float(args[1]), float(args[2]),
						   float(args[0]), float(args[3]), float(args[4]),
						   obstacles=obstacles)

		if loaded_json is not None:

			return '{0}({1})'.format(request.args.get('callback'), {'response': 200, 'file':'none.pdf', 'found_solution': str(loaded_json['found_solution']), 'number_items': loaded_json['number_items'], 'min_distance': loaded_json['min_distance'], 'solutions': len(loaded_json['solutions']), 'all_solutions': loaded_json['solutions']})

		process = subprocess.Popen(
                        [FORTRAN_EXEC_PATH + '/' + FORTRAN_EXEC_NAME],
                        stdin=subprocess.PIPE, stdout=subprocess.PIPE
                )
		output, error = process.communicate(('\n'.join(args)).encode('utf-8'))
		#print("> ", output, error)
	except Exception as e:
		print(e, error)
		database.disconnect(client)
		return '{0}({1})'.format(request.args.get('callback'), {'response': 100, 'error': e})
	else:
		import latex_converter
		import glob2 as gl
		import os
		import json
		filename = gl.glob("*"+str(process.pid)+".tex").pop()
		latex_converter.convert_tex_document(filename)
		loaded_json = json.loads(open(filename.replace(".tex", ".json"), 'r').read())
		print(loaded_json)
		os.remove(filename) #Removes .TEX file
		os.remove(filename.replace(".tex", ".json")) #Removes .JSON file
		process.terminate()

		database.save_or_update_chairs(client, float(args[1]), float(args[2]), float(args[0]),
					       float(args[3]), float(args[4]), loaded_json, obstacles=obstacles)

		database.disconnect(client)

		return '{0}({1})'.format(request.args.get('callback'), {'response': 200, 'file': filename.replace(".tex", ".pdf"), 'found_solution': str(loaded_json['found_solution']), 'number_items': loaded_json['number_items'], 'min_distance': loaded_json['min_distance'], 'solutions': len(loaded_json['solutions']), 'all_solutions': loaded_json['solutions']})


@bp.route('/reports/<filename>/pdf', methods=['POST'])
def download(filename):
	from flask import request, send_file
	import glob2 as gl
	if request.method == 'POST':
		print(filename)
		filename = gl.glob("*"+str(filename)+"*.pdf").pop()
		print(filename)
		return send_file(filename, mimetype='application/pdf')
	return '{0}({1})'.format(request.args.get('callback'), {'response': 404})

@bp.route('/rows')
def optimize_rows():
	from otimizador_filas import otimizar_filas
	from flask import jsonify
	from flask import request
	from latex_converter import convert_coords_map
	import time
	data = list(request.args.values())[1:-1]
        # We have to adjust the right-oriented definition of the
        # problem to the top-oriented way that the algorithm was
        # made. Also, we artificially increase the "right" (top) part,
        # so that the chair is inside the correct space, not the
        # table.
	result = otimizar_filas(
		float(data[1]),
        float(data[0]) + 7 * float(data[2]) / 8,
        float(data[3]),
        float(data[2]),
        int(data[5]),
        int(data[4]),
        float(data[6]))
	timestamp = time.time()
	print(result)
	convert_coords_map(result["resposta"], timestamp)
	return '{0}({1})'.format(
                request.args.get('callback'),
                {'response': 200,
                 'status': result["status"],
                 'timestamp': timestamp,
                 'A': result["resposta"],
                 'rows': result["num_fileiras"],
                 'chairs': result["num_carteiras"],
                 'students': result["num_alunos"],
                 'rowSpace': result["largura_corredor_vertical"],
                 'chairSpace': result["largura_corredor_horizontal"]})

app.register_blueprint(bp, url_prefix=URL_PREFIX)

database.init_db(config, app)

if __name__ == '__main__':

	app.run()
