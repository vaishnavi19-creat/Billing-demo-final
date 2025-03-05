import { CBaseRouter } from "./CBase.router";
import { InvoiceController } from "../controllers/Invoice.controller";
import { InvoiceValidator } from "../validators/Invoice.validator"; // Add necessary validators if any

class InvoiceRouter extends CBaseRouter {
    constructor() {
        super();
        this.getRoutes();
        this.postRoutes();
        this.putRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }

    getRoutes() {
        console.log('In getRoute() from InvoiceRouter');
        // Get all invoices with pagination
        this.router.get('/getAllInvoices', InvoiceController.getAllInvoices);

        // Get an invoice by ID - validation required
        this.router.get('/getInvoiceById/:id', InvoiceValidator.validateInvoiceId(), InvoiceController.getInvoice);

        // View invoices for a particular shop
        this.router.get('/viewInvoice/:shopId', InvoiceController.viewInvoice);
    }

    postRoutes() {
        console.log('In postRoute() from InvoiceRouter');
        // Create a new invoice
        this.router.post('/createInvoice', InvoiceValidator.validateInvoice(), InvoiceController.createInvoice);

        this.router.post('/invoice/:status',InvoiceController.filterInvoices);
    }

    putRoutes() {
        console.log('In putRoute() from InvoiceRouter');
        // Update an invoice - validation required
        this.router.put('/invoice/:invoiceid',  InvoiceValidator.validatePatchInvoiceBody(), InvoiceController.updateInvoice);
    }

    patchRoutes() {
        console.log('In patchRoute() from InvoiceRouter');
        // Partially update an invoice (PATCH)
        this.router.patch('/invoice/:invoiceId', InvoiceValidator.validateInvoiceId(), InvoiceController.patchInvoice);

    }

    deleteRoutes() {
        console.log('In deleteRoute() from InvoiceRouter');
        // Delete an invoice by ID
        this.router.delete('/deleteInvoice/:id', InvoiceController.deleteInvoice);
    }
}

export default new InvoiceRouter().router;






































