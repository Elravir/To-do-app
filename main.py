from flask import Flask, jsonify, request, render_template
import MySQLdb
import json

app = Flask(__name__)

DB_CONFIG = {
    "user": "user",
    "passwd": "passwd",
    "host": "host",
    "db": "db_name"
}

def get_db_connection():
    return MySQLdb.connect(**DB_CONFIG)

def fetch_meetings():
    with get_db_connection() as db:
        cursor = db.cursor()
        cursor.execute("SELECT id_meet, id_room FROM meet")
        rows = cursor.fetchall()
    return [{"id_meet": row[0], "id_room": row[1]} for row in rows]


def fetch_tasks():
    with get_db_connection() as db:
        cursor = db.cursor()
        query = """
            SELECT tk.id_task, tk.name_task, tk.id_meet, tk.done, tk.description,
                   tm.data_start, tm.data_end, tm.time_start, tm.time_end, tm.all_day
            FROM task tk
            JOIN time tm ON tk.id_task = tm.id_task
        """
        cursor.execute(query)
        rows = cursor.fetchall()
    return [
        {
            "id": row[0],
            "title": row[1],
            "idMeet": row[2],
            "done": bool(row[3]),
            "desc": row[4],
            "date": str(row[5]),
            "end": str(row[6]),
            "time": str(row[7]),
            "timeEnd": str(row[8]),
            "allDay": bool(row[9])
        }
        for row in rows
    ]


def clear_tasks():
    with get_db_connection() as db:
        cursor = db.cursor()
        cursor.execute("DELETE FROM time")
        cursor.execute("DELETE FROM task")
        db.commit()


def save_tasks(tasks):
    with get_db_connection() as db:
        cursor = db.cursor()
        for task in tasks:
            cursor.execute("""
                INSERT INTO task (id_task, name_task, id_meet, done, description)
                VALUES (%s, %s, %s, %s, %s)
            """, (task["id"], task["title"], task["idMeet"], task["done"], task["desc"]))
            cursor.execute("""
                INSERT INTO time (id_task, time_start, time_end, data_start, data_end, all_day)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (task["id"], task["time"], task["timeEnd"], task["date"], task["end"], task["allDay"]))
        db.commit()



@app.route('/')
def index():
    return render_template('index1.html')

@app.route('/index1.html')
def index1():
    return render_template('index1.html')

@app.route('/index.html')
def admin():
    return render_template('index.html')

@app.route('/getMeet', methods=['GET'])
def api_get_meet():
    return jsonify(fetch_meetings())

@app.route('/getData', methods=['GET'])
def api_get_data():
    return jsonify(fetch_tasks())

@app.route('/saveData', methods=['POST'])
def api_save_data():
    try:
        tasks = request.get_json()
        clear_tasks()
        save_tasks(tasks)
        return jsonify({"message": "Tasks saved successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
