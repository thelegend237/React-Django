import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SupplierOrders.css";

const SupplierOrders = () => {
    const [orders, setOrders] = useState([]);
    const [newOrder, setNewOrder] = useState({ fournisseur_nom: "", produit: "", quantite: "" });
    const [products, setProducts] = useState([]);
    const [editingOrder, setEditingOrder] = useState(null); // Pour la modification des commandes
    const [alert, setAlert] = useState("");  // État pour l'alerte

    useEffect(() => {
        fetchOrders();
        fetchProducts();
    }, []);

    const fetchOrders = () => {
        axios.get("http://127.0.0.1:8000/api/commande-fournisseurs/")
            .then((response) => setOrders(response.data))
            .catch((error) => console.error("Erreur lors de la récupération des commandes", error));
    };

    const fetchProducts = () => {
        axios.get("http://localhost:8000/api/produits/")
            .then((response) => setProducts(response.data))
            .catch((error) => console.error("Erreur lors de la récupération des produits", error));
    };

    const handleCreateOrder = () => {
        // Vérifie si la quantité est inférieure ou égale au seuil critique (ici 2)
        const product = products.find((p) => p.id === newOrder.produit);
        if (newOrder.quantite <= 0) {
            setAlert("Alerte : Vous devez commander au moins 1 produit pour valider votre commande.");
        }   if (product && product.quantite_en_stock <= 10) {
               setAlert(
                   `Alerte : La quantité disponible pour le produit "${product.nom}" est en seuil critique. 
                   Quantité en stock : ${product.quantite_en_stock}.`
               );
        } else {
            // Si la quantité est valide, crée la commande
            axios.post("http://127.0.0.1:8000/api/commande-fournisseurs/", newOrder)
                .then(() => {
                    fetchOrders();
                    setNewOrder({ fournisseur_nom: "", produit: "", quantite: "" });
                    setAlert("");  // Réinitialiser l'alerte
                })
                .catch((error) => console.error("Erreur lors de la création de la commande", error));
        }
    };
    const handleEditOrder = (order) => {
        setEditingOrder(order);
    };

    const handleUpdateOrder = () => {
        axios.put(`http://127.0.0.1:8000/api/commande-fournisseurs/${editingOrder.id}/`, editingOrder)
            .then(() => {
                fetchOrders();
                setEditingOrder(null);
            })
            .catch((error) => console.error("Erreur lors de la mise à jour de la commande", error));
    };

    const handleDeleteOrder = (id) => {
        axios.delete(`http://127.0.0.1:8000/api/commande-fournisseurs/${id}/`)
            .then(() => {
                fetchOrders();
            })
            .catch((error) => console.error("Erreur lors de la suppression de la commande", error));
    };

    const handleValidateOrder = (order) => {
        const updatedOrder = { ...order, statut: 'validée' };
        axios.put(`http://127.0.0.1:8000/api/commande-fournisseurs/${order.id}/`, updatedOrder)
            .then(() => {
                fetchOrders();
            })
            .catch((error) => console.error("Erreur lors de la validation de la commande", error));
    };

    return (
        <div className="supplier-orders">
            <h2>Commandes Fournisseurs</h2>
            {/* Afficher l'alerte si nécessaire */}
            {alert && <div className="alert">{alert}</div>}
            <div className="order-form">
                <input
                    type="text"
                    placeholder="Nom de Fournisseur"
                    value={newOrder.fournisseur_nom}
                    onChange={(e) => setNewOrder({ ...newOrder, fournisseur_nom: e.target.value })}
                />
                <select
                    value={newOrder.produit}
                    onChange={(e) => setNewOrder({ ...newOrder, produit: e.target.value })}
                >
                    <option value="">Choisir un produit</option>
                    {products.map((product) => (
                        <option key={product.id} value={product.id}>
                            {product.nom}
                        </option>
                    ))}
                </select>
                <input
                    type="number"
                    placeholder="Quantité"
                    value={newOrder.quantite}
                    onChange={(e) => setNewOrder({ ...newOrder, quantite: e.target.value })}
                />
                <button onClick={handleCreateOrder}>Ajouter</button>
            </div>

            {editingOrder && (
                <div className="order-edit-form">
                    <h3>Modifier la commande</h3>
                    <input
                        type="text"
                        value={editingOrder.fournisseur_nom}
                        onChange={(e) => setEditingOrder({ ...editingOrder, fournisseur_nom: e.target.value })}
                    />
                    <select
                        value={editingOrder.produit}
                        onChange={(e) => setEditingOrder({ ...editingOrder, produit: e.target.value })}
                    >
                        <option value="">Choisir un produit</option>
                        {products.map((product) => (
                            <option key={product.id} value={product.id}>
                                {product.nom}
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        value={editingOrder.quantite}
                        onChange={(e) => setEditingOrder({ ...editingOrder, quantite: e.target.value })}
                    />
                    <button onClick={handleUpdateOrder}>Mettre à jour</button>
                    <button onClick={() => setEditingOrder(null)}>Annuler</button>
                </div>
            )}

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Fournisseur</th>
                        <th>Produit</th>
                        <th>Quantité</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.fournisseur_nom}</td>
                            <td>{products.find((p) => p.id === order.produit)?.nom || "Inconnu"}</td>
                            <td>{order.quantite}</td>
                            <td>{order.statut}</td>
                            <td>
                                {order.statut === 'en_attente' && (
                                    <>
                                        <button onClick={() => handleValidateOrder(order)}>Valider</button>
                                        <button onClick={() => handleEditOrder(order)}>Modifier</button>
                                    </>
                                )}
                                <button onClick={() => handleDeleteOrder(order.id)}>Supprimer</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SupplierOrders;
