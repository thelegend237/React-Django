# Utilise une image Python plus stable
FROM python:3.11.7-slim

# Définit le répertoire de travail
WORKDIR /app

# Installation des dépendances système nécessaires
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Copie uniquement le fichier requirements.txt d'abord
COPY requirements.txt .

# Installation des dépendances avec désactivation de la vérification des checksums
RUN pip install --no-cache-dir --trusted-host pypi.org --trusted-host files.pythonhosted.org -r requirements.txt

# Copie le reste des fichiers
COPY server/gestion/ .

# Expose le port
EXPOSE 8000

# Commande de lancement
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
