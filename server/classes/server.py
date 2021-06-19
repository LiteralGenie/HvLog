import utils, ujson
from tornado.websocket import WebSocketHandler
from tornado.web import Application
from classes import EventLinker, Enumerator, EventParser


class Server(Application):
    def __init__(self):
        handlers= []
        self.config= utils.load_yaml(utils.CONFIG_FILE)['server']

        handlers.append(('/test', create_test_handler()))

        super().__init__(handlers)
        self.listen(self.config['port'])

class CorsMixin:
    def check_origin(self, origin):
        return True

def create_test_handler():
    with open(utils.SRC_DIR + "tests/surtr_1.txt") as data:
        cln= lambda x: x.replace("---SEP---", "").strip()
        lines= [cln(x) for x in data.readlines() if cln(x)]

    events= [EventParser.get_event(x) for x in lines]
    events= Enumerator.enumerate(events)
    events= EventLinker.set_links(events)
    primary_events= [x for x in events if x.source is None]

    data= f"[{','.join(x.serialize() for x in primary_events)}]"

    with open("./test.json", "w+") as file:
        ujson.dump([x.as_dict() for x in primary_events], file, indent=2)

    class TestHandler(CorsMixin, WebSocketHandler):
        def open(self):
            print('open')
            self.write_message(data)

        # async def on_message(self, message):
        #     print('write')
        #     await

    return TestHandler