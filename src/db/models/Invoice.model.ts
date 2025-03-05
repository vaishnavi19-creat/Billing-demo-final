import AppDataSource from "../dataSource";
import { InvoiceEntities } from "../entities/Invoice.entities";
import { CInvoiceProductEntity } from "../entities/Invoice_Product.entities";
import { CProductEntity } from "../entities/CProducts.entities";
import { CCustomErrors } from "../../helpers/CCustomErrors.helper";
import { errorTypeEnum } from "../../enums/errorType.enum";

export class InvoiceModel {
  // Create a new invoice
  async createInvoice(invoiceData: Partial<InvoiceEntities>): Promise<InvoiceEntities> {
    const invoiceRepository = AppDataSource.getRepository(InvoiceEntities);
    const newInvoice = invoiceRepository.create(invoiceData);
    return await invoiceRepository.save(newInvoice);
  }

  // Update invoice with GST, tax, and total amount
  async updateInvoiceWithGSTAndTotal(
    invoiceId: number,
    products: Array<Partial<CInvoiceProductEntity> & { amount: number }>
  ): Promise<InvoiceEntities> {
    const invoiceRepository = AppDataSource.getRepository(InvoiceEntities);
    const invoiceProductRepository = AppDataSource.getRepository(CInvoiceProductEntity);

    let totalGST = 0;
    let totalTax = 0;
    let totalAmount = 0;

    for (const item of products) {
      const productId = item.product_id; // Use product_id instead of product object
      const product = await AppDataSource.getRepository(CProductEntity).findOneBy({ id: productId });

      if (!product) throw new Error(`Product with ID ${productId} not found`);

      const gstAmount = (item.amount * (product.tax_slab ? parseFloat(product.tax_slab) : 0)) / 100;
      const totalProductAmount = item.amount + gstAmount;

      totalGST += gstAmount;
      totalAmount += totalProductAmount;

      const invoiceProduct = invoiceProductRepository.create({
        product_id: productId, // Ensure this matches the entity field
        invoice_id: invoiceId, // Ensure this matches the entity field
        quantity: item.quantity,
        unit: String(product.unit_id), // Convert unit_id to string to match entity type
        price_per_unit: product.price,
        total_price: totalProductAmount,
      });
      

      await invoiceProductRepository.save(invoiceProduct);
    }

    const invoice = await invoiceRepository.findOneBy({ id: invoiceId });
    if (!invoice) throw new Error(`Invoice with ID ${invoiceId} not found`);

    invoice.totalAmount = totalAmount;
    await invoiceRepository.save(invoice);

    return invoice;
  }

  // Get invoice by ID
  async getInvoiceById(invoiceId: number): Promise<InvoiceEntities | null> {
    return await AppDataSource.getRepository(InvoiceEntities).findOneBy({ id: invoiceId });
  }

  // Get all invoices with pagination
  async getAllInvoices(limit: number, pageNumber: number): Promise<InvoiceEntities[]> {
    return await AppDataSource.getRepository(InvoiceEntities).find({
      take: limit,
      skip: (pageNumber - 1) * limit,
    });
  }

  // Soft delete an invoice by ID
  async deleteInvoice(invoiceId: number): Promise<boolean> {
    const result = await AppDataSource.getRepository(InvoiceEntities).softDelete({ id: invoiceId });
    return result.affected ? true : false;
  }

  // Filter invoices by status
  async filterInvoices(status: string): Promise<InvoiceEntities[]> {
    return await AppDataSource.getRepository(InvoiceEntities).find({ where: { status } });
  }

  // Update invoice details
  async updateInvoice(invoiceId: number, invoiceData: Partial<InvoiceEntities>): Promise<InvoiceEntities | null> {
    const invoiceRepository = AppDataSource.getRepository(InvoiceEntities);
    const invoice = await invoiceRepository.findOneBy({ id: invoiceId });

    if (!invoice) throw new Error(`Invoice with ID ${invoiceId} not found`);

    Object.assign(invoice, invoiceData);
    return await invoiceRepository.save(invoice);
  }

  // Get invoices by shop ID
  async viewInvoicesByShop(shopId: number): Promise<InvoiceEntities[]> {
    return await AppDataSource.getRepository(InvoiceEntities).find({
      where: { shop_id: shopId },
    });
  }
}



































// import AppDataSource from "../dataSource";
// import { InvoiceEntities } from "../entities/Invoice.entities";
// import { CInvoiceProductEntity } from "../entities/Invoice_Product.entities";
// import { CProductEntity } from "../entities/CProducts.entities";
// import { getRepository } from "typeorm";
// import { CCustomErrors } from "../../helpers/CCustomErrors.helper";
// import { errorTypeEnum } from "../../enums/errorType.enum";

// export class InvoiceModel {
//   // Create a new invoice
//   async createInvoice(invoiceData: Partial<InvoiceEntities>): Promise<InvoiceEntities> {
//     const invoiceRepository = AppDataSource.getRepository(InvoiceEntities);

//     // Create an invoice instance
//     const newInvoice = invoiceRepository.create(invoiceData);

//     // Save the invoice
//     const savedInvoice = await invoiceRepository.save(newInvoice);
//     return savedInvoice;
//   }

 

//   async updateInvoiceWithGSTAndTotal(
//     invoiceId: number,
//     products: Array<Partial<CInvoiceProductEntity> & { amount: number }>
//   ): Promise<InvoiceEntities> {
//     const invoiceRepository = AppDataSource.getRepository(InvoiceEntities);
//     const productRepository = AppDataSource.getRepository(CProductEntity);
//     const invoiceProductRepository = AppDataSource.getRepository(CInvoiceProductEntity);
  
//     let totalGST = 0;
//     let totalTax = 0;
//     let totalAmount = 0;
  
//     for (const item of products) {
//       if (typeof item.amount !== 'number') {
//         throw new Error("Amount is missing or not a number in the product data.");
//       }
  
//       // Ensure item.product is the product ID (if it's an entity, extract the id)
//       const productId = typeof item.product === 'object' ? item.product.id : item.product;
  
//       // Fetch the product using the productId
//       const product = await productRepository.findOne({
//         where: { id: productId }, // Use productId (which is a number) in the condition
//       });
  
//       if (!product) throw new Error(`Product with ID ${productId} not found`);
  
//       const gstAmount = (item.amount * product.gstRate) / 100;
//       const taxAmount = (item.amount * product.taxRate) / 100;
//       const totalProductAmount = item.amount + gstAmount + taxAmount;
  
//       totalGST += gstAmount;
//       totalTax += taxAmount;
//       totalAmount += totalProductAmount;
  
//       // Create the invoice product entry
//       const invoiceProduct = invoiceProductRepository.create({
//         product: { id: product.id }, // Pass only the product's ID
//         invoice: { id: invoiceId } as unknown as InvoiceEntities, // Pass the invoice entity using the ID
//         quantity: item.quantity,
//         unit: product.unit.unitSymbol, 
//         price_per_unit: product.price,
//         total_price: totalProductAmount,
//       });
  
//       await invoiceProductRepository.save(invoiceProduct);
//     }
  
//     // Update the invoice with total GST, Tax, and Amount
//     const invoice = await invoiceRepository.findOne({ where: { id: invoiceId } });
//     if (!invoice) throw new Error(`Invoice with ID ${invoiceId} not found`);
  
//     invoice.totalGST = totalGST;
//     invoice.totalTax = totalTax;
//     invoice.totalAmount = totalAmount;
  
//     const updatedInvoice = await invoiceRepository.save(invoice);
//     return updatedInvoice;
//   }
  



//   // Get an invoice by ID, including the related products
//   async getInvoiceById(invoiceId: number): Promise<InvoiceEntities | null> {
//     const invoiceRepository = AppDataSource.getRepository(InvoiceEntities);

//     // Find the invoice with related products
//     const invoice = await invoiceRepository.findOne({
//       where: { id: invoiceId },
//       relations: ["invoiceProducts", "invoiceProducts.product"],
//     });

//     return invoice;
//   }

//   // Get all invoices with pagination
//   async getAllInvoices(limit: number, pageNumber: number): Promise<InvoiceEntities[]> {
//     const invoiceRepository = AppDataSource.getRepository(InvoiceEntities);
    
//     const invoices = await invoiceRepository.find({
//       take: limit,
//       skip: (pageNumber - 1) * limit,
//       relations: ["invoiceProducts", "invoiceProducts.product"],
//     });

//     return invoices;
//   }

//   // Soft delete an invoice by ID
//   async deleteInvoice(invoiceId: number): Promise<boolean> {
//     const invoiceRepository = AppDataSource.getRepository(InvoiceEntities);

//     const result = await invoiceRepository.softDelete({ id: invoiceId });
//     return result.affected ? true : false;
//   }

//   // Filter invoices by status
//   async filterInvoices(status: string): Promise<InvoiceEntities[]> {
//     const invoiceRepository = AppDataSource.getRepository(InvoiceEntities);

//     const invoices = await invoiceRepository.find({
//       where: { status },
//       relations: ["invoiceProducts", "invoiceProducts.product"],
//     });

//     return invoices;
//   }

//   // Update an invoice
//   async updateInvoice(
//     invoiceId: number,
//     invoiceData: Partial<InvoiceEntities>
//   ): Promise<InvoiceEntities | null> {
//     const invoiceRepository = AppDataSource.getRepository(InvoiceEntities);

//     const invoice = await invoiceRepository.findOne({ where: { id: invoiceId } });
//     if (!invoice) throw new Error(`Invoice with ID ${invoiceId} not found`);

//     // Update invoice fields
//     Object.assign(invoice, invoiceData);

//     const updatedInvoice = await invoiceRepository.save(invoice);
//     return updatedInvoice;
//   }

//   // Partially update an invoice
//   async patchInvoice(invoiceId: number,invoiceData: Partial<InvoiceEntities>): Promise<InvoiceEntities | null> {
//     // Ensure the data source is initialized
//     if (!AppDataSource.isInitialized) {
//         await AppDataSource.initialize();
//     }

//     const invoiceRepository = AppDataSource.getRepository(InvoiceEntities);

//     // Find the invoice by ID
//     const invoice = await invoiceRepository.findOne({ where: { id: invoiceId } });
//     if (!invoice) {
//         throw new CCustomErrors(
//             new Error(`Invoice with ID ${invoiceId} not found`),
//             errorTypeEnum.NOT_FOUND_ERROR
//         );
//     }

//     // Apply the partial updates to the invoice entity
//     Object.assign(invoice, invoiceData);

//     // Save the updated invoice and return it
//     const patchedInvoice = await invoiceRepository.save(invoice);
//     return patchedInvoice;
// }




//   // View invoices by shop ID
//   async viewInvoicesByShop(shopId: number): Promise<InvoiceEntities[]> {
//     const invoiceRepository = AppDataSource.getRepository(InvoiceEntities);

//     const invoices = await invoiceRepository.find({
//       where: { shopId },
//       relations: ["invoiceProducts", "invoiceProducts.product"],
//     });

//     return invoices;
//   }
// }





























































































// import AppDataSource from "../dataSource";
// import { InvoiceEntities } from "../entities/Invoice.entities";
// import { CInvoiceProductEntity } from "../entities/Invoice_Product.entities";
// import { CProductEntity } from "../entities/CProducts.entities";
// import { getRepository } from "typeorm";
// import { CCustomErrors } from "../../helpers/CCustomErrors.helper";
// import { errorTypeEnum } from "../../enums/errorType.enum";

// export class InvoiceModel {
//   // Create a new invoice
//   async createInvoice(invoiceData: Partial<InvoiceEntities>): Promise<InvoiceEntities> {
//     const invoiceRepository = AppDataSource.getRepository(InvoiceEntities);

//     // Create an invoice instance
//     const newInvoice = invoiceRepository.create(invoiceData);

//     // Save the invoice
//     const savedInvoice = await invoiceRepository.save(newInvoice);
//     return savedInvoice;
//   }

 

//   async updateInvoiceWithGSTAndTotal(
//     invoiceId: number,
//     products: Array<Partial<CInvoiceProductEntity> & { amount: number }>
//   ): Promise<InvoiceEntities> {
//     const invoiceRepository = AppDataSource.getRepository(InvoiceEntities);
//     const productRepository = AppDataSource.getRepository(CProductEntity);
//     const invoiceProductRepository = AppDataSource.getRepository(CInvoiceProductEntity);
  
//     let totalGST = 0;
//     let totalTax = 0;
//     let totalAmount = 0;
  
//     for (const item of products) {
//       if (typeof item.amount !== 'number') {
//         throw new Error("Amount is missing or not a number in the product data.");
//       }
  
//       // Ensure item.product is the product ID (if it's an entity, extract the id)
//       const productId = typeof item.product === 'object' ? item.product.id : item.product;
  
//       // Fetch the product using the productId
//       const product = await productRepository.findOne({
//         where: { id: productId }, // Use productId (which is a number) in the condition
//       });
  
//       if (!product) throw new Error(`Product with ID ${productId} not found`);
  
//       const gstAmount = (item.amount * product.gstRate) / 100;
//       const taxAmount = (item.amount * product.taxRate) / 100;
//       const totalProductAmount = item.amount + gstAmount + taxAmount;
  
//       totalGST += gstAmount;
//       totalTax += taxAmount;
//       totalAmount += totalProductAmount;
  
//       // Create the invoice product entry
//       const invoiceProduct = invoiceProductRepository.create({
//         product: { id: product.id }, // Pass only the product's ID
//         invoice: { id: invoiceId } as unknown as InvoiceEntities, // Pass the invoice entity using the ID
//         quantity: item.quantity,
//         unit: product.unit.unitSymbol, 
//         price_per_unit: product.price,
//         total_price: totalProductAmount,
//       });
  
//       await invoiceProductRepository.save(invoiceProduct);
//     }
  
//     // Update the invoice with total GST, Tax, and Amount
//     const invoice = await invoiceRepository.findOne({ where: { id: invoiceId } });
//     if (!invoice) throw new Error(`Invoice with ID ${invoiceId} not found`);
  
//     invoice.totalGST = totalGST;
//     invoice.totalTax = totalTax;
//     invoice.totalAmount = totalAmount;
  
//     const updatedInvoice = await invoiceRepository.save(invoice);
//     return updatedInvoice;
//   }
  



//   // Get an invoice by ID, including the related products
//   async getInvoiceById(invoiceId: number): Promise<InvoiceEntities | null> {
//     const invoiceRepository = AppDataSource.getRepository(InvoiceEntities);

//     // Find the invoice with related products
//     const invoice = await invoiceRepository.findOne({
//       where: { id: invoiceId },
//       relations: ["invoiceProducts", "invoiceProducts.product"],
//     });

//     return invoice;
//   }

//   // Get all invoices with pagination
//   async getAllInvoices(limit: number, pageNumber: number): Promise<InvoiceEntities[]> {
//     const invoiceRepository = AppDataSource.getRepository(InvoiceEntities);
    
//     const invoices = await invoiceRepository.find({
//       take: limit,
//       skip: (pageNumber - 1) * limit,
//       relations: ["invoiceProducts", "invoiceProducts.product"],
//     });

//     return invoices;
//   }

//   // Soft delete an invoice by ID
//   async deleteInvoice(invoiceId: number): Promise<boolean> {
//     const invoiceRepository = AppDataSource.getRepository(InvoiceEntities);

//     const result = await invoiceRepository.softDelete({ id: invoiceId });
//     return result.affected ? true : false;
//   }

//   // Filter invoices by status
//   async filterInvoices(status: string): Promise<InvoiceEntities[]> {
//     const invoiceRepository = AppDataSource.getRepository(InvoiceEntities);

//     const invoices = await invoiceRepository.find({
//       where: { status },
//       relations: ["invoiceProducts", "invoiceProducts.product"],
//     });

//     return invoices;
//   }

//   // Update an invoice
//   async updateInvoice(
//     invoiceId: number,
//     invoiceData: Partial<InvoiceEntities>
//   ): Promise<InvoiceEntities | null> {
//     const invoiceRepository = AppDataSource.getRepository(InvoiceEntities);

//     const invoice = await invoiceRepository.findOne({ where: { id: invoiceId } });
//     if (!invoice) throw new Error(`Invoice with ID ${invoiceId} not found`);

//     // Update invoice fields
//     Object.assign(invoice, invoiceData);

//     const updatedInvoice = await invoiceRepository.save(invoice);
//     return updatedInvoice;
//   }

//   // Partially update an invoice
//   async patchInvoice(invoiceId: number,invoiceData: Partial<InvoiceEntities>): Promise<InvoiceEntities | null> {
//     // Ensure the data source is initialized
//     if (!AppDataSource.isInitialized) {
//         await AppDataSource.initialize();
//     }

//     const invoiceRepository = AppDataSource.getRepository(InvoiceEntities);

//     // Find the invoice by ID
//     const invoice = await invoiceRepository.findOne({ where: { id: invoiceId } });
//     if (!invoice) {
//         throw new CCustomErrors(
//             new Error(`Invoice with ID ${invoiceId} not found`),
//             errorTypeEnum.NOT_FOUND_ERROR
//         );
//     }

//     // Apply the partial updates to the invoice entity
//     Object.assign(invoice, invoiceData);

//     // Save the updated invoice and return it
//     const patchedInvoice = await invoiceRepository.save(invoice);
//     return patchedInvoice;
// }




//   // View invoices by shop ID
//   async viewInvoicesByShop(shopId: number): Promise<InvoiceEntities[]> {
//     const invoiceRepository = AppDataSource.getRepository(InvoiceEntities);

//     const invoices = await invoiceRepository.find({
//       where: { shopId },
//       relations: ["invoiceProducts", "invoiceProducts.product"],
//     });

//     return invoices;
//   }
// }











































