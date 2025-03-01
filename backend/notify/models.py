from django.db import models
from django.contrib.auth.models import User

class Notification(models.Model):
    NOTIF_TYPE_CHOICES = (
        ('registration', 'Registration'),
        ('gift', 'Gift'),
        ('info', 'Info'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    message = models.CharField(max_length=255)
    type = models.CharField(max_length=20, choices=NOTIF_TYPE_CHOICES, default='info')
    is_read = models.BooleanField(default=False)
    claimed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user.username}: {self.message}"
