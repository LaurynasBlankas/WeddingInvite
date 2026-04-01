import json

from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_POST

from .models import RSVPSubmission

def HomePageView(request):
    return render(request, 'home.html')

def RSVPPageView(request):
    return render(request, 'RSVP.html')


@require_POST
def RSVPSubmitView(request):
    try:
        payload = json.loads(request.body or '{}')
    except json.JSONDecodeError:
        return JsonResponse({'ok': False, 'error': 'Invalid JSON payload.'}, status=400)

    guest_name = str(payload.get('guest_name', '')).strip()
    attendance = str(payload.get('attendance', '')).strip()
    driving = str(payload.get('driving', '')).strip()
    food = str(payload.get('food', '')).strip()
    alcohol = str(payload.get('alcohol', '')).strip()
    soft_drinks = str(payload.get('soft_drinks', '')).strip()
    music = str(payload.get('music', '')).strip()

    if not guest_name or not attendance:
        return JsonResponse({'ok': False, 'error': 'Name and attendance are required.'}, status=400)

    ceremony_only = attendance == 'no_ceremony_only'
    if not ceremony_only and (not driving or not food or not alcohol or not soft_drinks or not music):
        return JsonResponse({'ok': False, 'error': 'Please answer all RSVP questions before submitting.'}, status=400)

    submission = RSVPSubmission.objects.create(
        guest_name=guest_name,
        attendance=attendance,
        driving=driving,
        food=food,
        alcohol=alcohol,
        soft_drinks=soft_drinks,
        music=music,
    )

    return JsonResponse({'ok': True, 'id': submission.id})

def AboutPageView(request):
    return render(request, 'about.html')
