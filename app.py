from flask import Flask, render_template, Response
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
	try:
		process = subprocess.Popen(["script/teste.x"], stdin=subprocess.PIPE, stdout=subprocess.PIPE)
		output, error = process.communicate(('\n'.join(data)).encode('utf-8'))
		#print("> ", output, error)
	except Exception as e:
		print(e, error)
		return '{0}({1})'.format(request.args.get('callback'), {'response': 100, 'error': e})
	else:
		import latex_converter
		import glob2 as gl
		import os
		filename = gl.glob("*"+str(process.pid)+".tex").pop()
		latex_converter.convert_tex_document(filename)
		os.remove(filename) #Removes .TEX file
		os.remove(filename.replace(".tex", ".json")) #Removes .JSON file
		process.terminate()
		return '{0}({1})'.format(request.args.get('callback'), {'response': 200, 'file': filename.replace(".tex", ".pdf")})

@app.route('/reports/<filename>/pdf', methods=['POST'])
def download(filename):
	from flask import request, send_file
	import glob2 as gl
	if request.method == 'POST':
		filename = gl.glob(filename).pop()
		return send_file(filename, mimetype='application/pdf')
	return '{0}({1})'.format(request.args.get('callback'), {'response': 404})



if __name__ == '__main__':
	app.run()
