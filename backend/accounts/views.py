from rest_framework import status, permissions
from rest_framework.views import APIView
from drf_yasg.utils import swagger_auto_schema
from .serializers import RegistrationSerializer, ProfileSerializer, UserSerializer
from .models import Profile
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from django.contrib.auth.models import User


class TopProfilesView(generics.ListAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Profile.objects.order_by("-reputation")[:10]


class RatingStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        target_profile = get_object_or_404(Profile, user_id=user_id)
        has_voted = target_profile.voters.filter(id=request.user.id).exists()
        return Response({"has_voted": has_voted}, status=status.HTTP_200_OK)


class RatingUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        if request.user.profile.subscription == "premium":
            value = 2
        else:
            value = 1
        # Запрещаем оценивать собственный профиль
        if request.user.id == user_id:
            return Response({"detail": "Нельзя оценивать собственный профиль."}, status=status.HTTP_400_BAD_REQUEST)

        target_profile = get_object_or_404(Profile, user_id=user_id)

        # Проверяем, голосовал ли уже данный пользователь
        if target_profile.voters.filter(id=request.user.id).exists():
            return Response({"detail": "Вы уже голосовали за этот профиль.", "has_voted": True},
                            status=status.HTTP_400_BAD_REQUEST)

        action = request.data.get("action")
        if action not in ["plus", "minus"]:
            return Response({"detail": "Неверное действие."}, status=status.HTTP_400_BAD_REQUEST)

        if action == "plus":
            target_profile.reputation = round(target_profile.reputation + value, 1)
        else:
            target_profile.reputation = round(target_profile.reputation - value, 1)

        # Записываем, что пользователь проголосовал
        target_profile.voters.add(request.user)
        target_profile.save()
        return Response({
            "detail": "Рейтинг обновлён",
            "reputation": float(target_profile.reputation),
            "has_voted": True
        }, status=status.HTTP_200_OK)


class UserListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = User.objects.all()
    serializer_class = ProfileSerializer

    def get_queryset(self):
        return Profile.objects.all()


class UsersDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    @swagger_auto_schema(
        responses={200: ProfileSerializer()}
    )
    def get(self, request, user_id):
        try:
            profile = Profile.objects.get(user_id=user_id)
            serializer = ProfileSerializer(profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Profile.DoesNotExist:
            return Response({"detail": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)


class ProfileDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile = request.user.profile
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    @swagger_auto_schema(
        request_body=RegistrationSerializer,
        responses={201: "Пользователь успешно зарегистрирован", 400: "Ошибка валидации"}
    )
    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Пользователь успешно зарегистрирован"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        request_body=ProfileSerializer,
        responses={200: "Профиль успешно обновлён", 400: "Ошибка валидации"}
    )
    def put(self, request):
        user = request.user
        profile = user.profile

        # Извлекаем данные пользователя прямо из тела запроса
        user_data = {
            'email': request.data.get('email'),
            'first_name': request.data.get('first_name'),
            'last_name': request.data.get('last_name'),
        }

        user_serializer = UserSerializer(user, data=user_data, partial=True)

        # Если данные пользователя валидны, сохраняем их
        if user_serializer.is_valid():
            user_serializer.save()
        else:
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Извлекаем данные профиля
        profile_data = {
            'middle_name': request.data.get('middle_name'),
            'age': request.data.get('age'),
            'profession': request.data.get('profession'),
            'bio': request.data.get('bio'),
        }

        # Если аватар передан, добавляем его в данные для обновления
        avatar = request.data.get('avatar')
        if avatar:
            profile_data['avatar'] = avatar

        profile_serializer = ProfileSerializer(profile, data=profile_data, partial=True)

        # Если данные профиля валидны, сохраняем их
        if profile_serializer.is_valid():
            profile_serializer.save()
        else:
            return Response(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Профиль успешно обновлён"})
