from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Notification
from .serializers import NotificationSerializer

class NotificationListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NotificationSerializer

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by("-created_at")


class GiftClaimView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            gift_notif = Notification.objects.get(user=request.user, type='gift', claimed=False)
        except Notification.DoesNotExist:
            return Response({'detail': 'Нет доступных подарков'}, status=status.HTTP_400_BAD_REQUEST)

        profile = request.user.profile

        # Если подписка бесплатная, обновляем до Premium
        if profile.subscription != 'premium':
            profile.subscription = 'premium'
            profile.save()
            message = 'Подарок успешно активирован. Ваша подписка обновлена до Premium!'
        else:
            message = 'Вы уже имеете Premium подписку.'

        gift_notif.claimed = True
        gift_notif.save()

        return Response({'detail': message}, status=status.HTTP_200_OK)


class MarkNotificationsReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        notifications = Notification.objects.filter(user=request.user, is_read=False)
        notifications.update(is_read=True)
        return Response({'detail': 'Уведомления отмечены как прочитанные'}, status=status.HTTP_200_OK)
