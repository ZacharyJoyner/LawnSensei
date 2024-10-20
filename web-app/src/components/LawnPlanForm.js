import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const validationSchema = Yup.object().shape({
  address: Yup.string().required('Address is required'),
  wateringPreference: Yup.string().required('Watering preference is required'),
  lawnArea: Yup.number().positive('Lawn area must be positive').required('Lawn area is required'),
});

const LawnPlanForm = () => {
  const initialValues = {
    address: '',
    wateringPreference: '',
    lawnArea: '',
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_API_URL}/lawn-plans`, values, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      alert('Lawn care plan created successfully!');
      resetForm();
    } catch (err) {
      console.error(err);
      alert('Error creating lawn care plan');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Create Lawn Care Plan</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label htmlFor="address">Address:</label>
              <Field type="text" name="address" />
              <ErrorMessage name="address" component="div" className="error" />
            </div>
            <div>
              <label htmlFor="wateringPreference">Watering Preference:</label>
              <Field as="select" name="wateringPreference">
                <option value="">Select a preference</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Field>
              <ErrorMessage name="wateringPreference" component="div" className="error" />
            </div>
            <div>
              <label htmlFor="lawnArea">Lawn Area (sq ft):</label>
              <Field type="number" name="lawnArea" />
              <ErrorMessage name="lawnArea" component="div" className="error" />
            </div>
            <button type="submit" disabled={isSubmitting}>
              Create Lawn Care Plan
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LawnPlanForm;
