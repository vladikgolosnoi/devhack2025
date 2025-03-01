from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    middle_name = models.CharField(max_length=255)
    age = models.PositiveIntegerField(null=True, blank=True)
    profession = models.CharField(max_length=255, null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True)

    SUBSCRIPTION_CHOICES = (
         ('free', 'Free'),
         ('premium', 'Premium'),
    )
    subscription = models.CharField(max_length=20, choices=SUBSCRIPTION_CHOICES, default='free')

    reputation = models.DecimalField(max_digits=5, decimal_places=1, default=0)
    voters = models.ManyToManyField(User, related_name="rated_profiles", blank=True)

    def __str__(self):
        return f"{self.user.last_name} {self.user.first_name} {self.middle_name}"
