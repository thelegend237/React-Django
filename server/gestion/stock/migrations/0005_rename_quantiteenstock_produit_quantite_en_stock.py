# Generated by Django 5.1.4 on 2024-12-31 00:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('stock', '0004_rename_quantite_en_stock_produit_quantiteenstock'),
    ]

    operations = [
        migrations.RenameField(
            model_name='produit',
            old_name='quantiteEnStock',
            new_name='quantite_en_stock',
        ),
    ]
