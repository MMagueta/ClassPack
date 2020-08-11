import json
import database
from flask import Blueprint
from flask_jwt import jwt_required, current_identity


__FORTRAN_EXEC_NAME = 'teste.x'
__FORTRAN_EXEC_PATH = 'script'


def config_optimizer(config):

	global __FORTRAN_EXEC_NAME, __FORTRAN_EXEC_PATH

	__FORTRAN_EXEC_NAME = config.get('ClassPack', 'fortran.exec.name', fallback='teste.x')
	__FORTRAN_EXEC_PATH = config.get('ClassPack', 'fortran.exec.path', fallback='script')


optimizer = Blueprint('mainapp', __name__)

@optimizer.route('/user')
@jwt_required()
def create_user():

	from flask import request
	email = request.args.get('email')
	name  = request.args.get('name')
	institution = request.args.get('institution')

	if email and not str.isspace(email) and \
	   name and not str.isspace(name) and \
	   institution and not str.isspace(institution):
	
		database.add_and_return_user(str(current_identity),
					     email, name, institution)

		return 'OK', 200

	return 'Error', 500


@optimizer.route('/optimize')
@jwt_required()
def optimizer_chairs():
	import subprocess
	from flask import request, send_file
	import os

	global __FORTRAN_EXEC_NAME, __FORTRAN_EXEC_PATH

	user_id = str(current_identity)

	data = list(request.args.values())[1:-1]
	print(data)

	args = [data[4]] + data[2:4] + data[0:2] + data[5:]
	print(args)

	obstacles = list(list(float(args[7 + 3 * i + j]) for j in range(0, 3)) for i in range(0, int(args[6])))

	ptype = int(data[6 + 3 * len(obstacles) + 1])
	num_chairs = None
	if ptype == 1: num_chairs = int(data[-1])

	problem_id = database.gen_chair_id(
		float(args[1]), float(args[2]),
		float(args[0]), float(args[3]), float(args[4]),
		obstacles, ptype, num_chairs)
        
	jd = {
                'type': 'chairs',
                'user_id': user_id,
                'problem_id': problem_id,
		'min_dist': float(data[4]),
		'room_width': float(data[0]),
		'room_height': float(data[1]),
		'chair_width': float(data[2]),
		'chair_height': float(data[3]),
		'obstacles': obstacles,
		'num_runs': int(data[5]),
		'opt_type': ptype,
	}

	if ptype == 1:
		jd['num_chairs'] = num_chairs

	database.save_problem(jd)

	user = database.get_user(user_id)
	if user is not None and 'problems' in user:
		user['problems'].append(problem_id)
		user.save()

	try:
		loaded_json = database.get_chairs(problem_id)

		if loaded_json is not None:

			json_return = {'response': 200,
				       'found_solution': loaded_json['found_solution']}

			if json_return['found_solution']:

				json_return.update({
					'file': 'does_not_exist.pdf',
					'found_solution': str(loaded_json['found_solution']),
					'number_items': loaded_json['number_items'],
					'min_distance': loaded_json['min_distance'],
					'solutions': len(loaded_json['solutions']),
					'all_solutions': loaded_json['solutions']
				})


			return '{0}({1})'.format(
				request.args.get('callback'),
				json.dumps(json_return)
			)

		process = subprocess.Popen(
						[__FORTRAN_EXEC_PATH + '/' + __FORTRAN_EXEC_NAME],
						stdin=subprocess.PIPE, stdout=subprocess.PIPE
				)
		output, error = process.communicate(('\n'.join(args)).encode('utf-8'))
		#print("> ", output, error)
		#print("A")
	except Exception as e:
		print(e)
		return '{0}({1})'.format(request.args.get('callback'), {'response': 100, 'error': e})
	else:
		import latex_converter
		import glob2 as gl
		import os
		filename = gl.glob("*"+str(process.pid)+".json").pop()
		#latex_converter.convert_tex_document(filename)
		loaded_json = json.loads(open(filename, 'r').read())
		#print(loaded_json)
		os.remove(filename) #Removes .JSON file
		process.terminate()

		database.save_or_update_chairs(problem_id, float(args[1]), float(args[2]), float(args[0]),
					       float(args[3]), float(args[4]), ptype, loaded_json,
					       obstacles=obstacles, num_chairs=num_chairs)

		json_return = {'response': 200,
			       'found_solution': loaded_json['found_solution']}
		
		if json_return['found_solution']:

			json_return.update({
				'file': filename.replace(".tex", ".pdf"),
				'found_solution': str(loaded_json['found_solution']),
				'number_items': loaded_json['number_items'],
				'min_distance': loaded_json['min_distance'],
				'solutions': len(loaded_json['solutions']),
				'all_solutions': loaded_json['solutions']
			})

		return '{0}({1})'.format(
			request.args.get('callback'),
			json.dumps(json_return)
		)


@optimizer.route('/reports/<filename>/pdf', methods=['POST'])
def download(filename):
	from flask import request, send_file
	import glob2 as gl
	if request.method == 'POST':
		print(filename)
		filename = gl.glob("*"+str(filename)+"*.pdf").pop()
		print(filename)
		return send_file(filename, mimetype='application/pdf')
	return '{0}({1})'.format(request.args.get('callback'), {'response': 404})

@optimizer.route('/rows')
@jwt_required()
def optimize_rows():
	from otimizador_filas import otimizar_filas
	from flask import jsonify
	from flask import request
	from latex_converter import convert_coords_map
	import time

	user_id = str(current_identity)

	data = list(request.args.values())[1:-1]
	timestamp = time.time()

	problem_id = database.gen_row_id(float(data[0]),
					   float(data[1]),
					   float(data[6]),
					   float(data[2]),
					   float(data[3]),
					   int(data[4]), int(data[5]))

	jd = {
                'type': 'rows',
                'user_id': user_id,
                'problem_id': problem_id,
		'min_dist': float(data[6]),
		'room_width': float(data[0]),
		'room_height': float(data[1]),
		'chair_width': float(data[2]),
		'chair_height': float(data[3]),
		'num_rows': int(data[4]),
		'num_chairs': int(data[5])
	}

	database.save_problem(jd)

	user = database.get_user(user_id)
	if user is not None and 'problems' in user:
		user['problems'].append(problem_id)
		user.save()

	solution = database.get_rows(problem_id)

	if solution is not None:

		solution.update({'response': 200,
				 'timestamp': timestamp})

		return '{0}({1})'.format(request.args.get('callback'), solution)


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
	print(result)
	convert_coords_map(result["resposta"], timestamp)

	solution = {
		'status': result["status"],
				'A': result["resposta"],
				'rows': result["num_fileiras"],
				'chairs': result["num_carteiras"],
				'students': result["num_alunos"],
				'rowSpace': result["largura_corredor_vertical"],
				'chairSpace': result["largura_corredor_horizontal"]
	}

	database.save_or_update_rows(problem_id, float(data[0]),
				     float(data[1]), float(data[6]),
				     float(data[2]), float(data[3]),
				     int(data[4]), int(data[5]),
				     solution)

	solution.update({'response': 200,
			 'timestamp': timestamp})

	return '{0}({1})'.format(
		request.args.get('callback'),
				solution)
