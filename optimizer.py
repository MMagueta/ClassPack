import json
import database
from flask import Blueprint


__FORTRAN_EXEC_NAME = 'teste.x'
__FORTRAN_EXEC_PATH = 'script'
__FREE_LAYOUT_TLIMIT = 120
__FIXED_LAYOUT_TLIMIT = 120


def config_optimizer(config):

	global __FORTRAN_EXEC_NAME, __FORTRAN_EXEC_PATH, __FIXED_LAYOUT_TLIMIT, \
		__FREE_LAYOUT_TLIMIT

	__FORTRAN_EXEC_NAME  = config.get('ClassPack', 'fortran.exec.name', fallback='teste.x')
	__FORTRAN_EXEC_PATH  = config.get('ClassPack', 'fortran.exec.path', fallback='script')
	__FREE_LAYOUT_TLIMIT = config.getint('ClassPack', 'freelayout.timelimit', fallback=120)
	__FIXED_LAYOUT_TLIMIT = config.getint('ClassPack', 'fixedlayout.timelimit', fallback=120)


optimizer = Blueprint('mainapp', __name__)

@optimizer.route('/')
def index():
	return "Index"

@optimizer.route('/optimize')
def optimizer_chairs():
	from subprocess import TimeoutExpired, PIPE, Popen
	from flask import request, send_file
	import os

	global __FORTRAN_EXEC_NAME, __FORTRAN_EXEC_PATH, __FIXED_LAYOUT_TLIMIT, \
		__FREE_LAYOUT_TLIMIT

	data = list(request.args.values())[1:-1]

	args = [data[4]] + data[2:4] + data[0:2] + data[5:]
	print(args)

	obstacles = list(list(float(args[7 + 3 * i + j]) for j in range(0, 3)) for i in range(0, int(args[6])))

	ptype = int(data[6 + 3 * len(obstacles) + 1])
	num_chairs = None
	if ptype == 1 or ptype == 3: num_chairs = int(data[-1])

	problem_id = database.gen_chair_id(
		float(args[1]), float(args[2]),
		float(args[0]), float(args[3]), float(args[4]),
		obstacles, ptype, num_chairs)
        
	jd = {
                'type': 'chairs',
                'user_id': '',
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

	if ptype == 1 or ptype == 3:
		jd['num_chairs'] = num_chairs

	database.connect()

	database.save_problem(jd)

	process = None
        
	try:
		loaded_json = database.get_chairs(problem_id)

		if loaded_json != None:

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

		process = Popen(
			[__FORTRAN_EXEC_PATH + '/' + __FORTRAN_EXEC_NAME],
			stdin=PIPE, stdout=PIPE
		)
		output, error = process.communicate(('\n'.join(args)).encode('utf-8'),
						    timeout=__FIXED_LAYOUT_TLIMIT)
		#print("> ", output, error)
		#print("A")

	except TimeoutExpired:		

		print('Timed out in id ', problem_id)

		process.kill()

		if ptype == 1 or ptype == 2:

			ptype += 2

			args[6 + 3 * len(obstacles) + 1] = str(ptype)

			jd['opt_type'] = ptype

			problem_id = database.gen_chair_id(
				float(args[1]), float(args[2]),
				float(args[0]), float(args[3]), float(args[4]),
				obstacles, ptype, num_chairs)

			try:
				
				process = Popen(
					[__FORTRAN_EXEC_PATH + '/' + __FORTRAN_EXEC_NAME],
					stdin=PIPE, stdout=PIPE
				)
				output, error = process.communicate(('\n'.join(args)).encode('utf-8'),
								    timeout=__FIXED_LAYOUT_TLIMIT)

			except Exception as e:
				print(e)
				return '{0}({1})'.format(request.args.get('callback'), {'response': 100, 'error': e})
		else:
			return '{0}({1})'.format(request.args.get('callback'), {'response': 100, 'error': e})

	except Exception as e:
		print(e)
		return '{0}({1})'.format(request.args.get('callback'), {'response': 100, 'error': e})

	import glob2 as gl
	import os
	filename = gl.glob("*"+str(process.pid)+".json").pop()
	loaded_json = json.loads(open(filename, 'r').read())
	#print(loaded_json)
	os.remove(filename) #Removes .JSON file
	process.terminate()

	database.save_or_update_chairs(problem_id, jd['room_width'], jd['room_height'], jd['min_dist'],
				       jd['chair_width'], jd['chair_height'], ptype, loaded_json,
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
def optimize_rows():
	from otimizador_filas import otimizar_filas, otimizar_distancia
	from flask import jsonify
	from flask import request
	import time

	data = list(request.args.values())[1:-1]
	timestamp = time.time()

	# Check arguments and try to convert them

	try:
		room_width = float(data[0])
		room_height = float(data[1])
		min_dist = float(data[6])
		ch_width = float(data[2])
		ch_height = float(data[3])
		n_rows = int(data[4])
		n_chairs = int(data[5])
		
		opt_type = int(data[7])
		n_students = None
		if opt_type == 2: n_students = int(data[8])

		uniform_rows = request.args.get('10', 1, type=int)
		row_spacing = [float(d) for d in (request.args.get('11', '')).split(',') if (not uniform_rows) and d.strip() != '']

	except Exception as e:

		return '{0}({1})'.format(
			request.args.get('callback'), str(e)
		), 500

	# Error if the number of spaces does not match the number of rows
	if (not uniform_rows) and len(row_spacing) != n_rows - 1:

		return '{0}({1})'.format(
			request.args.get('callback'), 'Wrong number of rows.'
		), 500

	if uniform_rows:

		# We have to adjust the right-oriented definition of
		# the problem to the top-oriented way that the
		# algorithm was made. Also, we artificially increase
		# the "right" (top) part, so that the chair is inside
		# the correct space, not the table. Finally, we
		# compute the average space between two rows.
		avg_space = round((room_height - n_rows * ch_height) / (n_rows - 1.0), 2)

		row_spacing = list(avg_space for i in range(n_rows - 1))
	
	problem_id = database.gen_row_id(room_width, room_height,
					 min_dist,
					 ch_width, ch_height,
					 n_rows, n_chairs,
					 opt_type, n_students,
					 row_spacing=row_spacing)

	database.connect()

	jd = {
                'type': 'rows',
                'user_id': '',
                'problem_id': problem_id,
		'min_dist': min_dist,
		'room_width': room_width,
		'room_height': room_height,
		'chair_width': ch_width,
		'chair_height': ch_height,
		'num_rows': n_rows,
		'row_spacing': row_spacing,
		'num_chairs': n_chairs,
		'opt_type': opt_type
		
	}

	if opt_type == 2: jd['num_students'] = n_students

	database.save_problem(jd)

	solution = database.get_rows(problem_id)

	if solution != None:

		solution.update({'response': 200,
				 'timestamp': timestamp})

		return '{0}({1})'.format(request.args.get('callback'), solution), 200

	elif uniform_rows:

		# If data does not exist and is in uniform_rows mode,
		# try the old version of the unique id.
		
		oldid = database.gen_row_id(room_width, room_height,
				min_dist, ch_width, ch_height, n_rows,
				n_chairs, opt_type, n_students)

		solution = database.get_rows(oldid)

		if solution != None:

			# Add old solution to the new id and include
			# the row spacing
			database.save_or_update_rows(
				problem_id, room_width,
				room_height, min_dist, ch_width, ch_height, n_rows,
				n_chairs, opt_type, row_spacing, solution, n_students
			)

			solution.update({'response': 200,
					 'timestamp': timestamp})

			return '{0}({1})'.format(request.args.get('callback'), solution), 200

	result = None

	# Convert to milliseconds
	timeLimit = __FIXED_LAYOUT_TLIMIT * 1000
	
	if opt_type == 1:
		result = otimizar_filas(
			room_height, room_width + 7 * ch_width / 8,
			ch_height, ch_width,
			n_chairs,
			row_spacing,
			min_dist, timeLimit)
	elif opt_type == 2:
		result = otimizar_distancia(
			room_height, room_width + 7 * ch_width / 8,
			ch_height, ch_width,
			n_chairs,
			row_spacing,
			min_dist, n_students, timeLimit)

	if result is None:
		return '{0}({1})'.format(
			request.args.get('callback'),
			"System error"), 400

	print(result)

	solution = { 'status': result["status"] }

	if result['status'] != 0:

		solution.update({
			'A': result["resposta"],
			'rows': result["num_fileiras"],
			'chairs': result["num_carteiras"],
			'students': result["num_alunos"],
			'rowSpace': row_spacing,
			'chairSpace': result["largura_corredor_horizontal"]
		})

		if opt_type == 2: solution['minDist'] = result['distancia_minima']

	database.save_or_update_rows(problem_id, room_width,
		room_height, min_dist, ch_width, ch_height, n_rows,
		n_chairs, opt_type, row_spacing, solution, n_students)

	solution.update({'response': 200,
			 'timestamp': timestamp})

	return '{0}({1})'.format(
		request.args.get('callback'),
				solution)
