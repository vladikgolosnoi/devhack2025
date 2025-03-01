from django.contrib import admin
from .models import Notification

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'message', 'type', 'is_read', 'claimed', 'created_at')
    list_filter = ('type', 'is_read', 'claimed', 'created_at')
    search_fields = ('user__username', 'message')
