import * as express from "express";
import { validationResult } from "express-validator";
import { errorTypeEnum } from "../enums/errorType.enum";
import { CCustomErrors } from "../helpers/CCustomErrors.helper";
import { CCustomerService } from "../services/CCustomer.service";
import { Request, Response, NextFunction } from "express";

const objCustomerService = new CCustomerService();

export class CCustomerController {
  // Add customer
  static async addCustomer(req: Request, res: Response, next: NextFunction) {
    try {
        console.log("Received Customer Data in Controller:", req.body);  // Debugging log

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error("Validation Error:", errors.array());
            return next(new CCustomErrors(new Error('Validation error.'), errorTypeEnum.INPUT_VALIDATION_ERROR, errors));
        }

        const objFilteredCustomer = req.body;
        const objSavedCustomer = await objCustomerService.addCustomer(objFilteredCustomer);

        if (objSavedCustomer) {
            return res.status(201).send({
                status: 201,
                message: 'Customer added successfully',
                data: objSavedCustomer
            });
        } else {
            return res.status(400).send({
                message: 'Unable to save customer, please try again.'
            });
        }
    } catch (error) {
        console.error(" Error in addCustomer Controller:", error.message);
        return next(error);
    }
}




  // Get all customers
  static async getAllCustomers(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Number(req.query.limit) || 10;
      const pageNumber = Number(req.query.pageNumber) || 1;

      const arrObjCustomers = await objCustomerService.getAllCustomer(limit, pageNumber);

      return res.status(200).send({
        status: 200,
        message: 'Success',
        data: arrObjCustomers.length > 0 ? arrObjCustomers : []
      });
    } catch (error) {
      return next(error);
    }
  }

  // Get customer by ID
  static async getCustomerById(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Please provide the valid inputs.",
          reasons: errors.array().map(error => ({
            field: error.param,
            message: error.msg
          }))
        });
      }

      const customerId = parseInt(req.params.customerId, 10);

    if (isNaN(customerId)) {
      return res.status(400).json({ message: "Customer ID must be a valid number." });
    }

    // Fetch the customer using the service
    const customer = await objCustomerService.getCustomerById(customerId);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found." });
    }

    // Return the customer details
    return res.status(200).json(customer);

  } catch (error) {
    console.error("Error in getCustomerById:", error);

    // Handle unexpected server errors
    return res.status(500).json({
      message: "An error occurred while fetching the customer.",
      error: error.message,
    });
  }
}


  // Soft delete customer by ID
  static async softDeleteCustomerById(req: Request, res: Response, next: NextFunction) {
    try {
      const customerId = Number(req.params.customerId);
      const result = await objCustomerService.softDeleteCustomer(customerId);

      if (result) {
        return res.status(200).send({
          status: 200,
          message: 'Customer soft-deleted successfully.'
        });
      } else {
        return res.status(404).send({
          message: 'Customer not found.'
        });
      }
    } catch (error) {
      return next(error);
    }
  }

  // Update customer
  static async updateCustomer(req: Request, res: Response, next: NextFunction) {
    try {
        console.log("Received Customer Data in Controller:", req.body);  // Debugging log

        // ✅ Remove unexpected fields from req.body (Matches `addCustomer`)
        const allowedFields = ["customerName", "customerMobileNo", "customerEmailId", "customerAddress"];
        req.body = Object.fromEntries(
            Object.entries(req.body).filter(([key]) => allowedFields.includes(key))
        );

        console.log("Filtered Customer Data for Update:", req.body);  // Debugging log

        // ✅ Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error("Validation Error:", errors.array());
            return next(new CCustomErrors(new Error('Validation error.'), errorTypeEnum.INPUT_VALIDATION_ERROR, errors));
        }

        const customerId = Number(req.params.customerId);
        const customerData = req.body;

        console.log("Controller - Calling service to update:", customerId, customerData);

        const updatedCustomer = await objCustomerService.updateCustomerById(customerId, customerData);

        console.log("Controller - Update successful:", updatedCustomer);

        if (updatedCustomer) {
            return res.status(200).json({
                status: 200,
                message: "Customer updated successfully.",
                data: updatedCustomer
            });
        } else {
            return res.status(404).json({
                message: "Customer not found."
            });
        }
    } catch (error) {
        console.error("Controller - Update customer error:", error);
        return next(error);
    }
}


  // Patch customer
  static async patchCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const customerId = Number(req.params.customerId);
      const customerData = req.body;

      const updatedCustomer = await objCustomerService.updateCustomerById(customerId, customerData);

      if (updatedCustomer) {
        return res.status(200).json({
          status: 200,
          message: 'Customer partially updated successfully.',
          data: updatedCustomer
        });
      } else {
        return res.status(404).json({
          message: 'Customer not found.'
        });
      }
    } catch (error) {
      return next(error);
    }
  }

  // Delete customer
  static async deleteCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const customerId = Number(req.params.customerId);
      const result = await objCustomerService.deleteCustomer(customerId);

      if (result) {
        return res.status(200).send({
          status: 200,
          message: 'Customer deleted successfully.'
        });
      } else {
        return res.status(404).send({
          message: 'Customer not found.'
        });
      }
    } catch (error) {
      return next(error);
    }
  }

  // Filter customers
  static async filterCustomers(req: Request, res: Response, next: NextFunction) {
    try {
        const filters = req.query;

        // Ensure filters are passed in as an object
        if (typeof filters !== "object") {
            return res.status(400).json({
                status: 400,
                message: "Invalid filters format. Filters should be an object.",
            });
        }

        const customers = await objCustomerService.filterCustomers(filters);

        return res.status(200).json({
            status: 200,
            message: "Customers filtered successfully.",
            data: customers,
        });
    } catch (error) {
        return next(error);
    }
}

}
























