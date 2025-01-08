import React, { useState, useEffect } from "react";
import axios from "axios";

const EditProductForm = ({ productId, onSuccess }) => {
    const [nom, setNom] = useState("");
    const [description, setDescription] = useState("");
    const [prix, setPrix] = useState("");
    const [quantiteEnStock, setQuantiteEnStock] = useState(1);

    // Charger les données actuelles du produit
    useEffect(() => {
        axios
            .get(`/api/produits/${productId}/`)
            .then((response) => {
                const { nom, description, prix, quantite_en_stock } = response.data;
                setNom(nom);
                setDescription(description);
                setPrix(prix);
                setQuantiteEnStock(quantite_en_stock);
            })
            .catch((error) => {
                console.error("Erreur lors de la récupération du produit :", error);
                alert("Impossible de charger les informations du produit.");
            });
    }, [productId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedProduct = {
            nom,
            description,
            prix: parseFloat(prix),
            quantite_en_stock: parseInt(quantiteEnStock),
        };

        axios
            .put(`/api/produits/${productId}/`, updatedProduct)
            .then((response) => {
                alert("Produit modifié avec succès !");
                onSuccess(); // Action après modification (ex. rafraîchir la liste)
            })
            .catch((error) => {
                console.error("Erreur lors de la modification du produit :", error);
                alert("Une erreur s'est produite. Veuillez réessayer.");
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Nom :
                <input
                    type="text"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    required
                />
            </label>
            <label>
                Description :
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </label>
            <label>
                Prix :
                <input
                    type="number"
                    value={prix}
                    onChange={(e) => setPrix(parseFloat(e.target.value))}
                    required
                />
            </label>
            <label>
                Quantité en stock :
                <input
                    type="number"
                    value={quantiteEnStock}
                    onChange={(e) => setQuantiteEnStock(parseInt(e.target.value))}
                    required
                />
            </label>
            <button type="submit">Modifier le produit</button>
        </form>
    );
};

export default EditProductForm;
