
import { CShopEntities } from "../entities/CShop.entities";
import AppDataSource from "../dataSource";
import { addshopReq, addshopResp, getAllShops, getShopDetailsByNameZipCodeResp, getShopDetailsByShopEmailIdResp, getShopDetailsByShopMobileNumberResp } from "../../interfaces/CShop.interface";
import { CCustomErrors } from "../../helpers/CCustomErrors.helper";
import { errorTypeEnum } from "../../enums/errorType.enum";
import { Repository } from "typeorm";
import { CAccountModel } from "./CAccountModel";
import { CAccountEntities } from "../entities/CAccount.entities";

const objAccountModel = new CAccountModel();

export class CShopModel {
    repository: any;
    

    constructor() {
        this.repository = AppDataSource.getRepository(CShopEntities);
    }



    
public async addshop(objNewShop: any) {
    try {
        console.log('Jumped in CShopModel => addshop()');
        console.log('Received objNewShop:', objNewShop);  // Log the object received at the start

        // Validate shopCityZipCode (Must be a 6-character string)
        const zipCode = objNewShop.shopCityZipCode;
        console.log('shopCityZipCode:', zipCode);
        if (!zipCode || typeof zipCode !== 'string' || zipCode.length !== 6) {
            throw new Error('Invalid shopCityZipCode provided. It should be a 6-character string.');
        }

        // Validate required fields
        const requiredFields = [
            'shopName',
            'shopType',
            'shopOwnerName',
            'shopEmailId',
            'shopMobileNumber',
            'packageType',
            'shopCity',
        ];

       
       
        // objNewShop.shopTypeId = objNewShop.shopTypeId ? Number(objNewShop.shopTypeId) : null;
        objNewShop.shopTypeId = objNewShop.shopTypeId ? Number(objNewShop.shopTypeId) : undefined;


        // Ensure `packageType` is a valid value
        if (typeof objNewShop.packageType !== 'string' || objNewShop.packageType.trim() === '') {
            objNewShop.packageType = 'basic'; // Default to 'basic' if packageType is missing
        }

        // Log validated data
        console.log('Validated objNewShop:', objNewShop);

        // Proceed with saving the shop
        const savedShop = await this.repository.save(objNewShop);
        console.log('Saved shop:', savedShop);

        return savedShop; // Return the saved shop object
    } catch (error) {
        console.error('Error in CShopModel => addshop():', error.message);
        throw error;
    }
}



    public async getShopDetailsByNameZipCode(shopName: string, shopCityZipCode: string): Promise<getShopDetailsByNameZipCodeResp> {
        try{
            console.log('Jumped in CShopModel => getShopDetailsByNameZipCode()');

            return await this.repository.findOne({
                select: {
                    shopId: true,
                    shopName: true,
                    shopOwnerName: true
                },
                where: {
                    shopName: shopName,
                    shopCityZipCode: shopCityZipCode
                }
            });

        } catch(error) {
            throw new Error( error );
        }
    }

    public async getShopDetailsByShopMobileNumber(shopMobileNumber: string): Promise<getShopDetailsByShopMobileNumberResp> {
        try{
            console.log('Jumped in CShopModel => getShopDetailsByShopMobileNumber()');

            return await this.repository.findOne({
                select: {
                    shopId: true,
                    shopName: true,
                    shopOwnerName: true,
                    shopMobileNumber: true
                },
                where: {
                    shopMobileNumber: shopMobileNumber,
                }
            });

        } catch(error) {
            throw new Error( error );
        }
    }

    public async getShopDetailsByShopEmailId(shopEmailId: string): Promise<getShopDetailsByShopEmailIdResp> {
        try{
            console.log('Jumped in CShopModel => getShopDetailsByShopEmailId()');

            return await this.repository.findOne({
                select: {
                    shopId: true,
                    shopName: true,
                    shopOwnerName: true,
                    shopEmailId: true
                },
                where: {
                    shopEmailId: shopEmailId,
                }
            });

        } catch(error) {
            throw new Error( error );
        }
    }

    public async getAllShops(limit: number = 10, pageNumber: number = 1): Promise<getAllShops[]> {
        try{
            console.log('Jumped in CShopModel => getAllShops()');
            const skip = (limit * pageNumber) - limit;

            return await this.repository
            .createQueryBuilder('shop')
            .leftJoinAndSelect('shop.shopTypeStatic', 'shopType')
            .select(['shop.shopId', 'shop.shopName', 'shop.shopOwnerName', 'shop.shopMobileNumber', 'shop.shopEmailId', 'shop.shopGSTNumber', 'shop.shopCityZipCode', 'shopType.shopTypeShortDescription'])
            .skip(skip)
            .take(limit)
            .getMany();


        } catch(error) {
            throw new Error( error );
        }
    }

 


    public async deleteShop(shopId: string, shopRepository: Repository<CShopEntities>): Promise<CShopEntities> {
        try {
            console.log('Deleting shop in CShopModel => deleteShop()');
    
            // Convert shopId to a number
            const shopIdNumber = parseInt(shopId, 10);
    
            // Check if the conversion was successful
            if (isNaN(shopIdNumber)) {
                throw new Error('Invalid shop ID');
            }
    
            // Querying by 'shopId' as a number
            const existingShop = await shopRepository.findOne({
                where: { shopId: shopIdNumber }, // Use 'shopId' as a number
            });
    
            if (!existingShop) {
                throw new CCustomErrors(
                    new Error('Shop not found'),
                    errorTypeEnum.NOT_FOUND
                );
            }
    
            existingShop.shopStatus = false; // Soft delete the shop by setting status to false
            return await shopRepository.save(existingShop); // Save the changes
        } catch (error) {
            console.error('Error in CShopModel => deleteShop():', error.message);
            throw new CCustomErrors(error, errorTypeEnum.DB_OPERATION_ERROR);
        }
    }

    
    async updateShopById(shopId: number, shopData: Partial<CShopEntities>): Promise<CShopEntities | null> {
        const shop = await this.repository.findOne({ where: { shopId } });

        if (!shop) return null;

        Object.assign(shop, shopData);
        return await this.repository.save(shop);
    }

    }




























