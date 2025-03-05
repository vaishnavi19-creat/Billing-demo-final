import { errorTypeEnum } from "../enums/errorType.enum";
import { CCustomErrors } from "../helpers/CCustomErrors.helper";
import { addshopReq } from "../interfaces/CShop.interface";
import { CShopModel } from "../db/models/CShop.model";
import { getRepository, Repository } from "typeorm";
import { CShopEntities } from "../db/entities/CShop.entities";
import AppDataSource from "../db/dataSource";
import { CAccountEntities } from "../db/entities/CAccount.entities";
import { CAccountModel } from "../db/models/CAccountModel";

const objShopModel = new CShopModel();
const objAccountModel = new CAccountModel();
export class CShopService {

    // async addshop(request: addshopReq) {
    //     try {
    //         console.log('In CShopService => addshop()');
    
    //         // Ensure accountId exists and is valid
    //         if (!request.accountId || typeof request.accountId !== "string") {
    //             throw new Error("Account ID is required to add a shop.");
    //         }
    
    //         // Validate shop details - check for existing shop
    //         const existingShop = await this.getShopDetailsByNameZipCode(request.shopName, request.shopCityZipCode);
    //         if (existingShop) {
    //             throw new CCustomErrors(
    //                 new Error(`The shop ${existingShop.shopName} already exists in the same city.`),
    //                 errorTypeEnum.INPUT_VALIDATION_ERROR,
    //                 []
    //             );
    //         }
    
    //         // Proceed to save the shop details
    //         const savedShop = await objShopModel.addshop(request);
    //         return savedShop;
    //     } catch (error) {
    //         throw error;
    //     }
    // }
    

    
    async addshop(request: addshopReq) {
        try {
            console.log('In CShopService => addshop()');
    
            // Validate shop details - check for existing shop
            const existingShop = await this.getShopDetailsByNameZipCode(request.shopName, request.shopCityZipCode);
            if (existingShop) {
                console.log('Caught in input validation error from CShopService => addshop() existing shop name');
                throw new CCustomErrors(
                    new Error(`The shop ${existingShop.shopName} already exists in the same city. Please confirm if you are ${existingShop.shopOwnerName} and may have forgotten the credentials.`),
                    errorTypeEnum.INPUT_VALIDATION_ERROR,
                    []
                );
            }
    
            // Validate mobile number
            const existingShopMobileNumber = await this.getShopDetailsByShopMobileNumber(request.shopMobileNumber);
            if (existingShopMobileNumber) {
                throw new CCustomErrors(
                    new Error(`The mobile number ${existingShopMobileNumber.shopMobileNumber} already exists. Please provide another mobile number.`),
                    errorTypeEnum.INPUT_VALIDATION_ERROR,
                    {
                        errors: [
                            {
                                value: existingShopMobileNumber.shopMobileNumber,
                                msg: `The shop mobile number ${existingShopMobileNumber.shopMobileNumber} already exists. Please try with another number.`,
                                param: 'shopMobileNumber',
                                location: 'body',
                            },
                        ],
                    }
                );
            }
    
            // Validate email
            const existingShopEmailId = await this.getShopDetailsByShopEmailId(request.shopEmailId);
            if (existingShopEmailId) {
                throw new CCustomErrors(
                    new Error(`The email id ${existingShopEmailId.shopEmailId} already exists. Please provide another email id.`),
                    errorTypeEnum.INPUT_VALIDATION_ERROR,
                    {
                        errors: [
                            {
                                value: existingShopEmailId.shopEmailId,
                                msg: `The shop email id ${existingShopEmailId.shopEmailId} already exists. Please try with another email id.`,
                                param: 'shopEmailId',
                                location: 'body',
                            },
                        ],
                    }
                );
            }
    
            // Proceed to save the shop details
            const savedShop = await objShopModel.addshop(request);
            return savedShop;
        } catch (error) {
            throw error;
        }
    }


        

    async getShopDetailsByNameZipCode(shopName: string, shopCityZipCode: string) {
        try {
            console.log('Validating existing shop from CShopService => getShopDetailsByNameZipCode()');

            return await objShopModel.getShopDetailsByNameZipCode(shopName, shopCityZipCode);
        } catch (error) {
            throw (new CCustomErrors(error, errorTypeEnum.DB_OPERATION_ERROR));
        }

    }

    async getShopDetailsByShopMobileNumber(shopMobileNumber: string) {
        try {
            console.log('Validating existing mobile number from CShopService => getShopDetailsByShopMobileNumber()');

            return await objShopModel.getShopDetailsByShopMobileNumber(shopMobileNumber);
        } catch (error) {
            throw (new CCustomErrors(error, errorTypeEnum.DB_OPERATION_ERROR));
        }

    }

    async getShopDetailsByShopEmailId(shopEmailId: string) {
        try {
            console.log('Validating existing email id from CShopService => getShopDetailsByShopEmailId()');

            return await objShopModel.getShopDetailsByShopEmailId(shopEmailId);
        } catch (error) {
            throw (new CCustomErrors(error, errorTypeEnum.DB_OPERATION_ERROR));
        }

    }

    async getAllShops(limit: number = 10, pageNumber: number = 1) {
        try {
            console.log('Validating existing email id from CShopService => getAllShops()');

            return await objShopModel.getAllShops(limit, pageNumber);
        } catch (error) {
            throw (new CCustomErrors(error, errorTypeEnum.DB_OPERATION_ERROR));
        }

    }


// Method to update all shop details
async updateShop(shopId: string, shopData: Partial<CShopEntities>) {
    const shopRepository: Repository<CShopEntities> = AppDataSource.getRepository(CShopEntities);

    const shopIdNumber = Number(shopId);
    if (isNaN(shopIdNumber)) {
        throw new Error('Invalid shop ID. Must be a valid number.');
    }

    // Find the existing shop
    const existingShop = await shopRepository.findOne({ where: { shopId: shopIdNumber } });

    if (!existingShop) {
        throw new Error('Shop not found');
    }

    // Update shop details
    Object.assign(existingShop, shopData);
    return await shopRepository.save(existingShop);
}


// Method to patch specific fields of shop
async patchShop(shopId: string, updatedFields: { shopMobileNumber?: string; shopEmailId?: string }) {
    const shopRepository = getRepository(CShopEntities);
    
    // Find the shop using an object
    // const existingShop = await shopRepository.findOne({ where: { id: shopId } }); 
    const shopIdNumber = Number(shopId); // Convert to number
    const existingShop = await shopRepository.findOne({ where: { shopId: shopIdNumber } });

    if (!existingShop) {
        throw new CCustomErrors(new Error('Shop not found'), errorTypeEnum.NOT_FOUND);
    }

    // Only update the mobile number and email 
    if (updatedFields.shopMobileNumber !== undefined) {
        existingShop.shopMobileNumber = updatedFields.shopMobileNumber;
    }
    if (updatedFields.shopEmailId !== undefined) {
        existingShop.shopEmailId = updatedFields.shopEmailId;
    }

    return await shopRepository.save(existingShop);
}

// Method to delete the shop (soft delete)
async deleteShop(shopId: string): Promise<boolean> {
    try {
        console.log('Deleting shop in CShopService => deleteShop()');
        
        const shopRepository = AppDataSource.getRepository(CShopEntities); // Ensure repository is fetched

        // Inject the initialized repository into the model
        const deletedShop = await objShopModel.deleteShop(shopId, shopRepository);

        return !!deletedShop; // Return true if the shop was successfully deleted
    } catch (error) {
        console.error('Error in CShopService => deleteShop():', error.message);
        throw error; // Re-throw the error to the controller for handling
    }

}
}























