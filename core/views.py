from django.views.generic import TemplateView

from zoohackaton import settings


class MapsView(TemplateView):
    template_name = 'core/maps.html'

    def get_context_data(self, **kwargs):
        if 'maps_api_key' not in kwargs:
            kwargs['maps_api_key'] = settings.config['MAPS-API']['api_key']
        return super().get_context_data(**kwargs)
