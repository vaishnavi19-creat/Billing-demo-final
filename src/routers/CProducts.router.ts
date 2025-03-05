import { CBaseRouter } from "./CBase.router";
import { CProductController } from "../controllers/CProducts.controller";
import { CProductValidator } from "../validators/CProducts.validator";

class CProductRouter extends CBaseRouter {
    constructor() {
        super();
        this.getRoutes();
        this.postRoutes();
        this.putRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }
    getRoutes() {
        console.log('In getRoute() from CProductRouter');
        // Route to get product details by name    
        this.router.get('/product/getProductDetailsByName/:productName',CProductValidator.validateProductsByName(),CProductController.getProductDetailsByName);
        this.router.get("/getAllProducts", CProductController.getAllProducts);   //getAllProducts?limit=-5&pageNumber=1
    }

    postRoutes() {
        console.log('In postRoute() from CProductRouter');
        // Add a new product - validation required
        this.router.post('/product', CProductValidator.validateProduct(), CProductController.addProduct);
        this.router.post('/product/filter', CProductController.filterProduct);
        // for reduce product quamntity
        console.log(CProductController.reduceQuantityOnInvoice); // This should log the function definition
        this.router.post("/reduce-quantity",CProductValidator.reduceProductQuantityValidator(),CProductController.reduceQuantityOnInvoice); 
    }

    putRoutes() {
        console.log('In putRoute() from CProductRouter');
        // Update product details - validation required
        this.router.put('/product/:productid', CProductValidator.validateProduct(), CProductController.updateProduct);
    }

    patchRoutes() {
        console.log('In patchRoute() from CProductRouter');
        // Partially update product details - validation required
        this.router.patch('/product/:Productid', CProductValidator.validatepatchProduct(), CProductController.patchProduct);
    }

    deleteRoutes() {
        console.log('In deleteRoute() from CProductRouter');
        this.router.delete('/product/:productid', CProductController.deleteProduct);
    }
}

export default new CProductRouter().router;















