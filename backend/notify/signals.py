from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from notify.models import Notification

@receiver(post_save, sender=User)
def create_registration_notifications(sender, instance, created, **kwargs):
    if created:
        # Уведомление с благодарностью за регистрацию
        Notification.objects.create(
            user=instance,
            message="Спасибо за регистрацию! Мы рады, что вы присоединились к нашему сообществу.",
            type="registration"
        )
        # Уведомление с подарком для новых пользователей
        Notification.objects.create(
            user=instance,
            message="Подарок для новых пользователей во время бета тестирования. Спасибо за участие.",
            type="gift"
        )
