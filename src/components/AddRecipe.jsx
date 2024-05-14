import React from "react";
import "../styles/Addrecipe.css";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import axios from "axios";

const AddRecipe = () => {
  const initialValues = {
    title: "",
    ingredients: [""],
    instructions: "",
    imageUrl: "",
  };

  const handleSubmit = async (values) => {
    const nonEmptyIngredients = values.ingredients.filter(
      (ingredient) => ingredient.trim() !== ""
    );

    if (nonEmptyIngredients.length === 0) {
      window.alert("Please fill the box.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/auth/recipe",
        values
      );

      if (response.status === 201) {
        window.alert("Recipe added successfully");

        setTimeout(() => {
          window.location.href = "/recipes";
        }, 4000);
      } else {
        throw new Error("Failed to add recipe");
      }
    } catch (error) {
      console.error("An error occurred in adding the recipe:", error);
      window.alert("An error occurred in adding the recipe");
    }
  };

  return (
    <div className="addrecipe-container">
      <h2>Add Recipe</h2>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        <Form>
          <div>
            <label htmlFor="title">Title:</label>
            <Field type="text" id="title" name="title" />
            <ErrorMessage name="title" component="div" />
          </div>
          <div className="ingredient-inputs">
            <label htmlFor="ingredients">Ingredients:</label>
            <FieldArray name="ingredients">
              {({ insert, remove, push, form }) => (
                <div>
                  {form.values.ingredients.map((ingredient, index) => (
                    <div key={index}>
                      <Field name={`ingredients.${index}`} />
                      {index > 0 && (
                        <button type="button" onClick={() => remove(index)}>
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => push("")}>
                    Add Ingredient
                  </button>
                </div>
              )}
            </FieldArray>
            <ErrorMessage name="ingredients" component="div" />
          </div>
          <div>
            <label htmlFor="instructions">Instructions:</label>
            <Field as="textarea" id="instructions" name="instructions" />
            <ErrorMessage name="instructions" component="div" />
          </div>
          <div>
            <label htmlFor="imageUrl">Image URL:</label>
            <Field type="text" id="imageUrl" name="imageUrl" />
            <ErrorMessage name="imageUrl" component="div" />
          </div>
          <div>
            <button type="submit">Add Recipe</button>
          </div>
        </Form>
      </Formik>
      
    </div>
  );
};

export default AddRecipe;

