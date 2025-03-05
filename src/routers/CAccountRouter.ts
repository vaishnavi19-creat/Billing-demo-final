import { Router } from "express";
import { CAccountController } from "../controllers/CAccountController";
import { CAccountValidator } from "../validators/CAccountValidator";
import { CBaseRouter } from "./CBase.router";

class CAccountRouter extends CBaseRouter {
    declare router: any;
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
        this.router.get("/getallaccounts", CAccountController.getAllAccounts);
        this.router.get('/:id',CAccountValidator.validateAccountbyId(),CAccountController.getAccountById);
        

    }


    postRoutes() {
            console.log('In postRoute() from CCustomerRouter');
            
            //full customer validation is required
            this.router.post("/addaccount", CAccountValidator.validateAccount(), CAccountController.addAccount)
            this.router.post("/filter", CAccountValidator.validateFilterAccounts(), CAccountController.filterAccounts);
           
        }


        
    putRoutes() {
            console.log('In putRoute() from CCustomerRouter');
            this.router.put("/update/:id", CAccountValidator.validateUpdateAccount(), CAccountController.updateAccount);
    
    }
        
    patchRoutes() {
            console.log('In patchRoute() from CCustomerRouter');
            this.router.patch("/patch/:id", CAccountValidator.validatePatchAccount(), CAccountController.patchAccount);
    
            }
        
    
    deleteRoutes() {
            console.log('In deleteRoute() from CCustomerRouter');
            this.router.delete("/delete/:id", CAccountValidator.validateDeleteAccountById(), CAccountController.deleteAccountById);

                

            }
        }
    


export default new CAccountRouter().router;

    