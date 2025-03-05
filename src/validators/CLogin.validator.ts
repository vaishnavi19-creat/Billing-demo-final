import { body, oneOf, query } from "express-validator";

export class CLoginValidator {
    static validateGetAllLogins() {
        console.log('Validating get all logins request....');
        return [
            body('userId').isString().withMessage('User ID must be a string.').notEmpty().withMessage('User ID is required.'),
            body('password').optional().isString().withMessage('Password must be a string.').notEmpty().withMessage('Password cannot be empty if provided.')
        ];
    }

    // Method to validate filtering logins
    static validateFilterLogins() {
        console.log('Validating filter logins request....');
        return [
           body('username').optional().isString().withMessage('Username must be a string.').notEmpty().withMessage('Username cannot be empty if provided.'),
        ];
    }

    static validateLogin() {
        console.log('Validating login request....');
        return [
            oneOf([
                body('username').trim().notEmpty().withMessage('Username is required.'),
                body('email').trim().isEmail().withMessage('Please provide a valid email address.')
            ], 'Either Username or Email is required.'),
            body('password').trim().notEmpty().withMessage('Password is required.')
        ];
    }
    
}
