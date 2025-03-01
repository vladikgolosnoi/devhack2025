from django.db import models
from django.contrib.auth.models import User

class Website(models.Model):
    SITE_TYPES = (
        ('minimalism', 'Minimalism'),
        ('constructor', 'Constructor'),
    )
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="websites")
    name = models.CharField(max_length=255)
    site_type = models.CharField(max_length=20, choices=SITE_TYPES)
    unique_id = models.CharField(max_length=50, unique=True)
    data = models.JSONField(default=dict, blank=True)
    views = models.PositiveIntegerField(default=0)
    show_in_profile = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.owner.username})"
