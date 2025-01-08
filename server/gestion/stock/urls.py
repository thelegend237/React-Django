from rest_framework.routers import DefaultRouter # type: ignore
from .views import  ProduitViewSet, CommandeClientViewSet, CommandeFournisseurViewSet

# Ajouter les routes pour les API JWT
router = DefaultRouter()
router.register(r'produits', ProduitViewSet)
router.register(r'commande-clients', CommandeClientViewSet)
router.register(r'commande-fournisseurs', CommandeFournisseurViewSet)


urlpatterns = router.urls
