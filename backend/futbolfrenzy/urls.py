from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='test-home'),
    path('get_presigned_url/', views.get_presigned_url, name='get_presigned_url'),
]