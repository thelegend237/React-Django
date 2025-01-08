import './App.css'
import Navbar from './components/navbar'
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Assure-toi d'importer 'Link' ici
import ProductList from './components/productList';
import ClientOrders from './components/ClientOrders';
import SupplierOrders from './components/SupplierOrders';

// App componente principale qui contient le menu de navigation et les routes des pages

function App() {
  return (
    
    <Router>
      <div>
        {/* Menu de navigation */}
        <Navbar/>
        {/* Routes */}
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/client-orders" element={<ClientOrders />} />
          <Route path="/supplier-orders" element={<SupplierOrders />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
