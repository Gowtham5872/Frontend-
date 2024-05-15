import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const LogoutUser = () => {
    if (window.confirm("You wanna logout?")) {
      localStorage.clear();
      window.location.href = "https://backend-nu7m.onrender.com/auth/login";
    } else {
      window.location.href = "https://backend-nu7m.onrender.com/auth/recipes";
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const auth = localStorage.getItem("token");

  const handleToggleMenu = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <nav>
        <div className="nav-left">
          <FontAwesomeIcon
            icon={faEllipsisV}
            className="ellipsis-icon"
            onClick={toggleMenu}
            style={isOpen ? { transform: "rotate(90deg)" } : {}}
          />
          <h2>Recipe Sharing Platform</h2>
        </div>
        <div className={`nav-right ${isOpen ? "open" : ""}`}>
          <ul>
            {auth ? (
              <>
                <li>
                  <NavLink to="recipes" onClick={handleToggleMenu}>
                    Recipes
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/addRecipe" onClick={handleToggleMenu}>
                    Add Recipe
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/favouriteRecipes" onClick={handleToggleMenu}>
                    Favourites
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/profile" onClick={handleToggleMenu}>
                    Profile
                  </NavLink>{" "}
                </li>
                <li>
                  <NavLink to="login" onClick={LogoutUser}>
                    Logout
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="login">Login</NavLink>{" "}
                </li>
                <li>
                  <NavLink to="signup">SignUp</NavLink>
                </li>
                <li>
                  <NavLink to="forgotPassword">Forgot Password</NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;

