import * as express from "express";
import { validationResult } from "express-validator";
import { errorTypeEnum } from "../enums/errorType.enum";
import { CCustomErrors } from "../helpers/CCustomErrors.helper";
import { CShopService } from '../services/CShop.service';
import { CFilterRequest } from "../helpers/CFilterRequest.helper";
import { getAllShops } from "../interfaces/CShop.interface";
import { NextFunction } from "express";
import { CShopEntities } from "../db/entities/CShop.entities";
import { CAccountModel } from "../db/models/CAccountModel";
import { getRepository } from "typeorm";
import { CCustomerEntities } from "../db/entities/CCustomer.entities";
import { CAccountEntities } from "../db/entities/CAccount.entities";

const objShopService = new CShopService();
const objAccountModel = new CAccountModel();

export class CShopController {

 
    
    
    
    static async addshop(request: express.Request, response: express.Response, next: express.NextFunction) {
        try {
            console.log('In signUp() from CShopController');
    
            // Validate inputs using express-validator
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return response.status(400).json({
                    message: 'Please provide valid inputs.',
                    reasons: errors.array().reduce((acc: any, err) => {
                        acc[err.param] = err.msg;
                        return acc;
                    }, {}),
                });
            }
            
    
            // Filter and validate request body (additional filtering if necessary)
            const objFilteredShop = CFilterRequest.filterAddShopRequest(request);
            // Proceed with saving the shop if validation passes
            const objSavedShop = await objShopService.addshop(objFilteredShop);
    
            response.status(200).send({
                status: 200,
                message: 'success',
                data: objSavedShop,
            });
        } catch (error) {
            return next(error);
        }
    }
    


    static async getAllShops( request: express.Request, response: express.Response, next: express.NextFunction ) {
        try {
            const errors = validationResult(request);

            if (!errors.isEmpty()) {
                console.log('Caught in input validation error from CShopController => getAllShops() ');
                return next(new CCustomErrors(new Error('Please provide valid inputs. '), errorTypeEnum.INPUT_VALIDATION_ERROR, errors));
            }

            // Ensure limit and pageNumber are properly converted to strings
            const limit = request.query.limit ? (Array.isArray(request.query.limit) ? request.query.limit[0] : request.query.limit) : "10";
            const pageNumber = request.query.pageNumber ? (Array.isArray(request.query.pageNumber) ? request.query.pageNumber[0] : request.query.pageNumber) : "1";

            // Convert to integers, ensuring they are valid strings first
            const parsedLimit = parseInt(limit as string);
            const parsedPageNumber = parseInt(pageNumber as string);

            const arrObjShops: Array<getAllShops> = await objShopService.getAllShops(parsedLimit, parsedPageNumber);
                
            if (arrObjShops) {
                console.log('Received success response in CShopController => getAllShops() ');
                response.status(200).send({
                    status: 200,
                    message: 'success',
                    data: arrObjShops.length > 0 ? arrObjShops : []
                });
            }
        } catch (error) {
            return next(error);
        }
    }

    static async filterShops( request: express.Request, response: express.Response, next: express.NextFunction ) {
        try {
            const errors = validationResult(request);

            if (!errors.isEmpty()) {
                console.log('Caught in input validation error from CShopController => filterShops() ');
                return next(new CCustomErrors(new Error('Please provide valid inputs. '), errorTypeEnum.INPUT_VALIDATION_ERROR, errors));
            }

            // Ensure limit and pageNumber are properly converted to strings
            const limit = request.query.limit ? (Array.isArray(request.query.limit) ? request.query.limit[0] : request.query.limit) : "10";
            const pageNumber = request.query.pageNumber ? (Array.isArray(request.query.pageNumber) ? request.query.pageNumber[0] : request.query.pageNumber) : "1";

            // Convert to integers, ensuring they are valid strings first
            const parsedLimit = parseInt(limit as string);
            const parsedPageNumber = parseInt(pageNumber as string);
            
            const arrShopObjs: Array<getAllShops> = await objShopService.getAllShops(parsedLimit, parsedPageNumber);

            if (arrShopObjs) {
                console.log('Received success response in CShopController => filterShops() ');
                response.status(200).send({
                    status: 200,
                    message: 'success',
                    data: arrShopObjs.length > 0 ? arrShopObjs : []
                });
            }
        } catch (error) {
            return next(error);
        }
    }

    

//put method
static async updateShop(request: express.Request, response: express.Response, next: express.NextFunction) {
    try {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({
                message: 'Please provide valid inputs.',
                errors: errors.array(),
            });
        }

        //  Corrected shop ID parameter
        const shopId = request.params.shopId; // Ensure this matches your route
        const shopData = request.body;

        const updatedShop = await objShopService.updateShop(shopId, shopData);

        if (updatedShop) {
            return response.status(200).json({
                status: 200,
                message: 'Shop updated successfully',
                data: updatedShop,
            });
        } else {
            return response.status(404).json({
                status: 404,
                message: 'Shop not found',
            });
        }
    } catch (error) {
        console.error('Error updating shop:', error);
        return next(error);
    }
}
    //patch method (only update mobile no. and email)  
    static async patchShop(request: express.Request, response: express.Response, next: express.NextFunction) {
        try {
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return next(new CCustomErrors(new Error('Please provide valid inputs.'), errorTypeEnum.INPUT_VALIDATION_ERROR, errors));
            }

            const shopId = request.params.id;
            const { shopMobileNumber, shopEmailId } = request.body;
            const updatedFields = { shopMobileNumber, shopEmailId };
            const updatedShop = await objShopService.patchShop(shopId, updatedFields);

            if (updatedShop) {
                response.status(200).send({
                    status: 200,
                    message: 'Shop details updated successfully',
                    data: updatedShop,
                });
            } else {
                response.status(404).send({
                    status: 404,
                    message: 'Shop not found',
                });
            }
        } catch (error) {
            return next(error);
        }
    }


    ///delete method    
    static async deleteShop(request: express.Request, response: express.Response, next: express.NextFunction) {
        try {
            const shopId = request.params.shopId; // Ensure you are getting the 'shopId' from the request
            const isDeleted = await objShopService.deleteShop(shopId);
    
            if (isDeleted) {
                response.status(200).send({
                    status: 200,
                    message: 'Shop deleted successfully',
                });
            } else {
                response.status(404).send({
                    status: 404,
                    message: 'Shop not found',
                });
            }
        } catch (error) {
            return next(error);
        }
    }
    
}




























