# Generated by Django 2.1.1 on 2018-10-15 03:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0002_auto_20181013_2256'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='avatar',
            field=models.ImageField(blank=True,default='profile_image/default.jpg', null=True, upload_to='profile_image'),
        ),
    ]