from flask import Flask, render_template, request, redirect, url_for, session, jsonify, g
from . import db

email = "ash@ash"
password = "12345"
name = "Anastasia"


def create_app():
    app = Flask(__name__, instance_relative_config=True)
    app.config["MONGO_URI"] = ""
    app.secret_key = b''
    with app.app_context():
        db.init_app(app)
    return app


app = create_app()


@app.route('/')
def hello_world():
    if "name" in session:
        return render_template('index.html', name=name)
    return render_template('index.html')


@app.route('/another')
def another():
    return "Another route"


@app.route("/login", methods=("GET", "POST"))
def login():
    if request.method == "GET":
        return render_template('login.html')
    error = None
    if request.form['email'] == email and request.form['password'] == password:
        print("Hello, Anastasia!")
        if error is None:
            session.clear()
            session["name"] = name
            return redirect('/')

    else:
        return redirect('/login')


@app.route('/testing_db')
def show_users():
    user = g.db.users.find_one({"name": "Anastasia"})
    return jsonify({"name": user["name"]})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
