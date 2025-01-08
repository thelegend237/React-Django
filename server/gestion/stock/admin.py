from django.contrib import admin # type: ignore
from .models import Produit, CommandeClient, CommandeFournisseur

admin.site.register(Produit)
admin.site.register(CommandeClient)
admin.site.register(CommandeFournisseur)

