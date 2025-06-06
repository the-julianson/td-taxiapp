# Generated by Django 4.1.3 on 2025-04-09 14:50

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('trips', '0002_trip'),
    ]

    operations = [
        migrations.AddField(
            model_name='trip',
            name='driver',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='trips_as_driver', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='trip',
            name='rider',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='trips_as_rider', to=settings.AUTH_USER_MODEL),
        ),
    ]
