from django.contrib import admin

from drones.models import Drones


@admin.register(Drones)
class DronesAdmin(admin.ModelAdmin):
    pass
