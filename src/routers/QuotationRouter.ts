import { Router } from 'express';
import { QuotationController } from '../controllers/QuotationController';
import { QuotationValidator } from '../validators/QuotationValidator';
import { CBaseRouter } from './CBase.router';

class QuotationRouter extends CBaseRouter {
    constructor() {
        super();
        this.getRoutes();
        this.postRoutes();
        this.putRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }

    getRoutes() {
        console.log('In getRoute() from QuotationRouter');
        this.router.get('/getallquotation', QuotationController.getQuotations);


    }

    postRoutes() {
        console.log('In postRoute() from InvoiceRouter');
        // Create a new invoice
        this.router.post('/quotation', QuotationValidator.validateQuotation, QuotationController.createQuotation);

    }

    putRoutes() {
    }

    patchRoutes() {

    }

    deleteRoutes() {
        console.log('In deleteRoute() from QuotationRouter');
        // Delete an invoice by ID
        this.router.delete('/:id', QuotationController.deleteQuotation);

    }
}

export default new QuotationRouter().router;























