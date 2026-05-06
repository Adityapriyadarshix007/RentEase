export const validateEmail = (email) => {
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(email);
};

export const validatePhone = (phone) => {
  const regex = /^[0-9]{10}$/;
  return regex.test(phone);
};

export const validatePincode = (pincode) => {
  const regex = /^[0-9]{6}$/;
  return regex.test(pincode);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateName = (name) => {
  return name.length >= 2 && name.length <= 50;
};

export const validateAddress = (address) => {
  return address && address.trim().length >= 5;
};

export const getValidationErrors = (data) => {
  const errors = {};
  
  if (data.email && !validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (data.phone && !validatePhone(data.phone)) {
    errors.phone = 'Phone number must be 10 digits';
  }
  
  if (data.pincode && !validatePincode(data.pincode)) {
    errors.pincode = 'Pincode must be 6 digits';
  }
  
  if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  if (data.password && !validatePassword(data.password)) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  return errors;
};