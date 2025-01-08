from django.db import models # type: ignore

# Modèle pour les produits
class Produit(models.Model):
    nom = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    prix = models.DecimalField(max_digits=10, decimal_places=2)
    quantite_en_stock = models.IntegerField(default=1)
    seuil_critique = models.IntegerField(default=10) 

    def __str__(self):
        return self.nom



# Modèle pour les commandes des clients
class CommandeClient(models.Model):
    STATUT_CHOICES = [
        ('en_attente', 'En attente'),
        ('validée', 'Validée'),
        ('envoyée', 'Envoyée'),
    ]

    client_nom = models.CharField(max_length=100)
    produit = models.ForeignKey('Produit', on_delete=models.CASCADE)
    quantite = models.IntegerField()
    statut = models.CharField(max_length=10, choices=STATUT_CHOICES, default='en_attente')
    date_commande = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.client_nom} - {self.produit.nom} ({self.statut})'


# Modèle pour les commandes aux fournisseurs
class CommandeFournisseur(models.Model):
    STATUT_CHOICES = [
        ('en_attente', 'En attente'),
        ('validée', 'Validée'),
        ('envoyée', 'Envoyée'),
    ]

    fournisseur_nom = models.CharField(max_length=100)
    produit = models.ForeignKey('Produit', on_delete=models.CASCADE)
    quantite = models.IntegerField()
    statut = models.CharField(max_length=10, choices=STATUT_CHOICES, default='en_attente')
    date_commande = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.fournisseur_nom} - {self.produit.nom} ({self.statut})'
    
    
