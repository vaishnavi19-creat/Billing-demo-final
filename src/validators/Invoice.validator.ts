import { body, param, query, ValidationChain } from 'express-validator';

export class InvoiceValidator {
   

    static validateInvoice() {
        return [
            body("amount").isNumeric().withMessage("Amount must be a number").trim().escape().notEmpty(),
            body('paymentMode', 'Payment mode is required.').trim().notEmpty().isString(),
            body('shopId', 'Shop ID must be a numeric value.').trim().escape().isNumeric().notEmpty(),
            body('customerId', 'Customer ID must be a numeric value.').trim().escape().isNumeric().notEmpty(),
            body('invoiceNumber', 'Invoice number must be a string.').optional().trim().isString(),
            body('dueDate', 'Due date must be a valid date.').optional().isISO8601().toDate(),
            body('discount', 'Discount must be a numeric value.').optional().trim().escape().isNumeric(),
            body('taxAmount', 'Tax amount must be a numeric value.').optional().trim().escape().isNumeric(),
            body('items', 'Items must be an array.').isArray().notEmpty(),
            body('items.*.productId', 'Product ID must be a numeric value.').trim().escape().isNumeric().notEmpty(),
            body('items.*.productName', 'Product name must be a string.').trim().notEmpty().isString(),
            body('items.*.quantity', 'Quantity must be a numeric value.').trim().escape().isNumeric().notEmpty(),
            body('items.*.price', 'Price must be a numeric value.').trim().escape().isNumeric().notEmpty(),
            body('items.*.total', 'Total must be a numeric value.').trim().escape().isNumeric().notEmpty(),
            body("status").notEmpty().withMessage("Status is required"),
        ];
    }
   
    static validateInvoiceId(): ValidationChain[] {
        return [
            param('invoiceId')
                .isInt({ gt: 0 })
                .withMessage('Invoice ID must be a positive integer'),
        ];
    }

    // Validate the request body for PATCH /invoice
    static validatePatchInvoiceBody(): ValidationChain[] {
        return [
            body().custom((value) => {
                if (Object.keys(value).length === 0) {
                    throw new Error('Request body must contain at least one field to update');
                }
                return true;
            }),
            body('fieldName1')
                .optional()
                .isString()
                .withMessage('FieldName1 must be a string'), // Example validation
            body('fieldName2')
                .optional()
                .isNumeric()
                .withMessage('FieldName2 must be a number'), // Example validation
        ];
    }



}