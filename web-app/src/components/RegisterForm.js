import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const RegisterForm = () => {
  const initialValues = {
    name: '',
    email: '',
    password: '',
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, values);
      console.log(res.data);
      alert('Registration successful!');
      resetForm();
    } catch (error) {
      console.error(error.response.data);
      alert('Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <div>
            <Field type="text" name="name" placeholder="Name" />
            <ErrorMessage name="name" component="div" className="error" />
          </div>
          <div>
            <Field type="email" name="email" placeholder="Email" />
            <ErrorMessage name="email" component="div" className="error" />
          </div>
          <div>
            <Field type="password" name="password" placeholder="Password" />
            <ErrorMessage name="password" component="div" className="error" />
          </div>
          <button type="submit" disabled={isSubmitting}>
            Register
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default RegisterForm;