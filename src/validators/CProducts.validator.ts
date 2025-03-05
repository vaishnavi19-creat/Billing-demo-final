import { body, param } from "express-validator";

export class CProductValidator {
    

    static validateProduct() {
        return [
            body("name").isString().notEmpty().withMessage("Product name must be a non-empty string."),
            body("price").isFloat({ gt: 0 }).withMessage("Price must be a positive float."),
            body("quantity").isInt({ gt: 0 }).withMessage("Quantity must be a positive integer."),
            body("stock").isInt({ gt: 0 }).withMessage("Stock must be a positive integer."),
            body("shop_id").isInt().withMessage("Shop ID must be a valid integer."),
            body("category").isString().notEmpty().withMessage("Category must be a non-empty string."),
            
            // These fields are now optional
            body("unit_id").optional().isInt().withMessage("Unit ID must be a valid integer."),
            body("created_by").optional().isInt().withMessage("Created by must be a valid integer."),
            body("updated_by").optional().isInt().withMessage("Updated by must be a valid integer."),

            // Optional fields
            body("hsn_code").optional().isString().withMessage("HSN code must be a string."),
            body("expiry_date").optional().isISO8601().withMessage("Expiry date must be a valid date."),
            body("mfg_date").optional().isISO8601().withMessage("Manufacturing date must be a valid date."),
            body("tax_slab").optional().isString().withMessage("Tax slab must be a string.")
        ];
    }



static validateProductsByName() {
        return [
          param('productName').notEmpty().withMessage('Product name must be a non-empty string.').isString().withMessage('Product name must be a string.'),];
      }
    


static validatepatchProduct(){
    return[
        body("quantity").isInt({ gt: 0 }).withMessage("Quantity must be a positive integer."), 
        body("quantity").isInt({ gt: 0 }).withMessage("Quantity must be a positive integer."),

    ]
}

static reduceProductQuantityValidator() {
    return[
    body('productId').isInt().withMessage('Product ID must be an integer'),
    body('soldQuantity').isInt({ gt: 0 }).withMessage('Sold quantity must be a positive integer')
]
}

}




































