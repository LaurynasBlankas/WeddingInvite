from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('', views.HomePageView, name='home'),
    path('rsvp/', views.RSVPPageView, name='rsvp'),
    path('rsvp/submit/', views.RSVPSubmitView, name='rsvp_submit'),
    path('about/', views.AboutPageView, name='about'),
]
