from configparser import ConfigParser
from flask import Flask, jsonify
from flask_cors import CORS
from re import compile


# Patter to math UUIDs
__uuid_matcher = compile('[\w]{8}-[\w]{4}-[\w]{4}-[\w]{4}-[\w]{12}')


# JWT necessary class and functions

class User():

	def __init__(self, id, name=None, inst=None):
		self.id = id
		self.name = name
		self.inst = inst


def authenticate(access_id, nopass):

	if __uuid_matcher.match(access_id) is not None:

		from database import get_user
		doc = get_user(access_id)

		if doc is not None:

			return User(access_id, doc['name'], doc['institution'])

	else:

		from uuid import uuid4
		return User(str(uuid4()))


def identity(payload):

	return payload['identity']


# Handler to return information in addition to the JWT token. If the
# user already exists in the database, return the information.
def response_handler(access_token, identity):
	return jsonify({
		'access_token': access_token.decode('utf-8'),
                'accessid': identity.id,
		'name': identity.name,
		'institution': identity.inst
	})


# Factory
def create_app(ini_file):

	app = Flask(__name__)
	CORS(app)

	config = ConfigParser()
	config.read(ini_file)

	__URL_PREFIX = config.get('ClassPack', 'url.prefix', fallback='/')
	__SECRET_KEY = config.get('ClassPack', 'auth.secret')
	__JWT_EXPIRATION = config.getint('ClassPack', 'auth.expiration.minutes', fallback=24 * 60)

	app.config['SECRET_KEY'] = __SECRET_KEY
	app.config['JWT_AUTH_URL_RULE'] = __URL_PREFIX + '/authuser'
	app.config['JWT_AUTH_USERNAME_KEY'] = 'accessid'
	app.config['JWT_AUTH_PASSWORD_KEY'] = 'nopass'

	from datetime import timedelta
	app.config['JWT_EXPIRATION_DELTA'] = timedelta(minutes=__JWT_EXPIRATION)

	from optimizer import optimizer, config_optimizer
	config_optimizer(config)
	app.register_blueprint(optimizer, url_prefix=__URL_PREFIX)

	from database import init_db
	init_db(config, app)

	from flask_jwt import JWT
	with app.app_context():
		jwt = JWT(app, authenticate, identity)
		jwt.auth_response_handler(response_handler)

	return app


if __name__ == '__main__':

	app = create_app("./cp_config.ini")

	app.run(host="0.0.0.0")
