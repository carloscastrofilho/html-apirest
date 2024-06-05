import sys
import importlib
from flask_cors import CORS  

from app import create_app
from config import app_config, app_active

config = app_config[app_active]
config.APP = create_app(app_active)

CORS(config.APP) 

if __name__ == '__main__':
    config.APP.run(host=config.IP_HOST, port=config.PORT_HOST)
    importlib.reload(sys)