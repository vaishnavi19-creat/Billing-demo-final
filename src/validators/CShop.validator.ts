import { body, query } from "express-validator";

export class CShopValidator {
  

    static validateGetAllShops() {

        console.log('Validating validateGetAllShops request....');
        return [
           body('limit', 'Please provide the valid limit.').trim().escape().isNumeric().notEmpty(),
           body('pageNumber', 'Please provide the valid page number.').trim().escape().isNumeric().notEmpty(),
        ];

    }

    static validateFilterShops() {
        console.log('Validating validateFilterShops request....');
        return [
            body('limit', 'Please provide the valid limit.').optional().trim().escape().isNumeric(),
            body('pageNumber', 'Please provide the valid page number.').optional().trim().escape().isNumeric(),

            body('shopTypeId', 'Please provice numeric shop type id').optional().trim().escape().isNumeric(),
            body('shopCountryId', 'Please provice numeric shop country id').optional().trim().escape().isNumeric(),
            body('shopStateId', 'Please provice numeric shop state id').optional().trim().escape().isNumeric(),
            body('shopStatus', 'Please provice boolean shop status').optional().trim().escape().isBoolean(),
        ];
    }


    static validatePatchShop(){
        return[
            body('id').isUUID().withMessage('Shop ID must be a valid UUID'),
            body('shopMobileNumber').optional().isMobilePhone('any').withMessage('Mobile number must be a valid phone number'),
            body('shopEmailId').optional().isEmail().withMessage('Email ID must be a valid email address'),
        ]
    }

    static validateUpdateShopbyid(){
        return[
            body('shopId').optional().isInt().withMessage('Shop ID must be a valid integer')  
        ]
    }

    



    static validateaddshop() {
        return [
            // Shop Name Validation
            body('shopName')
                .notEmpty().withMessage('Please provide the shop name.')
                .isString().withMessage('Shop name must be a string.'),
    
            // Shop Type Validation
            body('shopType')
                .notEmpty().withMessage('Please select the shop type.')
                .isIn(['medical', 'general', 'bakery', 'footwear', 'electrical']).withMessage('Shop type must be one of: medical, general, bakery, footwear, electrical.'),
    
            // Owner Name Validation
            body('shopOwnerName')
                .notEmpty().withMessage('Please provide the owner name.')
                .isString().withMessage('Owner name must be a string.'),
    
            // Email Validation
            body('shopEmailId')
                .notEmpty().withMessage('Please provide the email address.')
                .isEmail().withMessage('Please provide a valid email address.'),
    
            // Mobile Number Validation
            body('shopMobileNumber')
                .notEmpty().withMessage('Please provide a mobile number.')
                .isMobilePhone('en-IN').withMessage('Invalid mobile number format. Please provide a valid mobile number.'),
    
            // Package Type Validation
            body('packageType')
                .notEmpty().withMessage('Please select the package type.')
                .isString().withMessage('Package type must be a string.')
                .isIn(['basic', 'standard', 'premium']).withMessage('Invalid package type. Must be one of: basic, standard, or premium.'),
    
            // Zip Code Validation
            body('shopCityZipCode')
            .notEmpty().withMessage('Please provide the shop city zip code.') // Ensure the field is not empty.
            .isString().withMessage('City zip code must be a string.'),


            // City Validation
            body('shopCity')
                .notEmpty().withMessage('Please provide the shop city.')
                .isString().withMessage('City name must be a string.'),
        ];
    }
    
}



 