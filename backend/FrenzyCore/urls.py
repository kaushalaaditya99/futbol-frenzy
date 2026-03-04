"""
URL configuration for FrenzyCore project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from routers import router

urlpatterns = [
    path('admin/', admin.site.urls),
    # The paths defined in futbolfrenzy.urls
    # are included here. Since the route in this
    # path is an empty string, there'd be no prefix.
    # If the route was 'futbolfrenzy/', you'd then
    # access the routes like 'futbolfrenzy/api/...'
    # instead of 'api/...'.
    path('', include('futbolfrenzy.urls')),
]