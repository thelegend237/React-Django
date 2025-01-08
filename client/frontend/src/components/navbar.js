import React, { useState } from "react";
import { Link } from "react-router-dom";
import './navbar.css'

const Navbar = () => {
    const [menuActive, setMenuActive] = useState(false);

    const toggleMenu = () => {
        setMenuActive(!menuActive);
    };

    return (
        <nav>
            <span className="menu-toggle" onClick={toggleMenu}>
                &#9776; {/* Icône hamburger */}
            </span>
            <ul className={menuActive ? "active" : ""}>
                <li>
                    <Link to="/">Produits</Link>
                </li>
                <li>
                    <Link to="/client-orders">Commandes Clients</Link>
                </li>
                <li>
                    <Link to="/supplier-orders">Commandes Fournisseurs</Link>
                </li>
               

            </ul>
        </nav>
    );
};

export default Navbar;
