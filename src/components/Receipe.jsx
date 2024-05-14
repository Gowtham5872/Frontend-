import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import "../styles/Recipe.css";
import { Link } from "react-router-dom";
import "../styles/Search.css";

const StarRating = ({ value, onChange }) => {
  const stars = Array.from({ length: 5 }, (_, index) => index + 1);

  return (
    <div>
      {stars.map((star) => (
        <FaStar
          key={star}
          color={star <= value ? "#ffc107" : "#e4e5e9"}
          onClick={() => onChange(star)}
          style={{ cursor: "pointer" }}
        />
      ))}
    </div>
  );
};

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    getRecipes();
  }, []);

  const getRecipes = async () => {
    try {
      const response = await axios.get("http://localhost:4000/auth/recipe", {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      // Fetch only the last rating and comment for each recipe
      const recipesWithLatestRatingAndComment = await Promise.all(response.data.map(async (recipe) => {
        const ratingResponse = await axios.get(`http://localhost:4000/auth/recipe/${recipe._id}/ratings`);
        const commentResponse = await axios.get(`http://localhost:4000/auth/recipe/${recipe._id}/comments`);
        const latestRating = ratingResponse.data.length > 0 ? ratingResponse.data[ratingResponse.data.length - 1] : null;
        const latestComment = commentResponse.data.length > 0 ? commentResponse.data[commentResponse.data.length - 1] : null;
        return {
          ...recipe,
          rating: latestRating,
          comment: latestComment
        };
      }));
      setRecipes(recipesWithLatestRatingAndComment);
    } catch (error) {
      console.error("Failed to fetch recipe data:", error);
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    try {
      if (window.confirm("Do you want to delete this recipe?")) {
        const response = await axios.delete(
          `http://localhost:4000/auth/recipe/${recipeId}`
        );
        if (response.status === 200) {
          window.alert("Recipe deleted successfully");
          setTimeout(() => {
            window.location = "/recipes";
          }, 4000);
        }
      }
    } catch (error) {
      window.alert("An error occurred while deleting the recipe:", error);
    }
  };

  const handleAddToFavorites = async (recipeId) => {
    try {
      const response = await axios.post(
        `http://localhost:4000/auth/likedRecipes/${recipeId}`
      );
      if (response.status === 201) {
        window.alert("Recipe added to favorites successfully");
      } else {
        const data = response.data;
        if (data.error === "Recipe already exists in your favorites") {
          window.alert("Recipe already exists in your favorites");
        } else {
          window.alert(data.error);
        }
      }
    } catch (error) {
      window.alert("An error occurred while adding to favorites:", error);
    }
  };

  const handleRateRecipe = async (recipeId, rating) => {
    try {
      const response = await axios.post(
        `http://localhost:4000/auth/recipe/${recipeId}/rate`,
        { rating }
      );
      if (response.status === 200) {
        window.alert("Recipe rated successfully");
        
        // Do not update the recipes state here
      } else {
        window.alert("Failed to rate recipe");
      }
    } catch (error) {
      window.alert("An error occurred while rating recipe:", error);
      console.log(error);
    }
  };

  const handleCommentRecipe = async (recipeId, comment) => {
    try {
      console.log(comment);
      const response = await axios.post(
        `http://localhost:4000/auth/recipe/${recipeId}/comment`,
        { comment }
      );
      if (response.status === 200) {
        window.alert("Comment added successfully");
        // Clear the comment box after successful submission
        const updatedRecipes = recipes.map((recipe) => {
          if (recipe._id === recipeId) {
            return { ...recipe, comment: '' };
          }
          return recipe;
        });
        setRecipes(updatedRecipes);
      } else {
        window.alert("Failed to add comment");
      }
    } catch (error) {
      window.alert("An error occurred while adding comment:", error);
      console.log(error);
    }
  };

  const handleRateChange = (recipeId, rating) => {
    const updatedRecipes = recipes.map((recipe) => {
      if (recipe._id === recipeId) {
        return { ...recipe, rating };
      }
      return recipe;
    });
    setRecipes(updatedRecipes);
  };

  const handleCommentChange = (recipeId, comment) => {
    const updatedRecipes = recipes.map((recipe) => {
      if (recipe._id === recipeId) {
        return { ...recipe, comment };
      }
      return recipe;
    });
    setRecipes(updatedRecipes);
  };

  const searchRecipes = async (e) => {
    try {
      const searchTerm = e.target.value.toLowerCase();
      if (searchTerm) {
        const response = await axios.get(
          `http://localhost:4000/auth/searchRecipes/${searchTerm}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data && !response.data.message) {
          setRecipes(response.data);
        } else {
          setRecipes([]);
        }
      } else {
        getRecipes();
      }
    } catch (error) {
      console.error("Error searching recipes:", error);
    }
  };

  return (
    <div className="Recipes">
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search recipes"
          onChange={(e) => searchRecipes(e)}
        />
      </div>

      {recipes.length > 0 ? (
        recipes.map((recipe) => (
          <div key={recipe._id} className="Recipe">
            <h2>{recipe.title}</h2>
            <img src={recipe.imageUrl} alt={recipe.title} />
            <h3>Ingredients:</h3>
            <ul>
              {recipe.ingredients.length > 0 && (
                <ul>
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              )}
            </ul>
            <div className="instructions-container">
              <h3>Instructions:</h3>
              {recipe.instructions.match(/^\d+\./) ? (
                <div className="instructions-text">
                  {recipe.instructions.split("\n").map((step, index) => (
                    <p key={index}>{step}</p>
                  ))}
                </div>
              ) : (
                <ol className="instructions-list">
                  {recipe.instructions.split("\n").map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              )}
            </div>

            <button
              className="delete-button"
              onClick={() => handleDeleteRecipe(recipe._id)}
            >
              Delete
            </button>
            <button
              className="add-to-favorites-button"
              onClick={() => handleAddToFavorites(recipe._id)}
            >
              Add to Favorites
            </button>

            {/* Rating Section */}
            <div className="rating-section">
              <label htmlFor={`rating-input-${recipe._id}`}>Rating:</label>
              <StarRating
                value={recipe.rating || 0}
                onChange={(rating) => handleRateChange(recipe._id, rating)}
              />
              <button onClick={() => handleRateRecipe(recipe._id, recipe.rating)}>Rate</button>
              {recipe.rating && (
                <p>Rating: {recipe.rating}</p>
              )}
            </div>

            {/* Comment Section */}
            <div className="comment-section">
              <label htmlFor={`comment-input-${recipe._id}`}>Comment:</label>
              <textarea
                id={`comment-input-${recipe._id}`}
                rows="4"
                cols="50"
                value={recipe.comment || ""}
                onChange={(e) => handleCommentChange(recipe._id, e.target.value)}
              ></textarea>
              <button onClick={() => handleCommentRecipe(recipe._id, recipe.comment)}>Submit Comment</button>
              {recipe.comments.length > 0 && (
                <div className="comment-section">
                  <p>Last Comment: {recipe.comments[recipe.comments.length - 1]}</p>
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <h2 className="no-recipes">No Recipes Found</h2>
      )}
    </div>
  );
};

export default Recipes;







