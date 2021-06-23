from utils import server_utils
from tornado.websocket import WebSocketHandler
from tornado.web import RequestHandler
import random, ujson


class CorsMixin:
    def check_origin(self, origin):
        return True

def test_log_socket():
    class TestSocket(CorsMixin, WebSocketHandler):
        async def on_message(self, message):
            pass

    return TestSocket

def test_log_route(root):
    class TestRequest(RequestHandler):
        async def get(self):
            logs= root['logs'].values()
            ind= random.randint(0,len(logs))
            log= logs[ind]
            self.write(log.as_dict())

    return TestRequest

# expected POST kwargs:
#   age: int        -- logs used for result will be no older than this value, mark negative to allow all results
#   filters: [str]  -- names of filters to apply
#   indexes: [str]  -- names of indexers to use for response
# @todo: handle bad request
# @todo: compression
def extract_test_route(root):
    class RequestTest(RequestHandler):
        async def get(self):
            return self.post()

        async def post(self):
            # if the POST data isnt form-encoded, body_arguments is empty and body is bytes, so don't use get_body_arguments
            body= ujson.loads(self.request.body.decode('utf-8'))
            kwargs= ujson.loads(body['kwargs'])
            print('extract test:', kwargs)

            resp_dict= server_utils.get_extract(root, **kwargs)
            resp= ujson.dumps(resp_dict)


            self.write(resp)
            # print('wrote', resp_dict)

    return RequestTest