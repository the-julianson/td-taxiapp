# server/trips/views.py

from django.contrib.auth import get_user_model
from rest_framework import generics, viewsets, permissions
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import LoginSerializer, UserSerializer, NestedTripSerializer
from .models import Trip

from django.db.models import Q


class SignUpView(generics.CreateAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer


class LogInView(TokenObtainPairView):
    serializer_class = LoginSerializer

class TripView(viewsets.ReadOnlyModelViewSet):
    lookup_field = 'id'
    lookup_url_kwarg = 'trip_id'
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = NestedTripSerializer

    def get_queryset(self):
        user = self.request.user
        if user.group == 'driver':
            return Trip.objects.filter(
                Q(status=Trip.REQUESTED) | Q(driver=user)
            )
        if user.group == 'rider':
            return Trip.objects.filter(rider=user)
        return Trip.objects.none()