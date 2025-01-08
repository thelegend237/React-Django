import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ClientOrders.css";

const ClientOrders = () => {
    const [orders, setOrders] = useState([]);
    const [newOrder, setNewOrder] = useState({ client_nom: "", produit: "", quantite: "" });
    const [products, setProducts] = useState([]);
    const [editingOrder, setEditingOrder] = useState(null); // Pour la modification des commandes
    const [alert, setAlert] = useState("");  // État pour l'alerte

    useEffect(() => {
        fetchOrders();
        fetchProducts();
    }, []);

    const fetchOrders = () => {
        axios.get("http://localhost:8000/api/commande-clients/")
            .then((response) => setOrders(response.data))
            .catch((error) => console.error("Erreur lors de la récupération des commandes", error));
    };

    const fetchProducts = () => {
        axios.get("http://localhost:8000/api/produits/")
            .then((response) => setProducts(response.data))
            .catch((error) => console.error("Erreur lors de la récupération des produits", error));
    };

    const handleCreateOrder = () => {
        const product = products.find((p) => p.id === parseInt(newOrder.produit));

        if (newOrder.quantite <= 0) {
            setAlert("Alerte : Vous devez commander au moins 1 produit pour valider votre commande.");
        // Vérifier si la quantité commandée est supérieure à la quantité en stock
        }else if (product && newOrder.quantite > product.quantite_en_stock) {
            setAlert(
                `Alerte : La quantité disponible pour le produit "${product.nom}" est insuffisante. 
                Quantité en stock : ${product.quantite_en_stock}.`
            );
        }
        else {
            axios.post("http://localhost:8000/api/commande-clients/", newOrder)
                .then(() => {
                    fetchOrders();
                    setNewOrder({ client_nom: "", produit: "", quantite: "" });
                    setAlert("");  // Réinitialiser l'alerte
                })
                .catch((error) => console.error("Erreur lors de la création de la commande", error));
        }
    };
    

    const handleEditOrder = (order) => {
        setEditingOrder(order);
    };

    const handleUpdateOrder = () => {
        axios.put(`http://localhost:8000/api/commande-clients/${editingOrder.id}/`, editingOrder)
            .then(() => {
                fetchOrders();
                setEditingOrder(null);
            })
            .catch((error) => console.error("Erreur lors de la mise à jour de la commande", error));
    };

    const handleDeleteOrder = (id) => {
        axios.delete(`http://localhost:8000/api/commande-clients/${id}/`)
            .then(() => {
                fetchOrders();
            })
            .catch((error) => console.error("Erreur lors de la suppression de la commande", error));
    };

    const handleValidateOrder = (order) => {
        const updatedOrder = { ...order, statut: 'validée' };
        axios.put(`http://localhost:8000/api/commande-clients/${order.id}/`, updatedOrder)
            .then(() => {
                fetchOrders();
            })
            .catch((error) => console.error("Erreur lors de la validation de la commande", error));
    };

    return (
        <div className="client-orders">
            <h2>Commandes Clients</h2>
            {/* Afficher l'alerte si nécessaire */}
            {alert && <div className="alert">{alert}</div>}
            <div className="order-form">
                <input
                    type="text"
                    placeholder="Nom du client"
                    value={newOrder.client_nom}
                    onChange={(e) => setNewOrder({ ...newOrder, client_nom: e.target.value })}
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
                        value={editingOrder.client_nom}
                        onChange={(e) => setEditingOrder({ ...editingOrder, client_nom: e.target.value })}
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
                        <th>Client</th>
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
                            <td>{order.client_nom}</td>
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

export default ClientOrders;
