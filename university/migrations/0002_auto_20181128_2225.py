# Generated by Django 2.1.1 on 2018-11-29 04:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('university', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='college',
            name='college_name',
            field=models.CharField(max_length=255, unique=True),
        ),
    ]
