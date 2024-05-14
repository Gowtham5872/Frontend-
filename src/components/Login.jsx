import React, { useState } from "react";
import "../App.css";
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios"; 

const Login = () => {
  const [showError, setError] = useState(false);

  const handleSubmit = async (values) => {
    const { email, password } = values;

    if (!email || !password) {
      setError(true);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/auth/login",
        {
          email: email.toLowerCase(),
          password,
        }
      );

      if (!response.data.poperror) {
        localStorage.setItem("token", response.data.token);
        window.alert("Login Successful");

        
          window.location.href = "/";
        
      } else {
        window.alert(response.data.poperror);
      
      }
    } catch (error) {
      console.error("An error occurred while logging in:", error);
      window.alert("no user available");
    }
  };

  return (
    <div className="FormContainer">
      <Formik
        initialValues={{ email: "", password: "" }}
        validate={(values) => {
          const errors = {};
          if (!values.email) {
            errors.email = "Required";
          }
          if (!values.password) {
            errors.password = "Required";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          handleSubmit(values);
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <h2>Login</h2>
            <Field type="email" name="email" placeholder="Enter Your email" />
            <ErrorMessage name="email" component="div" />
            <Field
              type="password"
              name="password"
              placeholder="Enter Your password"
            />
            <ErrorMessage name="password" component="div" />
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
           
          </Form>
        )}
      </Formik>
      {showError && (
        <span className="fill-fields-error">Please Fill all the fields</span>
      )}
     
    </div>
  );
};

export default Login;

