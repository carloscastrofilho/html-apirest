# -*- coding: utf-8 -*-
from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from sqlalchemy import create_engine, text
from json import dumps

# config import
from config import app_config, app_active

config = app_config[app_active]

db_connect = create_engine('mysql+mysqlconnector://root@localhost/fatec')

def create_app(config_name):
    app = Flask(__name__, template_folder='templates')
    
    app.secret_key = config.SECRET
    app.config.from_object(app_config[config_name])
    app.config.from_pyfile('config.py')

    # rota basica 
    @app.route('/monitoramento', methods=['GET', 'POST', 'PUT', 'DELETE'])
    def monitoramento():
        if ( request.method == "GET" ):
            conn = db_connect.connect()
            query = conn.execute(text('select * from monitoramento order by temperatura'))
            result = [dict(zip(tuple(query.keys()), i)) for i in query.cursor]
            return jsonify(result)
            
        elif ( request.method == "POST" ):
           conn = db_connect.connect()
           temperatura = request.json['temperatura']
           umidade = request.json['umidade']
           dispositivo = request.json['dispositivo']
           conn.execute(text("insert into monitoramento (temperatura, umidade, dispositivo) values ( '{0}', '{1}', '{2}')".format(temperatura, umidade, dispositivo)))
           conn.commit()
           query = conn.execute(text('select * from monitoramento order by temperatura'))
           result = [dict(zip(tuple(query.keys()), i)) for i in query.cursor]
           return jsonify(result)

        elif ( request.method == "PUT" ):
            conn = db_connect.connect()
            temperatura = request.json['temperatura']
            umidade = request.json['umidade']
            dispositivo = request.json['dispositivo']
            id_ = request.json['Id']
            query = conn.execute(text("update monitoramento set temperatura = '{0}', umidade = '{1}', dispositivo = '{2}' where Id = {3}".format(temperatura, umidade, dispositivo, id_)))
            conn.commit()
            query = conn.execute(text('select * from monitoramento order by temperatura'))
            result = [dict(zip(tuple(query.keys()), i)) for i in query.cursor]
            return jsonify(result)
        
        elif ( request.method == "DELETE" ):
            conn = db_connect.connect()
            id_ = request.json['Id']
            query = conn.execute(text("delete from monitoramento where Id = {0}".format(id_)))
            conn.commit()
            query = conn.execute(text('select * from monitoramento order by temperatura'))
            result = [dict(zip(tuple(query.keys()), i)) for i in query.cursor]
            return jsonify(result)
    
    @app.route('/monitoramento/recentes', methods=['GET'])
    def ultimas_medições():
        if (request.method == "GET"):
            conn = db_connect.connect()
            query = conn.execute(text('select * from monitoramento order by id desc LIMIT 20'))
            result = [dict(zip(tuple(query.keys()), i)) for i in query.cursor]
            return jsonify(result)
        
    @app.route('/monitoramento/<string:dispositivo>', methods=["GET"])
    def get(dispositivo):
        conn = db_connect.connect()
        
        query = conn.execute(text("select * from monitoramento where dispositivo = '{0}' order by temperatura".format(dispositivo)))

        result = [dict(zip(tuple(query.keys()), i)) for i in query.cursor]

        return jsonify(result)
        
    return app