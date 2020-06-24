from flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
def index():
	return "Index"

@app.route('/optimize')
def optimizer():
	import subprocess
	from flask import request
	data = list(request.args.values())[1:-1]
	try:
		process = subprocess.Popen(["script/teste.x"], stdin=subprocess.PIPE)
		output, error = process.communicate(('\n'.join(data)).encode('utf-8'))
		print("> ", output, error)
	except Exception as e:
		print(e, error)
		return '{0}({1})'.format(request.args.get('callback'), {'response': 100, 'error': e})
	else:
		process.terminate()
		return '{0}({1})'.format(request.args.get('callback'), {'response': 200, 'id': process.pid})

	
if __name__ == '__main__':
	app.run()
