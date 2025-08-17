// src/utils/validation.utils.ts
import validator from "validator";

/**
 * Validate email
 */
export const isValidEmail = (email: string): boolean => {
  return validator.isEmail(email);
};

/**
 * Validate phone number (10-digit, India)
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  return validator.isMobilePhone(phone, "en-IN");
};
