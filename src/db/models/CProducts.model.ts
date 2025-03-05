import { IProduct } from "../../interfaces/CProducts.interface";
import { getConnection, getRepository, Repository } from "typeorm";
import { CProductEntity } from "../entities/CProducts.entities";
import { CCustomErrors } from "../../helpers/CCustomErrors.helper";
import { errorTypeEnum } from "../../enums/errorType.enum";
import AppDataSource from "../dataSource";

export class CProductModel {
    private productRepository: Repository<CProductEntity>;

  constructor() {
    this.productRepository = AppDataSource.getRepository(CProductEntity);
  }


  static async updateProductById(productId: number, updatedData: Partial<CProductEntity>): Promise<CProductEntity | null> {
    try {
        // Ensure TypeORM connection is initialized
        if (!AppDataSource.isInitialized) {
            console.error("TypeORM connection not initialized!");
            throw new Error("Database connection is not initialized.");
        }

        const productRepository = AppDataSource.getRepository(CProductEntity);

        //  Check if the product exists
        const product = await productRepository.findOne({ where: { id: productId } });
        if (!product) {
            console.log(` Product ID ${productId} not found.`);
            return null;
        }

        // Merge updated data and save
        Object.assign(product, updatedData);
        const updatedProduct = await productRepository.save(product);

        console.log(` Product ID ${productId} updated successfully.`);
        return updatedProduct;
    } catch (error) {
        console.error(` Error updating product: ${error.message}`);
        throw new Error(`Error updating product: ${error.message}`);
    }
}
    


  async filterProducts(
    category?: string,
    minPrice?: number,
    maxPrice?: number
  ): Promise<CProductEntity[]> {
    try {
      const whereConditions: any = {};
      if (category) whereConditions.category = category;
      if (minPrice !== undefined) whereConditions.price = { $gte: minPrice };
      if (maxPrice !== undefined) whereConditions.price = { ...whereConditions.price, $lte: maxPrice };

      return await this.productRepository.find({
        where: whereConditions,
      });
    } catch (error) {
      throw new Error(`Error filtering products in model: ${error.message}`);
    }
  }

  

  async addProduct(productData: any): Promise<CProductEntity> {
    try {
      // Ensure timestamps are set
      const newProduct = this.productRepository.create({
        ...productData,
        created_on: productData.created_on || new Date(),
        updated_on: productData.updated_on || new Date(),
      });

      // Save the product details
      const savedProduct = await this.productRepository.save(newProduct);

      if (Array.isArray(savedProduct)) {
        throw new Error("Unexpected array return. Expected a single entity.");
      }

      return savedProduct;
    } catch (error) {
      throw new Error("Database connection error: " + error.message);
    }
  }
  
  
  

    async getProductDetailsByName(productName: string): Promise<CProductEntity | null> {
        const productRepository = getRepository(CProductEntity);
        try {
            const product = await productRepository.findOne({
                where: { name: productName },
                relations: ['shop', 'unit'],
            });
            return product;
        } catch (error) {
            throw new CCustomErrors(new Error("Error fetching product by name"), errorTypeEnum.DATABASE_ERROR);
        }
    }


    async deleteProductById(productId: string): Promise<boolean> {
      try {
          const productRepository = AppDataSource.getRepository(CProductEntity);

          const id = parseInt(productId, 10); // Convert the ID to an integer
          if (isNaN(id) || id <= 0) {
              throw new Error("Invalid product ID");
          }

          const result = await productRepository.delete({ id });

          return result.affected !== 0;
      } catch (error) {
          throw new Error(`Error deleting product by ID: ${error.message}`);
      }
  }



       // Method to reduce the product quantity in stock
    async reduceProductQuantityOnInvoice(productId: number, soldQuantity: number): Promise<CProductEntity> {
      try {
          const product = await this.productRepository.findOne({ where: { id: productId } });

          if (!product) {
              throw new Error("Product not found");
          }

          // Check if sufficient stock is available
          if (product.quantity < soldQuantity) {
              throw new Error("Insufficient stock available");
          }

          // Reduce the stock/quantity
          product.quantity -= soldQuantity;

          // Save the updated product
          const updatedProduct = await this.productRepository.save(product);

          return updatedProduct; // Return the updated product
      } catch (error) {
          throw new Error(`Error reducing product quantity: ${error.message}`);
      }
  }

  public async getAllProducts(limit: number = 10, pageNumber: number = 1): Promise<CProductEntity[]> {
    try {
        console.log("Fetching all products without shop relation");

        const skip = (limit * pageNumber) - limit;

        // Adjust the query to select shop_id directly instead of the shop relation
        return await this.productRepository
            .createQueryBuilder("product")
            .select([
                "product.id",
                "product.name",
                "product.description",
                "product.price",
                "product.quantity",
                "product.stock",
                "product.category",
                "product.keywords",
                "product.created_on",
                "product.updated_on",
                "product.hsn_code",
                "product.expiry_date",
                "product.mfg_date",
                "product.tax_slab",
                "product.shop_id",  // Selecting shop_id (no relation needed)
                "product.unit_id"  // Selecting unit_id (no relation needed)
            ])
            .skip(skip)  // Pagination logic (limit per page)
            .take(limit) // Pagination limit
            .getMany();  // Fetch products
    } catch (error) {
        throw new Error(`Error fetching all products: ${error.message}`);
    }
}


}




















