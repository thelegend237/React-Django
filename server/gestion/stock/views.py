from imaplib import Commands
from django.shortcuts import render # type: ignore
from rest_framework import viewsets # type: ignore
from .models import Produit


from .models import Produit, CommandeClient, CommandeFournisseur 
from .serializers import  ProduitSerializer, CommandeClientSerializer, CommandeFournisseurSerializer 
from django_filters.rest_framework import DjangoFilterBackend # type: ignore
from rest_framework.renderers import JSONRenderer # type: ignore
from django.core.mail import send_mail # type: ignore
import logging
from rest_framework.response import Response # type: ignore
from rest_framework.permissions import IsAuthenticated # type: ignore
from django.dispatch import receiver # type: ignore
from django.db.models.signals import post_save # type: ignore

# VueSet pour le modèle Produit
class ProduitViewSet(viewsets.ModelViewSet):
    queryset = Produit.objects.all()
    serializer_class = ProduitSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['nom', 'prix', 'quantite_en_stock']
    renderer_classes = [JSONRenderer]  # Limiter à l'API JSON
    
    def perform_update(self, serializer):
        produit = serializer.save()
        if produit.quantite_en_stock <= produit.seuil_critique:
            self.notifier_administrateur(produit)

    def perform_create(self, serializer):
        produit = serializer.save()
        if produit.quantite_en_stock <= produit.seuil_critique:
            self.notifier_administrateur(produit)


    def notifier_administrateur(self, produit):
        logger = logging.getLogger(__name__)
        logger.info(f"Notification envoyée pour le produit {produit.nom}.")
        send_mail(
            subject="Rupture de stock critique",
            message=f"Le produit '{produit.nom}' est en rupture de stock (quantité : {produit.quantite_en_stock}).",
            from_email="moreljeuf@gmail.com",
            recipient_list=["moreljeufack@gmail.com"],
        )



# VueSet pour le modèle CommandeClient
class CommandeClientViewSet(viewsets.ModelViewSet):
    queryset = CommandeClient.objects.all()
    serializer_class = CommandeClientSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['produit', 'date_commande']  # Champs à filtrer
    
    

# VueSet pour le modèle CommandeFournisseur
class CommandeFournisseurViewSet(viewsets.ModelViewSet):
    queryset = CommandeFournisseur.objects.all()
    serializer_class = CommandeFournisseurSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['produit', 'date_commande']  # Champs à filtrer


