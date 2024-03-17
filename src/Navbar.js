import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import "./index.css";


function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
  
    const toggleNavbar = () => {
      setIsOpen(!isOpen);
    };

    
  
    return (
      <nav className="navbar">
        <div className="menu-toggle" onClick={toggleNavbar}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>
        <ul className={`menu-items ${isOpen ? "open" : ""}`}>
          <li>
            <a href="/">Weather</a>
          </li>
          <li>
          <a href="/">Routes</a>
          </li>
          <li>
            <a href="">Hazards</a>
          </li>
    
        </ul>
      </nav>
    );
  }
  
  export default Navbar;