import { Request, Response } from 'express';
import { QuotationService } from '../services/QuotationServices';

const service = new QuotationService();

export class QuotationController {
    static async createQuotation(req: Request, res: Response) {
        try {
            const quotation = await service.createQuotation(req.body);
            return res.status(201).json(quotation);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    static async getQuotations(req: Request, res: Response) {
        try {
            const quotations = await service.getQuotations();
            return res.status(200).json(quotations);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    static async deleteQuotation(req: Request, res: Response) {
        try {
            await service.deleteQuotation(Number(req.params.id));
            return res.status(200).json({ message: 'Quotation deleted' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}
