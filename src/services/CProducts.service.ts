import AppDataSource from "../db/dataSource";
import { CProductEntity } from "../db/entities/CProducts.entities";
import { getRepository } from "typeorm";
import { CProductModel } from "../db/models/CProducts.model";
import { IReduceProductQuantity } from "../interfaces/CProducts.interface";
import { CCustomErrors } from "../helpers/CCustomErrors.helper";
import { errorTypeEnum } from "../enums/errorType.enum";

export class CProductService {
  productModel: CProductModel;
 

  constructor() {
    this.productModel = new CProductModel(); // Ensure it is instantiated
  }

  async addProduct(productData: any): Promise<CProductEntity> {
    try {
        // Call the model method
        const savedProduct = await this.productModel.addProduct(productData);

        if (!savedProduct || typeof savedProduct !== "object") {
            throw new Error("Invalid product return type");
        }

        return savedProduct;
    } catch (error) {
        throw new CCustomErrors(
            new Error("Error adding product: " + error.message),
            errorTypeEnum.DATABASE_ERROR
        );
    }
}


  // // Fetch product details by name
  // async getProductDetailsByName(productName: string): Promise<CProductEntity | null> {
  //   const productRepository = getRepository(CProductEntity);
  //   const product = await productRepository.findOne({ where: { name: productName } });
  //   return product;
  // }


  async getProductDetailsByName(productName: string): Promise<CProductEntity | null> {
    try {
      // Use AppDataSource to ensure the repository  the initialized connection
      const productRepository = AppDataSource.getRepository(CProductEntity);
  
      // Fetch the product using the repository
      const product = await productRepository.findOne({
        where: { name: productName },
        relations: ['shop', 'unit'], 
      });
  
      // Return the product if found, otherwise return null
      return product;
    } catch (error) {
      // Handle any unexpected errors
      throw new Error(`Error fetching product details by name: ${error.message}`);
    }
  }

  // Update product by ID
  async updateProductById(productId: number, updatedData: Partial<CProductEntity>): Promise<CProductEntity | null> {
    try {
        //  Ensure ID is a valid integer
        if (!productId || isNaN(productId) || productId <= 0) {
            console.error(" Invalid product ID in service:", productId);
            throw new Error("Invalid product ID");
        }

        //  Call the model method to update the product
        return await CProductModel.updateProductById(productId, updatedData);
    } catch (error) {
        console.error(` Error updating product in service: ${error.message}`);
        throw new Error(`Error updating product in service: ${error.message}`);
    }
}


async deleteProductById(productId: number): Promise<boolean> {
    try {
        const productRepository = AppDataSource.getRepository(CProductEntity);

        if (!productId || isNaN(productId) || productId <= 0) {
            throw new Error("Invalid product ID");
        }

        const result = await productRepository.delete({ id: productId });

        return result.affected !== 0;
    } catch (error) {
        throw new Error(`Error deleting product by ID: ${error.message}`);
    }
}


  //patch method
  async patchProductById(productId: string, updatedFields: { quantity?: number | string; price?: number | string }): Promise<CProductEntity | null> {
    const productRepository = getRepository(CProductEntity);

    // Convert productId to a number before querying if necessary
    const id = parseInt(productId, 10);
    if (isNaN(id)) {
      throw new Error("Invalid product ID");
    }

    const product = await productRepository.findOne({ where: { id } });

    if (!product) {
      return null;
    }

    // Convert 'quantity' and 'price' to numbers if they are strings
    if (updatedFields.quantity !== undefined) {
      product.quantity = typeof updatedFields.quantity === 'string' ? parseInt(updatedFields.quantity, 10) : updatedFields.quantity;
    }
    if (updatedFields.price !== undefined) {
      product.price = typeof updatedFields.price === 'string' ? parseFloat(updatedFields.price) : updatedFields.price;
    }

    const updatedProduct = await productRepository.save(product);
    return updatedProduct;
  }
  
  static async filterProducts(
    category?: string,
    minPrice?: number,
    maxPrice?: number
  ): Promise<CProductEntity[]> {
    try {
      // Create an instance of the model and call the filterProducts method
      const productModel = new CProductModel();
      return await productModel.filterProducts(category, minPrice, maxPrice);
    } catch (error) {
      throw new Error(`Error in service filtering products: ${error.message}`);
    }
  }

// Method to reduce the product quantity in stock (called by service)
async reduceQuantityOnInvoice({ productId, soldQuantity }: { productId: number, soldQuantity: number }): Promise<CProductEntity> {
  try {
      
      const productModel = new CProductModel(); // Create an instance of the model
      const updatedProduct = await productModel.reduceProductQuantityOnInvoice(productId, soldQuantity); // Call the model method
      return updatedProduct; // Return the updated product
  } catch (error) {
      throw error; // Propagate the error to the controller
  }
}

public async getAllProducts(limit: number = 10, pageNumber: number = 1): Promise<CProductEntity[]> {
  try {
      console.log("Fetching all products in CProductService => getAllProducts()");
      return await this.productModel.getAllProducts(limit, pageNumber); // Calls the updated model method
  } catch (error) {
      throw new CCustomErrors(error, errorTypeEnum.DB_OPERATION_ERROR);
  }
}


}














