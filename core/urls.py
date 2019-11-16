from django.urls import path

from core.views import MapsView

app_name = 'core'

urlpatterns = [
    path('', MapsView.as_view(), name='maps'),
]
