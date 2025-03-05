import AppDataSource from '../dataSource';
import { Quotation } from '../entities/quotation.entities';


export class QuotationModel {
    private repo = AppDataSource.getRepository(Quotation);

    async createQuotation(data: Partial<Quotation>): Promise<Quotation> {
        const quotation = this.repo.create(data);
        return await this.repo.save(quotation);
    }

   
    async getQuotations(): Promise<Quotation[]> {
        return await this.repo.find();
    }

    async deleteQuotation(id: number): Promise<void> {
        await this.repo.delete(id);
    }
}
