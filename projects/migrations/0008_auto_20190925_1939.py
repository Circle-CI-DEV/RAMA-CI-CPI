# Generated by Django 2.1.1 on 2019-09-26 00:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0007_auto_20190425_1814'),
    ]

    operations = [
        migrations.AddField(
            model_name='historicalproject',
            name='k12_flag',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='project',
            name='k12_flag',
            field=models.BooleanField(default=False),
        ),
    ]
