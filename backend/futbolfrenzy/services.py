from .models import Notification

def notify_user(user, title, description, icon, iconBackground="#FFFFFF", url=None):
  
    Notification.objects.create(
        userID=user,
        title=title,
        description=description,
        icon=icon,
        iconBackground=iconBackground,
        url=url,
        read=False,
    )