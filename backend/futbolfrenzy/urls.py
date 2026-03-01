from django.urls import include, path
from rest_framework.routers import DefaultRouter
from . import views
from . import viewsets

router = DefaultRouter()
router.register(r'drills', viewsets.DrillViewSet)

urlpatterns = [
    path('', viewsets.home, name='futbolfrenzy-home'),
    path('test/', viewsets.test, name='futbolfrenzy-test'),
    path('', include(router.urls)),




    #path('', viewsets.index, name='index'),




    #path('drills/', viewsets.drills, name='drills'),
    #path('drills/', include(router.urls)),
    #path('', views.home, name='test-home'),
    #path('test/', include(router.urls)),
]