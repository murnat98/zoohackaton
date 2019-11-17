from django.db import models


class Drones(models.Model):
    """
    Model, storing old drone information.
    """
    drone_id = models.PositiveIntegerField(name='drone_id', verbose_name='Drone number', unique=True)

    def __str__(self):
        return 'Drone #%d' % self.id

    class Meta:
        verbose_name = 'Drone'
        verbose_name_plural = 'Drones'
