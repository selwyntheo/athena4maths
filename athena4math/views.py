#!/usr/bin/env python
from flask import Flask, render_template, redirect, url_for, abort, request, make_response, jsonify 
from flask.ext.sqlalchemy import SQLAlchemy
from flask_sqlalchemy import SQLAlchemy
from flask_login import login_required, login_user, logout_user
import jwt


import time
from datetime import datetime, timedelta

import json
import os
import traceback

from jwt import DecodeError, ExpiredSignature

from athena4math import app, db, login_manager


from models import Quiz, Results, User

def create_token(user):
	payload = {
			'sub': user.id,
			'iat': datetime.utcnow(),
			'exp': datetime.utcnow() + timedelta(days=14)
		}
	token = jwt.encode(payload, app.config['TOKEN_SECRET'])
	return token.decode('unicode_escape')

def parse_token(req):
	token = req.headers.get('Authorization').split()[1]
	return jwt.decode(token, app.config['TOKEN_SECRET'])

def validate_email(self, email_field):
	if User.query.filter_by(email = email_field).first():
		raise ValidationError('There already is a user with this email address')


def json_serial(obj):
    if isinstance(obj, datetime.datetime):
        serial = obj.isoformat()
        return serial
        raise TypeError("Type not Serializable")
    if isinstance(obj, datetime.date):
        serial = obj.isoformat()
        return serial
        raise TypeError("Type not Serializable")

@login_manager.user_loader
def load_user(userid):
    return User.query.get(int(userid))

@app.route('/views/<path:filename>')
def getView(filename):
	return app.send_static_file('views/' + filename)

@app.route('/js/<path:filename>')
def getJsFile(filename):
	return app.send_static_file('js/' + filename)

@app.route('/fonts/<path:filename>')
def getFontsFile(filename):
    return app.send_static_file('fonts/' + filename)

@app.route('/css/<path:filename>')
def getCssFile(filename):
	return app.send_static_file('css/' + filename)

@app.route('/images/<path:filename>')
def getImgFile(filename):
	return app.send_static_file('images/' + filename)


@app.route('/')
@app.route('/index')
def index():
    return app.send_static_file('index.html')


@app.route('/auth/signup', methods=['POST'])
def signup():
	print "%s" % request.json['email']
	user = User(email=request.json['email'], password=request.json['password'])
	db.session.add(user)
	db.session.commit()
	token = create_token(user)
	return jsonify(token=token)



@app.route('/user/<username>', methods=['GET'])
def user():
	user = User.query.filter_by(username=username).first_or_404()
	return app.send_static_file('/views/app-student-profile.html')


@app.route('/auth/login', methods=['POST'])
def login():
	user = User.query.filter_by(email=request.json['email']).first()
	if not user or not user.check_password(request.json['password']):
		response = jsonify(message='Wrong Email or Password')
		response.status_code = 401
		return response
	token = create_token(user)
	return jsonify(token=token,user = request.json['email'])


@app.route('/logout')
def logout():
    logout_user
    return redirect('index')


@app.route('/quiz/<id>', methods=['GET'])
def quiz(id):
	quizname = "quiz" + id + ".json"
	with open(quizname) as f:
		data = json.load(f)
	return json.dumps(data, default=json_serial)

@app.route('/api/quiz/submit', methods=['POST'])
def saveresults():
	print "%s" % request.data
	json_obj = json.loads(request.data)
	for i in json_obj:
		print "%s" % i['QuestionId']
		result = Results(quizid="1",questionid=i['QuestionId'], user_id="admin", answer=i['Answered'])
		db.session.add(result)
		db.session.commit()
	return "Success"



