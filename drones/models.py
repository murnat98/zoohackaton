from django.db import models


class Drones(models.Model):
    """
    Model, storing old drone information.
    """
    latitude = models.FloatField(name='latitude', verbose_name='latitude', blank=True)
    longitude = models.FloatField(name='longitude', verbose_name='longitude', blank=True)

    def __str__(self):
        return 'Drone #%d' % self.id

    class Meta:
        verbose_name = 'Drone'
        verbose_name_plural = 'Drones'
