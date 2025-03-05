import express from "express";
import 'reflect-metadata';
import * as bodyParser from "body-parser";
import cors from "cors"; // Import the cors package
import AppDataSource from "./db/dataSource";
import CSignUpRouter from "./routers/CSignUp.router";
import { CCustomErrors } from "./helpers/CCustomErrors.helper";
import CShopRouter from "./routers/CShop.router";
import CCustomerRouter from "./routers/CCustomer.router";
import CProductRouter from "./routers/CProducts.router";
import UserRouter from "./routers/User.router";
import InvoiceRouter from "./routers/Invoice.router";
import vendorRouter from "./routers/Vendor.router";
import loginRouter from "./routers/CLogin.router";
import generateTokenRouter from "./routers/generateTokenRouter";  
import CAccountRouter from "./routers/CAccountRouter";
import QuotationRouter from "./routers/QuotationRouter";

export class CServer {

    public app: express.Application = express();

    constructor() {
        console.log('Initializing the application....');
        this.setConfigurations();
        this.setRoutes();
        this.handle404Error();
        this.handleAllErrors();
    }

    async setDatabaseConnection() {
        console.log('Trying to connect with database...');
        await AppDataSource.initialize().then(() => console.log('DB connection has been initialized.....')).catch((error) => {
            console.log('Error while connecting with database', error);
        });
    }

    setBodyParser() {
        console.log('Trying to parse the request body....');
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
    }

    
    registerEvents() {
        console.log('Registering the events....');
    }

    setConfigurations() {
        console.log('Setting the configuration....');
        this.setDatabaseConnection();
        this.setBodyParser();
        this.registerEvents();
        this.setupCORS(); // Setup CORS middleware
    }


    setupCORS() {
        console.log('Setting up CORS....');
        const corsOptions = {
          origin: 'http://localhost:3000', // Replace with your frontend's origin
          methods: ['GET', 'POST', 'PUT', 'DELETE'],
          allowedHeaders: ['Content-Type', 'Authorization'],
          credentials: true,
        };
        this.app.use(cors(corsOptions));
      }


    setRoutes() {
        console.log('Setting routes....');
        this.app.use('/api/v1.0/sign-up', CSignUpRouter);
        this.app.use('/api/v1.0/shop', CShopRouter);
        this.app.use('/api/v1.0/customer', CCustomerRouter);
        this.app.use('/api/v1.0/product', CProductRouter);
        this.app.use('/api/v1.0/user', UserRouter);
        this.app.use('/api/v1.0/invoice', InvoiceRouter);
        this.app.use('/api/v1.0/vendor', vendorRouter);
        this.app.use('/api/v1.0/login', loginRouter);
        this.app.use('/api/v1.0/account',CAccountRouter );
        this.app.use('/api/v1.0', generateTokenRouter);
        this.app.use('/api/v1.0/quotation', QuotationRouter);



    }

    handle404Error() {
        console.log('Caught in 404 error....');
        this.app.use((request: express.Request, response: express.Response) => {
            response.status(404).send({
                message: 'The requested URL could not be found.'
            });
        });
    }

    handleAllErrors() {
        console.log('Caught in unexpected error....');
        this.app.use((error: Error, request: express.Request, response: express.Response, next: express.NextFunction) => {
            let status: number = 500;
            let message: string = error.message || 'Something went wrong. Please try again later.';
            let reasons: {} = {};

            if (error instanceof CCustomErrors) {
                status = error.status;
                reasons = error.reasons || {};
            }

            response.status(status).send({
                message: message,
                reasons: reasons
            });
        });
    }

}



































