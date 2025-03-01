import uuid
from rest_framework import generics, permissions, serializers, status
from rest_framework.views import APIView
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from .models import Website
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .serializers import WebsiteSerializer


class WebsitePublishToggleView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, unique_id, *args, **kwargs):
        try:
            website = Website.objects.get(owner=request.user, unique_id=unique_id)
        except Website.DoesNotExist:
            return Response({"detail": "Сайт не найден"}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get("show_in_profile")
        if new_status is None:
            return Response(
                {"detail": "Не указано новое значение для публикации"},
                status=status.HTTP_400_BAD_REQUEST
            )

        website.show_in_profile = bool(new_status)
        website.save()
        serializer = WebsiteSerializer(website)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserPublishedWebsitesView(APIView):
    permission_classes = [permissions.AllowAny]

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                'profile_id',
                openapi.IN_PATH,
                description="ID профиля (целое число)",
                type=openapi.TYPE_INTEGER,
                required=True
            )
        ]
    )
    def get(self, request, profile_id, *args, **kwargs):
        try:
            profile_id_int = int(profile_id)
        except ValueError:
            return Response(
                {"detail": "Неверный формат ID профиля"},
                status=status.HTTP_400_BAD_REQUEST
            )
        websites = Website.objects.filter(owner__id=profile_id_int, show_in_profile=True)
        if not websites.exists():
            return Response(
                {"detail": "No Website matches the given query."},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = WebsiteSerializer(websites, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)



class WebsiteViewTrackingView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, username, unique_id, *args, **kwargs):
        website = Website.objects.filter(owner__username=username, unique_id=unique_id).first()
        if website:
            website.views += 1
            website.save()
            return Response(
                {"detail": "Просмотр зарегистрирован", "views": website.views},
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"detail": "Сайт не найден"},
                status=status.HTTP_404_NOT_FOUND
            )


class WebsiteListCreateView(generics.ListCreateAPIView):
    serializer_class = WebsiteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Website.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        user = self.request.user
        current_count = Website.objects.filter(owner=user).count()
        subscription = user.profile.subscription if hasattr(user, 'profile') else 'free'
        max_sites = 1 if subscription == 'free' else 3
        if current_count >= max_sites:
            raise serializers.ValidationError("Максимальное количество сайтов достигнуто для вашей подписки.")
        unique_id = uuid.uuid4().hex[:8]
        serializer.save(owner=user, unique_id=unique_id)


class WebsiteRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = WebsiteSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'unique_id'

    def get_queryset(self):
        return Website.objects.filter(owner=self.request.user)


class WebsiteSharedRetrieveView(generics.RetrieveAPIView):
    serializer_class = WebsiteSerializer
    permission_classes = [AllowAny]
    lookup_field = 'unique_id'

    def get_queryset(self):
        username = self.kwargs.get('username')
        return Website.objects.filter(owner__username=username)
