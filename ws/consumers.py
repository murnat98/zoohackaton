import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

from drones.models import Drones

group_name = 'user_group'


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
        drone = json.loads(text_data)
        drone_id = drone['drone_id']

        try:
            Drones.objects.get(drone_id=drone_id)
        except Drones.DoesNotExist:
            self.send(json.dumps({
                'error': 'Drone #%d is not registered in system.' % drone_id
            }))
        else:
            async_to_sync(self.channel_layer.group_send)(
                group_name,
                {
                    'type': 'front',
                    'data': text_data
                }
            )


class FrontendConsumer(WebsocketConsumer):
    def connect(self):
        async_to_sync(self.channel_layer.group_add)(
            group_name,
            self.channel_name
        )
        super().connect()

    def front(self, event):
        self.send(event['data'])

    def disconnect(self, code):
        async_to_sync(self.channel_layer.group_discard)(
            group_name,
            self.channel_name
        )
