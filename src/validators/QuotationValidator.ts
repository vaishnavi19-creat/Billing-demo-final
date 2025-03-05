import { body } from 'express-validator';

export class QuotationValidator {
    static validateQuotation = [
        body('quotationNumber').notEmpty().withMessage('Quotation number is required'),
        body('quotationDate').notEmpty().withMessage('Quotation date is required'),
        body('quotationTerms').notEmpty().withMessage('Quotation terms are required'),
        body('shop').notEmpty().withMessage('Shop ID is required'),
        body('products').isArray({ min: 1 }).withMessage('At least one product is required'),
        body('products.*.productId').notEmpty().withMessage('Product ID is required'),
        body('products.*.name').notEmpty().withMessage('Product name is required'),
        body('products.*.quantity').isInt({ gt: 0 }).withMessage('Quantity must be greater than 0'),
        body('products.*.price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
        body('products.*.total').isFloat({ gt: 0 }).withMessage('Total must be greater than 0'),
    ];
}
