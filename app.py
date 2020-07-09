import database
from flask import Flask, Response, g, url_for, redirect
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

@app.route('/login', methods=['GET', 'POST'])
def save_user():

        from flask import request, render_template

        g._client = database.connect()

        if request.method == 'POST':
                g._uid = database.add_and_return_user(g._client,
                        request.form['email'],
                        request.form['name'],
                        request.form['institution'])
        else:
                email = request.args.get('email')
                name = request.args.get('name')
                institution = request.args.get('institution')

                if email is None or name is None or institution is None:
                        return '{0}({1})'.format(request.args.get('callback'), {'response': 404})

                g._uid = database.add_and_return_user(g._client, email, name, institution)

        return render_template('main.html')

@app.route('/')
def index():
        
	return redirect(url_for('static', filename='firstpage.html'))

@app.route('/optimize')
def optimizer():
	import subprocess
	from flask import request, send_file
	data = list(request.args.values())[1:-1]

	obstacles = list(list(float(data[7 + 3 * i + j]) for j in range(0, 3)) for i in range(0, int(data[6])))
	
	client = database.connect()

	try:

		result_tuple = database.get_chairs(client, float(data[1]), float(data[2]),
						   float(data[0]), float(data[3]), float(data[4]),
						   obstacles=obstacles)

		if result_tuple is not None:

			loaded_json = result_tuple[0]
			pdf_filename = result_tuple[1] + '.pdf'

			return '{0}({1})'.format(request.args.get('callback'), {'response': 200, 'file': pdf_filename, 'found_solution': str(loaded_json['found_solution']), 'number_items': loaded_json['number_items'], 'min_distance': loaded_json['min_distance'], 'solutions': len(loaded_json['solutions']), 'all_solutions': loaded_json['solutions']})
		
		process = subprocess.Popen(["script/teste.x"], stdin=subprocess.PIPE, stdout=subprocess.PIPE)
		output, error = process.communicate(('\n'.join(data)).encode('utf-8'))
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

		database.save_or_update_chairs(client, float(data[1]), float(data[2]), float(data[0]),
					       float(data[3]), float(data[4]), loaded_json,
					       filename.replace(".tex", ".pdf"), obstacles=obstacles)

		database.disconnect(client)

		return '{0}({1})'.format(request.args.get('callback'), {'response': 200, 'file': filename.replace(".tex", ".pdf"), 'found_solution': str(loaded_json['found_solution']), 'number_items': loaded_json['number_items'], 'min_distance': loaded_json['min_distance'], 'solutions': len(loaded_json['solutions']), 'all_solutions': loaded_json['solutions']})


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
	result = otimizar_filas(
		float(data[1]),
        float(data[0]),
        float(data[2]),
        float(data[3]),
        int(data[4]),
        int(data[5]),
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

	app.run()
