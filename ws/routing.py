from django.urls import re_path

from ws.consumers import DroneConnectConsumer

websocket_urlpatterns = [
    re_path(r'data/$', DroneConnectConsumer),
]
