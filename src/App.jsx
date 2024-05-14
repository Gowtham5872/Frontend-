import React from 'react'
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Login from './components/Login'
import Navbar from './components/Navbar'
import ForgotPassword from './components/ForgotPassword';
import Register from './components/Register';
import Recipes from './components/Receipe';
import ParentComponent from './components/ParentComponent';
import AddRecipe from './components/AddRecipe';
import Profile from './components/Profile';
import LikedProducts from './components/Likedproducts'

const App = () => {
  return (
    <Router>
    <Navbar />

    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/forgotPassword" element={<ForgotPassword />} />
      <Route element={<ParentComponent />}>
          <Route path="/favouriteRecipes" element={<LikedProducts />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/" element={<Recipes />} />
          <Route path="/addRecipe" element={<AddRecipe />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      
    </Routes>
  </Router>
  )
}

export default App

