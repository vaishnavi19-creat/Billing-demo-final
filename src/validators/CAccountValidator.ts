import { param, body, query } from "express-validator";

export class CAccountValidator {
  
  static validateAccount() {
    return [
      body("customerName").notEmpty().withMessage("Name is required."),
      body('customerMobileNo').notEmpty().withMessage('Mobile number is required.').trim().escape().matches(/^(\+91)?\d{10}$/).withMessage('Mobile number must start with +91 (optional) and contain exactly 10 digits.'),
      body("customerEmailId").notEmpty().withMessage("Email is required.").isEmail(),
      body("customerAddress").notEmpty().withMessage("Address is required."),
    ];
  }

  static validateAccountbyId() {
    return [
      param("id")
        .isInt().withMessage("Account ID must be an integer.")
        .toInt(),
    ];
  }

  static validateFilterAccounts() {
    return [
      query("name").optional().isString().withMessage("Name must be a string."),
      query("email").optional().isEmail().withMessage("Invalid email format."),
      query("mobileNo").optional().matches(/^\d{10}$/).withMessage("Mobile number must contain exactly 10 digits."),
    ];
  }

  static validateUpdateAccount() {
    return [
      param("id").isInt().withMessage("Account ID must be an integer.").toInt(),
      body("customerName").optional().notEmpty().withMessage("Name cannot be empty."),
      body("customerMobileNo").optional().matches(/^(\+91)?\d{10}$/).withMessage("Mobile number must contain exactly 10 digits."),
      body("customerEmailId").optional().isEmail().withMessage("Invalid email format."),
      body("customerAddress").optional().notEmpty().withMessage("Address cannot be empty."),
    ];
  }

  static validatePatchAccount() {
    return [
      param("id").isInt().withMessage("Account ID must be an integer.").toInt(),
      body().notEmpty().withMessage("At least one field is required for update."),
    ];
  }


  static validateDeleteAccountById() {
    return [
      param("id").isInt().withMessage("Account ID must be an integer.").toInt(),
    ];
  }
  
}

