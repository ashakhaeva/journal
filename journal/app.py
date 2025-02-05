import datetime
from datetime import date, datetime, timedelta
from dateutil.parser import parse

from bson.objectid import ObjectId
from flask import Flask, render_template, request, redirect, url_for, session, jsonify, g, flash
from werkzeug.security import check_password_hash
from werkzeug.security import generate_password_hash

from . import db
from .config import APP_CONFIG
from journal.db import get_db


def create_app():
    app = Flask(__name__, instance_relative_config=True)
    app.config["MONGO_URI"] = APP_CONFIG['MONGO_URI']
    app.secret_key = APP_CONFIG['SECRET_KEY']
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
        all_todos = {}
        for item in dates:
            day = item.strftime("%A, %b %d %Y")
            days.append(day)
            day_todos = []
            todos = db.todos.find({"user": session["user_id"], "date_time": {
                "$gte": datetime(item.year, item.month, item.day, 0, 0, 0),
                "$lte": datetime(item.year, item.month, item.day, 23, 59, 59),
            }})
            for record in todos:
                day_todos.append(record)
            all_todos[item] = day_todos
        monday = dates[0].strftime("%b %d")
        sunday = dates[6].strftime("%b %d")
        return render_template(
            'index.html',
            name=session["name"],
            week_number=week_number,
            days=days, monday=monday,
            sunday=sunday,
            dates=dates,
            all_todos=all_todos
        )
    return render_template('/login.html')


@app.route("/todo/create", methods=("POST",))
def create_todo():
    if "user_id" in session:
        date_created = datetime.today()
        user = session["user_id"]
        todo_type = request.form["todo_type"].lower()
        if todo_type not in ("meeting", "todo", "event", "item from your list"):
            return jsonify({"Success": False, "data": "Invalid input"})

        todo_text = request.form["todo_text"]
        if todo_type not in "meeting":
            todo_date_time_first = parse(request.form["todo_date_time"])
            todo_date_time = todo_date_time_first.replace(hour=00, minute=00)
        else:
            todo_date_time = parse(request.form["todo_date_time"])
        completed = False
        db = get_db(app)
        new_todo = db.todos.insert_one({
            "created": date_created,
            "user": user,
            "type": todo_type,
            "text": todo_text,
            "date_time": todo_date_time,
            "completed": completed,
        })
        return jsonify({
            "Success": True,
            "data": {
                "_id": str(new_todo.inserted_id),
                "type": todo_type,
                "text": todo_text,
                "date_time": todo_date_time.strftime('%b-%d-%Y'),
                "time": todo_date_time.strftime('%H-%M'),
            },
        })
    else:
        return jsonify({"Success": False, "data": "Invalid user"})


@app.route("/todo/edit", methods=("POST"))
def edit():
    if "user_id" in session:
        todo_type = request.form["todo_type"].lower()
        if todo_type not in ("meeting", "todo", "event", "item from your list"):
            return jsonify({"Success": False, "data": "Invalid input"})

        todo_text = request.form["todo_text"]
        if todo_type not in "meeting":
            todo_date_time_first = parse(request.form["todo_date_time"])
            todo_date_time = todo_date_time_first.replace(hour=00, minute=00)
        else:
            todo_date_time = parse(request.form["todo_date_time"])

        db = get_db(app)
        db.todos.update_one({
            "_id": ObjectId(request.form["todo_id"])},
            {"$set": {"type": todo_type, "text": todo_text, "date_time": todo_date_time}}
        )
        return jsonify({
            "Success": True,
            "data": {
                "type": todo_type, "text": todo_text,
                "date_time": todo_date_time.strftime('%b-%d-%Y'),
                "time": todo_date_time.strftime('%H-%M'),
             },
        })
    else:
        return jsonify({"Success": False, "data": "Invalid user"})


@app.route("/todo/complete", methods=("POST",))
def complete():
    if "user_id" in session:
        todo_id = request.form["todo_id"]
        completed = request.form["completed"]
        get_db(app).todos.update_one({"_id": ObjectId(todo_id)}, {"$set": {"completed": completed}})
        return jsonify({"Success": True, "data": {"completed": completed}})
    else:
        return jsonify({"Success": False, "data": "Invalid user"})


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


@app.route ("/logout", methods=("GET",))
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


if __name__ == "__main__":
    app.run(debug=True, port=5000)
