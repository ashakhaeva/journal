from flask import g
from flask_pymongo import PyMongo


def get_db(app):
    if 'db' not in g:
        g.db = PyMongo(app).db
    return g.db


def close_db(e=None):
    g.pop('db', None)


def init_app(app):
    app.teardown_appcontext(close_db)
    get_db(app)
