import { Quotation } from '../db/entities/quotation.entities';
import { QuotationModel } from '../db/models/QuotationModel';

export class QuotationService {
    private model = new QuotationModel();

    async createQuotation(data: Partial<Quotation>) {
        return await this.model.createQuotation(data);
    }

    async getQuotations() {
        return await this.model.getQuotations();
    }

    async deleteQuotation(id: number) {
        await this.model.deleteQuotation(id);
    }
}
