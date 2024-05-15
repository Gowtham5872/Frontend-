import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Profile.css";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    country: "",
    pincode: "",
    phone: ""
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchProfileData = async () => {
     
      if (!token) {
        window.location.href = "/login";
        return; 
      }
      
      try {
        const response = await axios.get("https://backend-nu7m.onrender.com/auth/profile", {
          headers: {
            Authorization: token,
          },
        });
        setUserData(response.data);
        setUpdatedData(response.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
  
    fetchProfileData();
  }, [token]);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData({
      ...updatedData,
      [name]: value
    });
  };

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleSaveClick = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("https://backend-nu7m.onrender.com/auth/profile/update", updatedData, {
        headers: {
          Authorization: token,
        },
      });
      setIsEditMode(false);
     
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleDeleteClick = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete("https://backend-nu7m.onrender.com/auth/profile/delete", {
        headers: {
          Authorization: token,
        },
      });
      
      localStorage.removeItem("token");
      window.location.href  = "/login";
    } catch (error) {
      console.error("Error deleting profile:", error);
    }
  };

  return (
    <div className="profile-card">
      {userData && (
        <>
          <div className="profile-header">
            <h2>Welcome, {userData.name || 'Guest'}!</h2>
            <p>Thank you for using our app. Here are your details:</p>
          </div>
          <div className="profile-content">
            {!isEditMode ? (
              <>
                <p><strong>Name:</strong> {userData.name}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Address:</strong> {userData.address}</p>
                <p><strong>City:</strong> {userData.city}</p>
                <p><strong>Country:</strong> {userData.country}</p>
                <p><strong>Pincode:</strong> {userData.pincode}</p>
                <p><strong>Phone:</strong> {userData.phone}</p>
                <button onClick={handleEditClick}>Edit Profile</button>
                <button onClick={handleDeleteClick}>Delete Profile</button>
              </>
            ) : (
              <form onSubmit={handleSaveClick}>
                <input type="text" name="name" value={updatedData.name} onChange={handleInputChange} placeholder="Enter Name" />
                <input type="email" name="email" value={updatedData.email} onChange={handleInputChange} placeholder="Enter Email" />
                <input type="text" name="address" value={updatedData.address} onChange={handleInputChange} placeholder="Enter Address" />
                <input type="text" name="city" value={updatedData.city} onChange={handleInputChange} placeholder="Enter City" />
                <input type="text" name="country" value={updatedData.country} onChange={handleInputChange} placeholder="Enter Country" />
                <input type="text" name="pincode" value={updatedData.pincode} onChange={handleInputChange} placeholder="Enter Pincode" />
                <input type="text" name="phone" value={updatedData.phone} onChange={handleInputChange} placeholder="Enter Phone" />
                <button type="submit">Save</button>
              </form>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;










 




