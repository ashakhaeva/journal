from flask import Flask, render_template, request, redirect, url_for, session



app = Flask(__name__)

app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

email = "ash@ash"
password = "12345"
name = "Anastasia"

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
            return redirect ('/')

    else:
        return redirect ('/login')
        print("No such user")











if __name__ == "__main__":
    app.run(debug=True, port=5000)


