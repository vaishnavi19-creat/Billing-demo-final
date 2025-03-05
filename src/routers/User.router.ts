import { CBaseRouter } from "./CBase.router";
import { UserController } from "../controllers/User.controller";
import { UserValidator } from "../validators/User.validator";

class UserRouter extends CBaseRouter {
    constructor() {
        super();
        this.getRoutes();
        this.postRoutes();
        this.putRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }

    getRoutes() {
        console.log('In getRoute() from UserRouter');
        // Fetch a user by email - validation required
        // this.router.get('/user/:email', UserValidator.validateUserByemail(), UserController.getUserByEmail);

        this.router.get('/getAllUsers', UserController.getAllUsers);
    }

    postRoutes() {
        console.log('In postRoute() from UserRouter');
        // Register a user validation required
        this.router.post('/register', UserValidator.validateUser(), UserController.registerUser);

        // Filter users validation required
        // this.router.post('/user', UserValidator.validateFilterUser(), UserController.filterUser);
    }

    putRoutes() {
        console.log('In putRoute() from UserRouter');
        // Update a user validation required
        this.router.put('/user/:id', UserValidator.validateUser(), UserController.updateUser);
    }

    patchRoutes() {
        console.log('In patchRoute() from UserRouter');
        // Partially update validation required
        this.router.patch('/user/:userId', UserValidator.validatepatchUser(), UserController.patchUser);
    }

    deleteRoutes() {
        console.log('In deleteRoute() from UserRouter');
        this.router.delete('/user/:id', UserController.deleteUser);
    }
}

export default new UserRouter().router;































