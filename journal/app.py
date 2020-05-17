from flask import Flask, render_template, request, redirect, url_for, session, jsonify, g, flash
from . import db
from journal.db import get_db
from werkzeug.security import check_password_hash
from werkzeug.security import generate_password_hash
import datetime
from datetime import date, time, datetime, timedelta
from dateutil.parser import parse

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
    if "user_id" in session:
        today = datetime.today()
        today_tup = date(today.year, today.month, today.day).isocalendar()
        week_number = today_tup[1]
        weekday = today.weekday()
        start = today - timedelta(days=weekday)
        dates = [start + timedelta(days=d) for d in range(7)]
        days = []
        db = get_db(app)
        for i in dates:
            day = i.strftime("%A, %b %d %Y")
            days.append(day)
            todos = db.todos.find({"user": session["user_id"], "date_time": i})
        monday = dates[0].strftime("%b %d")
        sunday = dates[6].strftime("%b %d")

    # забрать все туду для каждого дня недели и данного юзера
    # передать в шаблон нужные переменные
    # каждый туду показать как li в соответствующем дне

        return render_template('index.html', name=session["name"], week_number = week_number, days = days, monday = monday, sunday = sunday, dates = dates)
    return render_template('index.html', week_number = week_number, days = days, monday = monday, sunday = sunday, dates = dates)

@app.route("/todo/create", methods=("POST",))
def create_todo():
    if "user_id" in session:
        print(request.form)
        date_created = datetime.today()
        user = session["user_id"]
        todo_type = request.form["todo_type"].lower()
        if todo_type not in ("meeting", "todo", "event", "item from your list"):
            return jsonify({"Error": "Invalid input"})

        todo_text = request.form["todo_text"]
        todo_date_time = parse(request.form["todo_date_time"])
        completed = False
        db = get_db(app)
        db.todos.insert_one({"created": date_created, "user": user, "type": todo_type, "text": todo_text, "date_time": todo_date_time, "completed": completed})
        return jsonify({"Success": True})
    else:
        return jsonify({"Error": "Invalid user"})

@app.route('/another')
def another():
    if "user_id" in session:
        today = date.today()
        today_tup = date(today.year, today.month, today.day).isocalendar()
        week_number = today_tup[1]
        weekday = today.weekday()
        start = today - timedelta(days=weekday)
        dates = [start + timedelta(days=d) for d in range(7)]
        days = []
        db = get_db(app)
        for item in dates:
            day = item.strftime("%A, %b %d %Y")
            days.append(day)
            todos = db.todos.find_one({"user": session["user_id"], "date_time": {"$gte": newDate(item), "$lte": newDate(item)}})
        monday = dates[0].strftime("%b %d")
        sunday = dates[6].strftime("%b %d")

    # забрать все туду для каждого дня недели и данного юзера
    # передать в шаблон нужные переменные
    # каждый туду показать как li в соответствующем дне

        return jsonify(todos)



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
            session["user_id"] = str(user["_id"])
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
