from django.contrib import admin
from .models import RSVPSubmission


@admin.register(RSVPSubmission)
class RSVPSubmissionAdmin(admin.ModelAdmin):
    list_display = ('guest_name', 'attendance', 'driving', 'food', 'created_at')
    search_fields = ('guest_name', 'attendance', 'driving', 'food', 'alcohol', 'soft_drinks', 'music')
