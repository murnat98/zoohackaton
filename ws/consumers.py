from channels.generic.websocket import WebsocketConsumer


class DroneConnectConsumer(WebsocketConsumer):
    """
    Web socket consumer.
    Redirect the same message from the drone to the frontend.
    """

    def connect(self):
        self.accept()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data=None, bytes_data=None):
        self.send(text_data)
