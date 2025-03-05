import * as express from "express";
import { validationResult } from "express-validator";
import { errorTypeEnum } from "../enums/errorType.enum";
import { CCustomErrors } from "../helpers/CCustomErrors.helper";
import { createInvoiceReq } from "../interfaces/Invoice.interface";
import { InvoiceService } from "../services/Invoice.services";
import { InvoiceEntities } from "../db/entities/Invoice.entities";
import { getRepository } from "typeorm";
import { CProductEntity } from '../db/entities/CProducts.entities';
import { CInvoiceProductEntity } from '../db/entities/Invoice_Product.entities';
import jwt from "jsonwebtoken";


const objInvoiceService = new InvoiceService();

export class InvoiceController {


    // Create a new invoice using JWT token data
    static async createInvoice(request: express.Request, response: express.Response, next: express.NextFunction) {
        try {
            // Extract JWT token from Authorization header
            const authHeader = request.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return response.status(401).json({ message: "Unauthorized: No token provided" });
            }
            
            const token = authHeader.split(" ")[1];

            // Decode the token to get shop_id and customer_id
            const decoded = jwt.verify(token, "your_secret_key") as { shop_id: string; customer_id: string };

            // Cast shop_id and customer_id to numbers to match the expected type
            const shop_id = Number(decoded.shop_id);
            const customer_id = Number(decoded.customer_id);

            console.log("Extracted shopId:", shop_id);  //  Debugging


            // Validate if the casting was successful
            if (isNaN(shop_id) || isNaN(customer_id)) {
                return response.status(400).json({ message: "Invalid shop_id or customer_id in the token" });
            }

            // Validate the input data
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return next(new CCustomErrors(new Error("Please provide valid inputs."), errorTypeEnum.INPUT_VALIDATION_ERROR, errors));
            }

            const objFilteredInvoice: createInvoiceReq = request.body;
            objFilteredInvoice.shopId = shop_id;   // Set shop_id from token
            objFilteredInvoice.customerId = customer_id; // Set customer_id from token

            // Call the service to create the invoice
            const objSavedInvoice = await objInvoiceService.createInvoice(objFilteredInvoice);

            // Send a response with the created invoice data
            response.status(201).send({
                status: 201,
                message: "Invoice created successfully",
                data: objSavedInvoice,
            });
        } catch (error) {
            return next(error);
        }
    }

    // Get an invoice by ID
    static async getInvoice(request: express.Request, response: express.Response, next: express.NextFunction) {
        try {
            const invoiceId = Number(request.params.id); // Convert to number

            if (isNaN(invoiceId)) {
                return next(new CCustomErrors(new Error('Invalid invoice ID'), errorTypeEnum.INPUT_VALIDATION_ERROR));
            }

            const invoice = await objInvoiceService.getInvoiceById(invoiceId);

            if (invoice) {
                console.log('Received success response in InvoiceController => getInvoice()');
                response.status(200).send({
                    status: 200,
                    message: 'Invoice fetched successfully',
                    data: invoice
                });
            } else {
                return next(new CCustomErrors(new Error('Invoice not found'), errorTypeEnum.NOT_FOUND_ERROR));
            }
        } catch (error) {
            return next(error);
        }
    }

    // Get all invoices with pagination
    static async getAllInvoices(request: express.Request, response: express.Response, next: express.NextFunction) {
        try {
            const limit = request.query.limit ? (Array.isArray(request.query.limit) ? request.query.limit[0] : request.query.limit) : "10";
            const pageNumber = request.query.pageNumber ? (Array.isArray(request.query.pageNumber) ? request.query.pageNumber[0] : request.query.pageNumber) : "1";

            const parsedLimit = parseInt(limit as string);
            const parsedPageNumber = parseInt(pageNumber as string);

            if (isNaN(parsedLimit) || isNaN(parsedPageNumber)) {
                return response.status(400).send({
                    message: 'Invalid pagination parameters'
                });
            }

            const invoices = await objInvoiceService.getAllInvoices(parsedLimit, parsedPageNumber);

            console.log('Received success response in InvoiceController => getAllInvoices()');
            response.status(200).send({
                status: 200,
                message: 'Invoices fetched successfully',
                data: invoices.length > 0 ? invoices : []
            });
        } catch (error) {
            return next(error);
        }
    }

    // Delete an invoice by ID
    static async deleteInvoice(request: express.Request, response: express.Response, next: express.NextFunction) {
        try {
            const invoiceId = Number(request.params.id); // Convert to number

            // Validate invoiceId
            if (isNaN(invoiceId)) {
                return response.status(400).send({
                    message: 'Invalid invoice ID',
                    reasons: {}
                });
            }

            await objInvoiceService.deleteInvoice(invoiceId);

            console.log('Received success response in InvoiceController => deleteInvoice()');
            response.status(204).send(); // 204 No Content for successful deletion
        } catch (error) {
            return next(error);
        }
    }

    // Filter invoices by status
static async filterInvoices(request: express.Request, response: express.Response, next: express.NextFunction) {
    try {
        // Get 'status' from route parameters
        const { status } = request.params;

        // Ensure 'status' is a valid string
        const statusString = typeof status === "string" ? status.trim() : null;

        if (statusString) {
            const invoices = await objInvoiceService.filterInvoices(statusString);

            console.log("Received success response in InvoiceController => filterInvoices()");
            return response.status(200).send({
                status: 200,
                message: "Invoices filtered successfully",
                data: invoices.length > 0 ? invoices : [],
            });
        } else {
            return next(
                new CCustomErrors(
                    new Error("Invalid or missing status parameter"),
                    errorTypeEnum.INPUT_VALIDATION_ERROR
                )
            );
        }
    } catch (error) {
        return next(error);
    }
}


    // Update an invoice by ID
    static async updateInvoice(request: express.Request, response: express.Response, next: express.NextFunction) {
        try {
            const invoiceId = Number(request.params.invoiceid); // Convert to number

            // Validate the invoiceId
            if (isNaN(invoiceId)) {
                return next(
                    new CCustomErrors(
                        new Error("Invalid invoice ID"),
                        errorTypeEnum.INPUT_VALIDATION_ERROR
                    )
                );
            }

            const objUpdatedInvoice: Partial<createInvoiceReq> = request.body;

            const updatedInvoice = await objInvoiceService.updateInvoice(
                invoiceId,
                objUpdatedInvoice
            );

            if (updatedInvoice) {
                console.log("Invoice updated successfully in InvoiceController.");
                return response.status(200).send({
                    status: 200,
                    message: "Invoice updated successfully",
                    data: updatedInvoice,
                });
            } else {
                return next(
                    new CCustomErrors(
                        new Error("Invoice not found"),
                        errorTypeEnum.NOT_FOUND_ERROR
                    )
                );
            }
        } catch (error) {
            return next(error);
        }
    }

   
    static async patchInvoice(request: express.Request, response: express.Response, next: express.NextFunction) {
        try {
            // Validate the request
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return response.status(400).json({
                    message: 'Please provide the valid inputs.',
                    reasons: errors.array(),
                });
            }
    
            // Get invoiceId from the URL parameters
            const invoiceId = Number(request.params.invoiceId);
    
            // Extract the partial data for updating from the request body
            const data: Partial<InvoiceEntities> = request.body;
    
            // Pass invoiceId and data to the service to update the invoice
            const updatedInvoice = await objInvoiceService.patchInvoice(invoiceId, data);
    
            // Return success response
            if (updatedInvoice) {
                return response.status(200).send({
                    status: 200,
                    message: 'Invoice updated successfully',
                    data: updatedInvoice,
                });
            } else {
                // Handle case when the invoice is not found
                return next(new CCustomErrors(new Error('Invoice not found'), errorTypeEnum.NOT_FOUND_ERROR));
            }
        } catch (error) {
            // Handle other errors
            return next(error);
        }
    }

    

    static async viewInvoice(request: express.Request, response: express.Response, next: express.NextFunction) {
        try {
            const shopId = Number(request.params.shopId); // Convert to number
    
            // Validate the shopId
            if (isNaN(shopId)) {
                return next(
                    new CCustomErrors(
                        new Error("Invalid shop ID"),
                        errorTypeEnum.INPUT_VALIDATION_ERROR
                    )
                );
            }
    
            // Fetch invoices for the given shop
            const invoices = await objInvoiceService.viewInvoicesByShop(shopId);
    
            // Check if invoices were found
            if (invoices.length > 0) {
                console.log("Invoices fetched for shop.");
                return response.status(200).send({
                    status: 200,
                    message: "Invoices fetched successfully for shop",
                    data: invoices,
                });
            } else {
                return next(
                    new CCustomErrors(
                        new Error("No invoices found for this shop"),
                        errorTypeEnum.NOT_FOUND_ERROR
                    )
                );
            }
        } catch (error) {
            return next(error); 
        }
    }
}    






