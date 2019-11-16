from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

front_channel = ''


class DroneConsumer(WebsocketConsumer):
    """
    Web socket consumer.
    Redirect the same message from the drone to the frontend.
    """

    def disconnect(self, close_code):
        """
        TODO: report some error
        """

    def receive(self, text_data=None, bytes_data=None):
        async_to_sync(self.channel_layer.send)(
            front_channel,
            {
                'type': 'front',
                'data': text_data
            }
        )
        self.send(text_data)


class FrontendConsumer(WebsocketConsumer):
    def connect(self):
        global front_channel
        front_channel = self.channel_name
        super().connect()

    def front(self, event):
        self.send(event['data'])

    def disconnect(self, code):
        pass
