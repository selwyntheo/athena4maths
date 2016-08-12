import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
import logging
import logging.handlers
import ConfigParser

basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)

# Configure app
app.config['TOKEN_SECRET'] = '~t\x02\xed\x187T\xc6\xa9\xfc\xe8p\x1f\xaa\xbe2R\xc4\xc5\x8a97TA?'

#Configure Database
app.config['SECRET_KEY'] = '~t\x02\xed\x187T\xc6\xa9\xfc\xe8p\x1f\xaa\xbe2R\xc4\xc5\x8a97TA?'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'athena.db')
app.config['DEBUG'] = True
db = SQLAlchemy(app)

# Configure authentication

login_manager = LoginManager()
login_manager.session_protection = "strong"
login_manager.login_view = "login"
login_manager.init_app(app)

# Initialize config reader
config = ConfigParser.ConfigParser()
config.read('conf/app.conf')


import models
import views 
