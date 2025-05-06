import React, { useState, useEffect } from "react";
import "../styles/likedProducts.css";

const LikedProducts = () => {
  const [likedProducts, setLikedProducts] = useState([]);

  useEffect(() => {
    
    fetchLikedProducts();
  }, []);

  const fetchLikedProducts = async () => {
    try {
      
      const response = await fetch(
        "https://backend-2-h4cf.onrender.com/auth/likedRecipes"
      );

      if (!response.ok) {
        window.alert("Failed to fetch liked products");
      }

      const data = await response.json();

      
      setLikedProducts(data);
    } catch (error) {
      window.alert("Error fetching liked products:", error);
    }
  };

  const handleRemoveItem = async (recipeId) => {
    try {
      if (
        window.confirm(
          "Are you sure you wanna remove this recipe from favourites??"
        )
      ) {
        const response = await fetch(
          `https://backend-nu7m.onrender.com/auth/removeLiked/${recipeId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          window.alert("Item Removed successfully");
          fetchLikedProducts();
          
        } else {
          const data = await response.json();
          window.alert(data.error);
        }
      } else {
        window.location.href = "/favouriteRecipes";
      }
    } catch (error) {
      window.alert("Error removing item from liked products:", error);
    }
  };

  return (
    <div className="likedRecipes">
      <h2>Favourites</h2>
      <ul>
        {likedProducts.map((product) => (
          <li key={product._id} className="list">
            <div>
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <img src={product.imageUrl} alt={product.title} />
              <h4>Ingredients:</h4>
              <ul>
                {product.ingredients.length > 0 && (
                  <ul className="ingredients-list">
                    {product.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                )}
              </ul>

              <div className="instructions-container">
                <h4>Instructions:</h4>
                <div className="instructions-list">
                  {product.instructions.split("\n").map((step, index) => (
                    <p key={index}>{step}</p>
                  ))}
                </div>
              </div>

              <button
                className="remove-button"
                onClick={() => handleRemoveItem(product._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LikedProducts;
