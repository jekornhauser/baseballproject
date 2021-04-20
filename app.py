import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, inspect, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Float

from flask import Flask, jsonify, render_template

import datetime as dt
import numpy as np
import pandas as pd

engine = create_engine('sqlite:///players.db', echo = True)
Base = automap_base()
Base.prepare(engine, reflect=True)

app = Flask(__name__)

@app.route('/')
def index():
    '''Return to homepage.'''
    return render_template('index.html')

@app.route('/query/<query>')
def query(query):
    '''Returns user selected query.'''
    x = []
    y = []
    z = []
    print(query)
    print("Break----------------")
    query = query.replace("&","AND")
    print(query)
    print("Break----------------")
    query = query.replace("Total ","SUM")
    print(query)
    print("Break----------------")
    query2 = query.replace("SUMRBIs","SUM(RBIs)")
    query2 = query2.replace("SUMHomeruns","SUM(Homeruns)")
    query2 = query2.replace("SUMTriples","SUM(Triples)")
    query2 = query2.replace("SUMDoubles","SUM(Doubles)")
    query3 = query2.replace("SUMHits","SUM(Hits)")
    query3 = query3.replace("SUMRuns","SUM(Runs)")
    print(query3)
    print("Break----------------")
    
    with engine.connect() as con:
        rs = con.execute(query3)
        for row in rs:
             x.append(row[0])
             y.append(row[1])
             z.append(row[2])
    return jsonify(x,y,z)
    
    

@app.route('/teamlist/')
def teamlist():
    x=[]
#returns all distinct team names
    with engine.connect() as con:
        rs = con.execute('SELECT DISTINCT Team FROM players ORDER BY Team ASC')
        for row in rs:
            x.append(row[0])
    return jsonify(x)

@app.route('/seasonlist/')
def seasonlist():
    x=[]
#returns all distinct years
    with engine.connect() as con:
        rs = con.execute('SELECT DISTINCT Year FROM players ORDER BY Year ASC')
        for row in rs:
            x.append(row[0])
    return jsonify(x)

@app.route('/leaguelist/')
def leaguelist():
    x=[]
#returns all distinct leagues
    with engine.connect() as con:
        rs = con.execute('SELECT DISTINCT League FROM players ORDER BY League ASC')
        for row in rs:
            x.append(row[0])
    return jsonify(x)

@app.route('/random/')
def random():
    x=[]
    y=[]
    with engine.connect() as con:
        rs = con.execute("SELECT Name, SUM(RBIs) FROM players WHERE (Team='BAL') ORDER BY SUM(RBIs) DESC LIMIT 50")
        for row in rs:
            x.append(row[0])
            y.append(row[1])        
    return jsonify(x,y)

if __name__ == '__main__':
    app.run(debug=True)