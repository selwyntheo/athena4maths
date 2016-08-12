from datetime import datetime

from sqlalchemy import desc
from flask_login import UserMixin
from werkzeug.security import check_password_hash, generate_password_hash

from athena4math import db

class Quiz(db.Model):
	id = db.Column(db.Integer, primary_key = True)
	date = db.Column(db.DateTime, default= datetime.utcnow)
	questionid = db.Column(db.Integer)
	question = db.Column(db.String(600), nullable=False)
	user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
	answerchoice_1 = db.Column(db.String(50), nullable=False)
	answerchoice_2 = db.Column(db.String(50), nullable=False)
	answerchoice_3 = db.Column(db.String(50), nullable=False)
	answerchoice_4 = db.Column(db.String(50), nullable=False)
	answer = db.Column(db.Integer)

	@staticmethod
	def newest(num):
		return Quiz.query.order_by(desc(Quiz.date)).limit(num)

	def Takequiz(self, id):
		return Quiz.query.filter_by(id=id).first()


class Results(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	date = db.Column(db.DateTime, default= datetime.utcnow)
	quizid = db.Column(db.Integer,  nullable=False)
	questionid = db.Column(db.Integer, nullable=False)
	user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
	answer = db.Column(db.Integer)

	def results(self, id):
		return Results.query.filter_by(quizid=id).first()


class User(db.Model, UserMixin):
	id = db.Column(db.Integer, primary_key=True)
	email = db.Column(db.String(120), unique = True)
	password_hash = db.Column(db.String)
	quiz_taken = db.relationship('Results', backref='user', lazy='dynamic')

	@property
	def password(self):
		raise AttributeError('password: write-only field')

	@password.setter
	def password(self, password):
		self.password_hash = generate_password_hash(password)

	def check_password(self, password):
		return check_password_hash(self.password_hash, password)

	@staticmethod
	def get_by_username(username):
		return User.query.filter_by(username=username).first()

	def to_json(self):
		return dict(email=self.email)
	
	def user(self, username):
		return User.query.filter_by(username=username).first()



