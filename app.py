from flask import Flask, Response
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
	return "Index"

@app.route('/optimize')
def optimizer():
	import subprocess
	from flask import request, send_file
	data = list(request.args.values())[1:-1]
	args = [data[4]] + data[2:4] + data[0:2] + data[5:]
        
	try:
		process = subprocess.Popen(["script/bin.x"], stdin=subprocess.PIPE, stdout=subprocess.PIPE)
		output, error = process.communicate(('\n'.join(args)).encode('utf-8'))
		#print("> ", output, error)
		#print("A")
	except Exception as e:
		#print(e, error)
		return '{0}({1})'.format(request.args.get('callback'), {'response': 100, 'error': e})
	else:
		import latex_converter
		import glob2 as gl
		import os
		import json
		filename = gl.glob("*"+str(process.pid)+".json").pop()
		#latex_converter.convert_tex_document(filename)
		loaded_json = json.loads(open(filename, 'r').read())
		#print(loaded_json)
		os.remove(filename) #Removes .JSON file
		process.terminate()
		return '{0}({1})'.format(request.args.get('callback'), {'response': 200, 'found_solution': str(loaded_json['found_solution']), 'number_items': loaded_json['number_items'], 'min_distance': loaded_json['min_distance'], 'solutions': len(loaded_json['solutions']), 'all_solutions': loaded_json['solutions']})


@app.route('/reports/<filename>/pdf', methods=['POST'])
def download(filename):
	from flask import request, send_file
	import glob2 as gl
	if request.method == 'POST':
		print(filename)
		filename = gl.glob("*"+str(filename)+"*.pdf").pop()
		print(filename)
		return send_file(filename, mimetype='application/pdf')
	return '{0}({1})'.format(request.args.get('callback'), {'response': 404})

@app.route('/rows')
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

if __name__ == '__main__':
	app.run(host="0.0.0.0")
