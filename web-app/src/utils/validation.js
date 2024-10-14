export const validateLawnPlanForm = (data) => {
  const errors = {};
  if (!data.address) errors.address = 'Address is required';
  if (!data.wateringPreference) errors.wateringPreference = 'Watering preference is required';
  if (!data.lawnArea || data.lawnArea <= 0) errors.lawnArea = 'Valid lawn area is required';
  return errors;
};
