from tornado.web import Application
from . import *
from utils.db_utils import load_db
import utils


class Server(Application):
    def __init__(self):
        # inits
        handlers= []
        db,root= load_db()
        self.config= utils.load_yaml(utils.CONFIG_FILE)['server']

        # routes
        handlers.append(('/extract_tr', extract_test_route(root)))

        # start server
        super().__init__(handlers)
        self.listen(self.config['port'])