from django.urls import re_path

from ws.consumers import DroneConsumer, FrontendConsumer

websocket_urlpatterns = [
    re_path(r'drone/$', DroneConsumer),
    re_path(r'frontend/$', FrontendConsumer),
]
