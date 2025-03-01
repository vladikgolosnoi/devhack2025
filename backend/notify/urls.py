from django.urls import path
from .views import NotificationListView, GiftClaimView, MarkNotificationsReadView

urlpatterns = [
    path('notifications/', NotificationListView.as_view(), name='notifications'),
    path('gift-claim/', GiftClaimView.as_view(), name='gift-claim'),
    path('mark-read/', MarkNotificationsReadView.as_view(), name='mark-read'),
]
