import utils
from tornado.ioloop import IOLoop
from classes.server import Server

utils.configure_logging()
if __name__ == "__main__":
    app= Server()
    IOLoop.current().start()