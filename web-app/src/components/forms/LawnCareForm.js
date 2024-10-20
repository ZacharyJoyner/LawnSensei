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
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/lawn-plans`, values);
      alert('Lawn plan created successfully!');
    } catch (error) {
      console.error('Error creating lawn plan:', error);
      alert('Failed to create lawn plan.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        address: '',
        wateringPreference: '',
        lawnArea: '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <div>
            <label htmlFor="address">Address</label>
            <Field type="text" name="address" />
            <ErrorMessage name="address" component="div" />
          </div>

          <div>
            <label htmlFor="wateringPreference">Watering Preference</label>
            <Field as="select" name="wateringPreference">
              <option value="">Select...</option>
              <option value="low">Low</option>
              <option value="high">High</option>
            </Field>
            <ErrorMessage name="wateringPreference" component="div" />
          </div>

          <div>
            <label htmlFor="lawnArea">Lawn Area (sq ft)</label>
            <Field type="number" name="lawnArea" />
            <ErrorMessage name="lawnArea" component="div" />
          </div>

          <button type="submit" disabled={isSubmitting}>
            Create Lawn Plan
          </button>

          <div>
            <Field type="checkbox" name="don_t_know" />
            <label htmlFor="don_t_know">I don&apos;t know my grass type</label>
          </div>

          <div>
            <Field type="checkbox" name="don_t_know_watering" />
            <label htmlFor="don_t_know_watering">I don&apos;t know my watering preference</label>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default LawnPlanForm;