from django.db import models


class RSVPSubmission(models.Model):
    guest_name = models.CharField(max_length=200)
    attendance = models.CharField(max_length=50)
    driving = models.CharField(max_length=100, blank=True)
    food = models.CharField(max_length=50, blank=True)
    alcohol = models.TextField(blank=True)
    soft_drinks = models.TextField(blank=True)
    music = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.guest_name
