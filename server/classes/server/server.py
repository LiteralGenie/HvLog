from tornado.web import Application
from ZODB import FileStorage, DB
from zc.zlibstorage import ZlibStorage
from persistent.mapping import PersistentMapping
from . import *
import utils


def load_db() -> (DB, PersistentMapping):
    storage= ZlibStorage(FileStorage.FileStorage(utils.PROJ_DIR + 'scratch/db_data/test_db_1.fs'))
    db= DB(storage)
    connection= db.open()
    root= connection.root()
    return (db,root)


class Server(Application):
    def __init__(self):
        db,root= load_db()

        handlers= []
        self.config= utils.load_yaml(utils.CONFIG_FILE)['server']

        handlers.append(('/test_log_socket', test_log_socket()))
        handlers.append(('/test_log_request', test_log_route(root)))

        super().__init__(handlers)
        self.listen(self.config['port'])