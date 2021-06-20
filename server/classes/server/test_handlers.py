import random, time
from tornado.websocket import WebSocketHandler
from tornado.web import RequestHandler


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
#   recency: int    -- results will be no older than this value, mark negative to allow all results
#   filters: [str]  -- names of filters to apply
#   indexes: [str]  -- names of indexers to use for response
# @todo: handle bad request
# @todo: indexers
def test_request_route(root):
    class RequestTest(RequestHandler):
        async def get(self):
            return self.post()

        async def post(self):
            recency= self.get_body_argument('recency')
            logs= root['logs'].values(min=recency)
            print('num logs filtered', len(logs))

        @classmethod
        def get_response(cls, recency=0, filters=None, indexers=None):
            filters= filters or []
            indexers= indexers or []

            filters= [root['filters'][x.lower()] for x in filters]
            start= time.time() - recency

            ret= root['logs'].values(min=start)
            for f in filters:
                ret= f.filter_logs(ret)
