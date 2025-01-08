import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "./productList.css";
import { useNavigate } from "react-router-dom"; // Pour redirection fournisseur

const ProductList = () => {
    const [produits, setProduits] = useState([]);
    const [filteredProduits, setFilteredProduits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [isEditing, setIsEditing] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({ nom: "", prix: "", quantite_en_stock: "" });
    const seuilCritique = 10; // Définissez votre seuil critique
    const navigate = useNavigate(); // Pour redirection

    useEffect(() => {
        fetchProduits();
    }, []);

    const fetchProduits = () => {
        axios.get("http://localhost:8000/api/produits/")
            .then((response) => {
                setProduits(response.data);
                setFilteredProduits(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Erreur lors de la récupération des produits", error);
                setLoading(false);
            });
    };

    const handleSearch = (event) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);
        setFilteredProduits(
            produits.filter((produit) =>
                produit.nom.toLowerCase().includes(term)
            )
        );
        setCurrentPage(1);
    };

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const sortedProduits = useMemo(() => {
        return [...filteredProduits].sort((a, b) => {
            if (sortConfig.key) {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === "asc" ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === "asc" ? 1 : -1;
                }
            }
            return 0;
        });
    }, [filteredProduits, sortConfig]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedProduits.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredProduits.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleCreate = () => {
        axios.post("http://localhost:8000/api/produits/", newProduct)
            .then(() => {
                fetchProduits();
                setNewProduct({ nom: "", prix: "", quantite_en_stock: "" });
            })
            .catch((error) => console.error("Erreur lors de la création du produit", error));
    };

    const handleUpdate = () => {
        axios.put(`http://localhost:8000/api/produits/${editProduct.id}/`, editProduct)
            .then(() => {
                fetchProduits();
                setIsEditing(false);
                setEditProduct(null);
            })
            .catch((error) => console.error("Erreur lors de la mise à jour du produit", error));
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:8000/api/produits/${id}/`)
            .then(() => {
                fetchProduits();
            })
            .catch((error) => console.error("Erreur lors de la suppression du produit", error));
    };

    const handleOrderToSupplier = (produit) => {
        navigate("/supplier-orders", { state: { produit } });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditProduct((prev) => ({ ...prev, [name]: value }));
    };

    if (loading) {
        return <div>Chargement des produits...</div>;
    }

    return (
        <div className="container">
            <h2>Gestion des Produits</h2>

            <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-bar"
            />

            <div className="form-container">
                <h3>Ajouter un nouveau produit</h3>
                <input
                    type="text"
                    placeholder="Nom"
                    value={newProduct.nom}
                    onChange={(e) => setNewProduct({ ...newProduct, nom: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Prix"
                    value={newProduct.prix}
                    onChange={(e) => setNewProduct({ ...newProduct, prix: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Quantité"
                    value={newProduct.quantite_en_stock}
                    onChange={(e) => setNewProduct({ ...newProduct, quantite_en_stock: e.target.value })}
                />
                <button onClick={handleCreate}>Créer</button>
            </div>

            <table className="product-table">
                <thead>
                    <tr>
                        <th onClick={() => handleSort("id")}>ID</th>
                        <th onClick={() => handleSort("nom")}>Nom</th>
                        <th onClick={() => handleSort("prix")}>Prix (€)</th>
                        <th onClick={() => handleSort("quantite_en_stock")}>Quantité</th>
                        <th>Alerte</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.length > 0 ? (
                        currentItems.map((produit) => (
                            <tr key={produit.id}>
                                <td>{produit.id}</td>
                                <td>{produit.nom}</td>
                                <td>{produit.prix}</td>
                                <td>{produit.quantite_en_stock}</td>
                                <td>
                                    {produit.quantite_en_stock <= seuilCritique ? (
                                        <span className="alert-message">Stock critique</span>
                                    ) : (
                                        "OK"
                                    )}
                                </td>
                                <td>
                                    <button onClick={() => handleOrderToSupplier(produit)}>Commander</button>
                                    <button className='btn-modifier' onClick={() => {
                                        setIsEditing(true);
                                        setEditProduct(produit);
                                    }}>Modifier</button>
                                    <button onClick={() => handleDelete(produit.id)}>Supprimer</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">Aucun produit trouvé</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={currentPage === i + 1 ? "active" : ""}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
            {isEditing && (
                <div className="edit-form">
                    <h3>Modifier le produit</h3>
                    <input
                        type="text"
                        name="nom"
                        placeholder="Nom"
                        value={editProduct.nom}
                        onChange={handleEditChange}
                    />
                    <input
                        type="number"
                        name="prix"
                        placeholder="Prix"
                        value={editProduct.prix}
                        onChange={handleEditChange}
                    />
                    <input
                        type="number"
                        name="quantite_en_stock"
                        placeholder="Quantité"
                        value={editProduct.quantite_en_stock}
                        onChange={handleEditChange}
                    />
                    <button onClick={handleUpdate}>Mettre à jour</button>
                    <button onClick={() => setIsEditing(false)}>Annuler</button>
                </div>
            )}
        </div>
    );
};

export default ProductList;
