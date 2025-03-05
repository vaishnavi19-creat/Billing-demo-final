import { CBaseRouter } from "./CBase.router";
import { CCustomerController } from "../controllers/CCustomer.controller";
import { CCustomerValidator } from "../validators/CCustomer.validator";

class CCustomerRouter extends CBaseRouter {
    constructor() {
        super();
        this.getRoutes();
        this.postRoutes();
        this.putRoutes();
        this.patchRoutes(); 
        this.deleteRoutes();
    }

    getRoutes() {
        console.log('In getRoute() from CCustomerRouter');
        
        // validation for customerId is required
        this.router.get('/customer/:customerId',CCustomerValidator.validateCustomerId(),CCustomerController.getCustomerById);
        
        
        //no need of validation
        this.router.get('/getAllCustomers', CCustomerController.getAllCustomers);
    }

    postRoutes() {
        console.log('In postRoute() from CCustomerRouter');
        
        //full customer validation is required
        this.router.post('/customer', CCustomerValidator.validateCustomer(), CCustomerController.addCustomer);
        this.router.post('/customer/filter', CCustomerValidator.validateCustomer(), CCustomerController.filterCustomers);

        
    }

    putRoutes() {
        console.log('In putRoute() from CCustomerRouter');
        
        //full customer validation is required(for update)
        this.router.put('/customer/:customerId', CCustomerValidator.validateputCustomer(), CCustomerController.updateCustomer);
    }

    patchRoutes() {
        console.log('In patchRoute() from CCustomerRouter');
        
        // validation is required for(e.g., mobileNo, email -partial)
        this.router.patch('/customer/:customerId', CCustomerValidator.validatePatchCustomer(), CCustomerController.patchCustomer);
    }

    deleteRoutes() {
        console.log('In deleteRoute() from CCustomerRouter');
        
        // Delete a customer (hard delete) validation for customerId is required
        this.router.delete('/customer/:customerId', CCustomerValidator.validateCustomerId(), CCustomerController.deleteCustomer);
        
        // Soft delete a customer by ID - validation for customerId is required
        this.router.delete('/customer/:customerId/soft', CCustomerValidator.validateCustomerId(), CCustomerController.softDeleteCustomerById);
    }
}

export default new CCustomerRouter().router;





























