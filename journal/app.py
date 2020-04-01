from flask import Flask, render_template, request, redirect, url_for, session, jsonify, g, flash
from . import db
from journal.db import get_db
from werkzeug.security import check_password_hash
from werkzeug.security import generate_password_hash
import datetime
from datetime import date, time, datetime, timedelta

def create_app():
    app = Flask(__name__, instance_relative_config=True)
    app.config["MONGO_URI"] = ""
    app.secret_key = b''
    with app.app_context():
        db.init_app(app)
    return app


app = create_app()


@app.route('/')
def get_current_week():
    today = date.today()
    today_tup = date(today.year, today.month, today.day).isocalendar()
    week_number = today_tup[1]
    weekday = today.weekday()
    start = today - timedelta(days=weekday)
    dates = [start + timedelta(days=d) for d in range(7)]
    days = []
    for i in dates:
        day = i.strftime("%A, %b %d %Y")
        days.append(day)
    monday = dates[0].strftime("%b %d")
    sunday = dates[6].strftime("%b %d")


    if "name" in session:
        return render_template('index.html', name=session["name"])
    return render_template('index.html', week_number = week_number, days = days, monday = monday, sunday = sunday)


@app.route('/another')
def another():
    return "Another route"


@app.route("/login", methods=("GET", "POST"))
def login():
    if request.method == "GET":
        return render_template('login.html')

    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]
        db = get_db(app)
        error = None
        user = db.users.find_one({"email": email})

        if user is None:
            error = "Incorrect email."
        elif not check_password_hash(user["password"], password):
            error = "Incorrect password."
        if error is None:
            session.clear()
            session["name"] = user["name"]
            # # session["user._id"] = user_id
            return redirect('/')
        flash(error)
        return render_template('/login.html')
@app.route ("/logout", methods=["GET"])
def log_out():
    session.clear()
    return redirect("/")

@app.route("/signup", methods=("GET", "POST"))
def sign_up():
    if request.method == "GET":
        return render_template('signup.html')
    if request.method == "POST":
        name = request.form["name"]
        email = request.form["email"]
        password = request.form["password"]
        db = get_db(app)
        error = None

        if not name:
            error = "Name is required."
        elif not email:
            error = "Email is required."
        elif not password:
            error = "Password is required."
        elif db.users.find_one({"email": email}) is not None:
            error = "This email is used by another user"

        if error is None:
            db.users.insert_one({"name": name, "email": email, "password": generate_password_hash(password)})
            return redirect('/login')
        flash(error)
        return render_template("signup.html")





@app.route('/testing_db')
def show_users():
    user = g.db.users.find_one({"name": "Anastasia"})
    return jsonify({"name": user["name"]})




if __name__ == "__main__":
    app.run(debug=True, port=5000)
