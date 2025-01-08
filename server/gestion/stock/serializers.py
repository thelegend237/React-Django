from rest_framework import serializers # type: ignore
from .models import  Produit, CommandeClient, CommandeFournisseur
from rest_framework.exceptions import ValidationError # type: ignore

# Serializer pour le modèle Produit
class ProduitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produit
        fields = '__all__'

    # Validation pour le prix
    def validate_prix(self, value):
        if value <= 0:
            raise ValidationError("Le prix doit être supérieur à 0.")
        return value

    # Validation pour la quantité en stock
    def validate_quantite_en_stock(self, value):
        if value <= 0:
            raise ValidationError("La quantité en stock ne peut pas être négative.")
        return value


# Serializer pour le modèle CommandeClient
class CommandeClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommandeClient
        fields = '__all__'

# Serializer pour le modèle CommandeFournisseur
class CommandeFournisseurSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommandeFournisseur
        fields = '__all__'


