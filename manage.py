from athena4math import app, db
from flask.ext.script import Manager, prompt_bool

from athena4math.models import User

manager = Manager(app)

@manager.command
def initdb():
	db.create_all()
	db.session.add(User( email='selwyntheo@gmail.com', password="test"))
	db.session.add(User(email='serenelove@gmail.com', password="test"))
	db.session.commit()
	print "Initialized the database"

@manager.command
def dropdb():
	if prompt_bool("Are you sure you want to lose all your data"):
		db.drop_all()
		print "Dropped the database"


if __name__ == '__main__':
	manager.run()