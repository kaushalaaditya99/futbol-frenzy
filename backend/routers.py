from rest_framework import routers

from futbolfrenzy.viewsets import AccountViewSet

router = routers.SimpleRouter()

router.register(r'account', AccountViewSet, basename="account")

urlpatterns = router.urls