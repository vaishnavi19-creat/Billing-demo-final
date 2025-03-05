import { InvoiceModel } from "../db/models/Invoice.model";
import { InvoiceEntities } from "../db/entities/Invoice.entities";
import { CCustomErrors } from "../helpers/CCustomErrors.helper";
import { errorTypeEnum } from "../enums/errorType.enum";
import AppDataSource from "../db/dataSource";

const invoiceModel = new InvoiceModel();

export class InvoiceService {
  // Create a new invoice
  async createInvoice(invoiceData: Partial<InvoiceEntities>): Promise<InvoiceEntities> {
    try {
      return await invoiceModel.createInvoice(invoiceData);
    } catch (error) {
      throw new CCustomErrors(error, errorTypeEnum.INTERNAL_SERVER_ERROR);
    }
  }

  // Get invoice by ID
  async getInvoiceById(invoiceId: number): Promise<InvoiceEntities | null> {
    try {
      return await invoiceModel.getInvoiceById(invoiceId);
    } catch (error) {
      throw error;
    }
  }

  // Get all invoices with pagination
  async getAllInvoices(limit: number, pageNumber: number): Promise<InvoiceEntities[]> {
    try {
      return await invoiceModel.getAllInvoices(limit, pageNumber);
    } catch (error) {
      throw new CCustomErrors(error, errorTypeEnum.INTERNAL_SERVER_ERROR);
    }
  }

  // Delete an invoice by ID (Soft Delete)
  async deleteInvoice(invoiceId: number): Promise<boolean> {
    try {
      return await invoiceModel.deleteInvoice(invoiceId);
    } catch (error) {
      throw new CCustomErrors(error, errorTypeEnum.INTERNAL_SERVER_ERROR);
    }
  }

  // Filter invoices by status
  async filterInvoices(status: string): Promise<InvoiceEntities[]> {
    try {
      return await invoiceModel.filterInvoices(status);
    } catch (error) {
      throw new CCustomErrors(error, errorTypeEnum.INTERNAL_SERVER_ERROR);
    }
  }

  // Update invoice details
  async updateInvoice(invoiceId: number, updatedInvoiceData: Partial<InvoiceEntities>): Promise<InvoiceEntities> {
    try {
      return await invoiceModel.updateInvoice(invoiceId, updatedInvoiceData);
    } catch (error) {
      throw new CCustomErrors(error, errorTypeEnum.INTERNAL_SERVER_ERROR);
    }
  }

  // Get invoices by shop ID
  async viewInvoicesByShop(shopId: number): Promise<InvoiceEntities[]> {
    try {
      return await invoiceModel.viewInvoicesByShop(shopId);
    } catch (error) {
      throw new CCustomErrors(error, errorTypeEnum.INTERNAL_SERVER_ERROR);
    }
  }



  async patchInvoice(invoiceId: number, data: Partial<InvoiceEntities>): Promise<InvoiceEntities | null> {
    try {
      const invoiceRepository = AppDataSource.getRepository(InvoiceEntities);
  
      // Find the invoice by ID
      const invoice = await invoiceRepository.findOneBy({ id: invoiceId });
      if (!invoice) {
        throw new CCustomErrors(new Error("Invoice not found"), errorTypeEnum.NOT_FOUND_ERROR);
      }
  
      // Apply updates to the invoice
      Object.assign(invoice, data);
  
      // Save and return the updated invoice
      return await invoiceRepository.save(invoice);
    } catch (error) {
      throw new CCustomErrors(error, errorTypeEnum.INTERNAL_SERVER_ERROR);
    }
  }

}




























































