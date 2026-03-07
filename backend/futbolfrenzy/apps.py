from django.apps import AppConfig


class FutbolfrenzyConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'futbolfrenzy'

    # stuff for token creation with new users
    def ready(self):
        import futbolfrenzy.signals
