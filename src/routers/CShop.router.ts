import { CBaseRouter } from "./CBase.router";
import { CShopController } from "../controllers/CShop.controller";
import { CShopValidator } from "../validators/CShop.validator";

class CSignUpRouter extends CBaseRouter {
    constructor() {
        super();
        this.getRoutes();
        this.postRoutes();
        this.putRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }

    getRoutes() {
        console.log('In getRoute() from CSignUpRouter');
        this.router.get('/getAllShops', CShopController.getAllShops);
    }

    postRoutes() {
        console.log('In postRoute() from CSignUpRouter');
        // Filter shops - validation required
        this.router.post('/filterShops', CShopValidator.validateFilterShops(), CShopController.filterShops);

        // Sign up shop - validation required
        this.router.post('/shop/addshop', CShopValidator. validateaddshop(), CShopController.addshop);
    }

    putRoutes() {
        console.log('In putRoute() from CSignUpRouter');
        // Update shop details - validation required
        this.router.put('/shop/:shopId', CShopValidator.validateUpdateShopbyid(), CShopController.updateShop);
    }

    patchRoutes() {
        console.log('In patchRoute() from CSignUpRouter');
        // Partially update shop details validation required
        this.router.patch('/shop/:shopId', CShopValidator.validatePatchShop(), CShopController.patchShop);
    }

    deleteRoutes() {
        console.log('In deleteRoute() from CSignUpRouter');
        this.router.delete('/shop/:shopId', CShopController.deleteShop);
    }
}

export default new CSignUpRouter().router;



























