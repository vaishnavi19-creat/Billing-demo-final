import { param, body } from 'express-validator';

export class CCustomerValidator {
    // Validate customerId as a route parameter
    static validateCustomerId() {
        return [
            param('customerId') .isInt({ gt: 0 }).withMessage('Customer ID must be a positive integer.'),
        ];
    }

    // Validate customer inputs for adding/updating a customer
    static validateCustomer() {
        return [
            body('Name').notEmpty().withMessage('Name is required.').trim().escape().isString().withMessage('Name must be a valid string.'),
            body('MobileNo').notEmpty().withMessage('Mobile number is required.').trim().escape().matches(/^(\+91)?\d{10}$/).withMessage('Mobile number must start with +91 (optional) and contain exactly 10 digits.'),
            body('Email').notEmpty().withMessage('Email is required.').trim().escape().isEmail().withMessage('Invalid email format.'),
            body('Address').notEmpty().withMessage('Address is required.').trim().escape().isString().isLength({ min: 10, max: 500 }).withMessage('Address must be between 10 and 500 characters.'),
        ];
    }


    static validateputCustomer() {
        return [
            body('customerName').notEmpty().withMessage('Customer name is required.')
                .trim().escape().isString().withMessage('Customer name must be a valid string.'),

            body('customerMobileNo').notEmpty().withMessage('Mobile number is required.')
                .trim().escape()
                .matches(/^(\+91)?\d{10}$/).withMessage('Mobile number must start with +91 (optional) and contain exactly 10 digits.'),

            body('customerEmailId').notEmpty().withMessage('Email is required.')
                .trim().escape().isEmail().withMessage('Invalid email format.'),

            body('customerAddress').notEmpty().withMessage('Address is required.')
                .trim().escape().isString().isLength({ min: 10, max: 500 })
                .withMessage('Address must be between 10 and 500 characters.')
        ];
    }




// Validation for partially updating a customer
static validatePatchCustomer() {
    return [
        body('Name')
            .optional()
            .trim()
            .escape()
            .isString().withMessage('Name must be a valid string.'),
        body('MobileNo').notEmpty().withMessage('Please provide a mobile number.').isMobilePhone('en-IN').withMessage('Invalid mobile number format. Please provide a valid mobile number.'),
        body('Email')
            .optional()
            .trim()
            .escape()
            .isEmail().withMessage('Invalid email format.'),
        body('Address')
            .optional()
            .trim()
            .escape()
            .isString().isLength({ min: 10, max: 500 }).withMessage('Address must be between 10 and 500 characters.'),
        body('GSTNo')
            .optional()
            .trim()
            .escape()
            .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[Z]{1}[A-Z0-9]{1}$/).withMessage('GST number must follow the proper format.'),
        body('logo')
            .optional()
            .isURL().withMessage('Logo must be a valid URL.')
    ];
}}










