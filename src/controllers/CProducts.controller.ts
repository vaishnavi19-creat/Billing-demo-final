import { Request, Response, NextFunction, RequestHandler } from "express";
import { validationResult } from "express-validator";
import { CProductService } from "../services/CProducts.service";
import { CCustomErrors } from "../helpers/CCustomErrors.helper";
import { errorTypeEnum } from "../enums/errorType.enum";
import { getRepository } from "typeorm";
import { CProductEntity } from "../db/entities/CProducts.entities";
import AppDataSource from "../db/dataSource";
import { IReduceProductQuantity } from "../interfaces/CProducts.interface";

const productService = new CProductService();

export class CProductController {

  static async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 400,
                message: "Invalid inputs",
                errors: errors.array()
            });
        }

        // Ensure the route parameter is correctly extracted
        console.log(" Received productId from params:", req.params); // Debugging

        // Fix case sensitivity issue by forcing lowercase
        const productId = req.params.productid; // Must match route exactly

        // Convert `productId` to integer
        const id = parseInt(productId, 10);
        console.log(" Parsed productId:", id); 

        if (isNaN(id) || id <= 0) {
            console.error("Invalid product ID received:", productId);
            return res.status(400).json({
                status: 400,
                message: "Invalid product ID. Please provide a valid integer."
            });
        }

        // Extract updated product data
        const updatedData = req.body;

        // Call service to update the product by ID
        const updatedProduct = await productService.updateProductById(id, updatedData);

        if (updatedProduct) {
            console.log(` Product ID ${id} updated successfully.`);
            return res.status(200).json({
                status: 200,
                message: "Product updated successfully",
                data: updatedProduct
            });
        } else {
            console.log(` Product ID ${id} not found.`);
            return res.status(404).json({
                status: 404,
                message: "Product not found"
            });
        }
    } catch (error) {
        console.error("Error in updateProduct controller:", error.message);
        return next(error);
    }
}
  
  // Delete product
      static async deleteProduct(req: Request, res: Response, next: NextFunction) {
          try {
              const productId = req.params.productid; 
              console.log("Received DELETE request for product ID:", productId); 

  
              // Convert productId to an integer
              const id = parseInt(productId, 10);
              if (isNaN(id) || id <= 0) {
                  return res.status(400).json({
                      status: 400,
                      message: "Invalid product ID. Please provide a valid integer."
                  });
              }
  
              // Call the service to delete the product by ID
              const isDeleted = await productService.deleteProductById(id);
  
              if (isDeleted) {
                  return res.status(200).json({
                      status: 200,
                      message: "Product deleted successfully"
                  });
              } else {
                console.log(`Product ID ${id} not found.`); 
                  return res.status(404).json({
                      status: 404,
                      message: "Product not found"
                  });
              }
          } catch (error) {
              return next(error);
          }
      }

  static async addProduct(req: Request, res: Response, next: NextFunction) {
    try {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: 'Invalid inputs', errors: errors.array() });
        }

        // Extract product data
        const productData = req.body;

        // Proceed to add the product
        const savedProduct = await productService.addProduct(productData);

        return res.status(201).json({
            status: 201,
            message: "Product added successfully",
            data: savedProduct,
        });
    } catch (error) {
        return next(error);
    }
}
  

  static async getProductDetailsByName(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate input parameters
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: 'Please provide valid inputs.',
          reasons: { errors: errors.array() },
        });
      }
  
      // Extract productName from request params
      const productName = req.params.productName;
  
      // Fetch product details using the service
      const product = await productService.getProductDetailsByName(productName);
  
      // If a product is found, return it
      if (product) {
        return res.status(200).json({ status: 200, data: product });
      } else {
        // Return 404 if no product is found
        return res.status(404).json({ message: 'Product not found.' });
      }
    } catch (error) {
      // Handle any unexpected errors and pass them to the global error handler
      return next(error);
    }
  }

  
  // Filter products by category and price range
  static async filterProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { category, minPrice, maxPrice } = req.query;

      // Convert query params to numbers where necessary
      const minPriceNum = minPrice ? parseFloat(minPrice as string) : undefined;
      const maxPriceNum = maxPrice ? parseFloat(maxPrice as string) : undefined;

      // Call the static method of CProductService
      const filteredProducts = await CProductService.filterProducts(
        category as string,
        minPriceNum,
        maxPriceNum
      );

      return res.status(200).json({
        status: 200,
        data: filteredProducts,
      });
    } catch (error) {
      console.error("Error in filterProduct controller:", error);  // Log error
      return next(error); // Pass the error to the global error handler
    }
  }



  // Patch product (update quantity and price)
  static async patchProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new CCustomErrors(new Error("Invalid inputs"), errorTypeEnum.INPUT_VALIDATION_ERROR, errors));
      }

      const productId = req.params.productId;
      const { quantity, price } = req.body;

      if (quantity === undefined && price === undefined) {
        return res.status(400).json({
          status: 400,
          message: "At least one of 'quantity' or 'price' must be provided",
        });
      }

      const updatedProduct = await productService.patchProductById(productId, { quantity, price });

      if (updatedProduct) {
        return res.status(200).json({
          status: 200,
          message: "Product updated successfully",
          data: updatedProduct,
        });
      } else {
        return res.status(404).json({
          status: 404,
          message: "Product not found",
        });
      }
    } catch (error) {
      return next(error);
    }
  }





 static async reduceQuantityOnInvoice(req: Request, res: Response, next: NextFunction) {
  try {
      const { productId, soldQuantity }: { productId: number; soldQuantity: number } = req.body;

      // Validate input
      if (!productId || !soldQuantity) {
          return res.status(400).json({ message: "Product ID and Sold Quantity are required" });
      }

      // Call the service to reduce the quantity
      const updatedProduct = await productService.reduceQuantityOnInvoice({ productId, soldQuantity });

      // Return success response
      return res.status(200).json({
          message: "Product quantity updated successfully",
          product: updatedProduct
      });
  } catch (error) {
      // Pass the error to the next middleware (error handling middleware)
      next(error);
  }
}

static async getAllProducts(req: Request, res: Response, next: NextFunction) {
  try {
      console.log("Fetching all products in CProductController => getAllProducts()");

      // Extract query parameters (limit, pageNumber)
      const limit = req.query.limit ? (Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit) : "10";
      const pageNumber = req.query.pageNumber ? (Array.isArray(req.query.pageNumber) ? req.query.pageNumber[0] : req.query.pageNumber) : "1";

      // Convert to integers
      const parsedLimit = parseInt(limit as string);
      const parsedPageNumber = parseInt(pageNumber as string);

      // Fetch products with pagination
      const products = await productService.getAllProducts(parsedLimit, parsedPageNumber);

      // Send response
      res.status(200).send({
          status: 200,
          message: "All products fetched successfully",
          data: products.length > 0 ? products : []
      });
  } catch (error) {
      return next(error);
  }
}


}

































