import { CCustomerEntities } from "../entities/CCustomer.entities";
import AppDataSource from "../dataSource";
import { SignUpResp, getAllCustomers, getCustomerDetailsByCustomerEmailIdResp, getCustomerDetailsByCustomerNameResp } from "../../interfaces/CCustomer.interface";
import { DeepPartial, DeleteResult } from "typeorm";
import { addshopReq, addshopResp } from "../../interfaces/CShop.interface";

export class CCustomerModel {
    [x: string]: any;

    constructor() {
        this.repository = AppDataSource.getRepository(CCustomerEntities);
        console.log("Repository initialized");
    }
    
    public async updateCustomerById(customerId: number, customerData: Partial<CCustomerEntities>): Promise<any> {
        console.log("Model - Updating customer with ID:", customerId, "Data:", customerData);
    
        const repository = AppDataSource.getRepository(CCustomerEntities);
    
        return repository
            .createQueryBuilder()
            .update(CCustomerEntities)
            .set(customerData as DeepPartial<CCustomerEntities>)  // Fix TypeORM type issue
            .where("customerId = :customerId", { customerId })
            .execute();
    }
    
    
    // Method to add a new customer
    public async addCustomer(objNewCustomer: any): Promise<any> {
        try {
            console.log('Jumped in CCustomerModel => addCustomer()');
            
            // Extract only the required fields
            const { customerName, customerAddress, customerMobileNo, customerEmailId } = objNewCustomer;
    
            // Create a new customer object with only the required fields
            const sanitizedCustomer = {
                customerName,
                customerAddress,
                customerMobileNo,
                customerEmailId
            };
    
            // Save the sanitized customer object
            const savedCustomer = await this.repository.save(sanitizedCustomer);
    
            // Return the saved customer object
            return {
                customerName: savedCustomer.customerName,
                customerAddress: savedCustomer.customerAddress,
                customerMobileNo: savedCustomer.customerMobileNo,
                customerEmailId: savedCustomer.customerEmailId
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }
    
    public async getCustomerByEmailOrMobile(email: string, mobile: string): Promise<CCustomerEntities | null> {
        try {
            console.log("Checking existing customer by Email or Mobile:", email, mobile);
            return await this.repository.findOne({
                where: [{ customerEmailId: email }, { customerMobileNo: mobile }],
            });
        } catch (error) {
            console.error("Error in getCustomerByEmailOrMobile:", error);
            throw new Error(error.message);
        }
    }


    // Method to get customer details by name
    public async getCustomerDetailsByName({ customerName }: { customerName: string }): Promise<getCustomerDetailsByCustomerNameResp> {
        try {
            console.log('Jumped in CCustomerModel => getCustomerDetailsByName()');
            return await this.repository.findOne({
                select: {
                    customerId: true,
                    customerName: true,
                    customerOwnerName: true
                },
                where: {
                    customerName: customerName,
                }
            });
        } catch (error) {
            throw new Error(error);
        }
    }

    // Method to get customer details by mobile number
    public async getCustomerDetailsByMobileNumber(customerMobileNo: string): Promise<getCustomerDetailsByCustomerNameResp> {
        try {
            console.log('Jumped in CCustomerModel => getCustomerDetailsByMobileNumber()');
            return await this.repository.findOne({
                select: {
                    customerId: true,
                    customerName: true,
                    customerOwnerName: true,
                    customerMobileNo: true
                },
                where: {
                    customerMobileNo: customerMobileNo
                }
            });
        } catch (error) {
            throw new Error(error);
        }
    }

    // Method to get customer details by email ID
    public async getCustomerDetailsByEmailId(customerEmailId: string): Promise<getCustomerDetailsByCustomerEmailIdResp> {
        try {
            console.log('Jumped in CCustomerModel => getCustomerDetailsByEmailId()');
            return await this.repository.findOne({
                select: {
                    customerId: true,
                    customerName: true,
                    customerOwnerName: true,
                    customerEmailId: true
                },
                where: {
                    customerEmailId: customerEmailId
                }
            });
        } catch (error) {
            throw new Error(error);
        }
    }

    // Method to get all customers with pagination
    public async getAllCustomers(limit: number = 10, pageNumber: number = 1): Promise<getAllCustomers[]> {
        try {
            console.log('Jumped in CCustomerModel => getAllCustomers()');
    
            //  Ensure repository is initialized
            // if (!this.repository) {
            //     console.error("Repository is not initialized. Re-initializing...");
            //     this.repository = AppDataSource.getRepository(CCustomerEntities);
            // }
    
            const skip = (limit * pageNumber) - limit;
    
            return await this.repository
                .createQueryBuilder('customer')
                .select([
                    'customer.customerId',
                    'customer.customerName',
                    'customer.customerOwnerName',
                    'customer.customerMobileNo',
                    'customer.customerEmailId',
                    'customer.customerGSTNo',
                    'customer.customerlogo'
                ])
                .skip(skip)
                .take(limit)
                .getMany();
        } catch (error) {
            console.error("Error in getAllCustomers:", error);
            throw new Error(error.message);
        }
    }
    
    // Method to get customer by ID
    public async getCustomerById(customerId: number): Promise<getCustomerDetailsByCustomerEmailIdResp | null> {
        try {
            console.log('Jumped in CCustomerModel => getCustomerById()');
            return await this.repository.findOne({
                select: {
                    customerId: true,
                    customerName: true,
                    customerOwnerName: true,
                    customerMobileNo: true,
                    customerEmailId: true
                },
                where: {
                    customerId: customerId,
                }
            });
        } catch (error) {
            throw new Error(error);
        }
    }

    // Method for soft delete customer (update customerStatus to false)
    public async softDeleteCustomer(customerId: number): Promise<DeleteResult> {
        try {
            console.log('Jumped in CCustomerModel => softDeleteCustomer()');
            return await this.repository.update(customerId, { customerStatus: false });
        } catch (error) {
            throw new Error(error);
        }
    }

    // Method to update customer by ID
    public async putCustomer({ customerId, updatedData }: { customerId: number; updatedData: Partial<SignUpResp>; }): Promise<SignUpResp | null> {
        try {
            console.log('Jumped in CCustomerModel => putCustomer()');
            const customer = await this.repository.findOne({ where: { customerId } });
            if (!customer) {
                return null; // Return null if the customer doesn't exist
            }
            Object.assign(customer, updatedData); // Update the customer with new data
            await this.repository.save(customer); // Save the updated customer
            return customer; // Return the updated customer
        } catch (error) {
            throw new Error(error);
        }
    }

    // New Method to remove the signUp() method as it is no longer needed
    static signUp(customerData: addshopReq): addshopResp | PromiseLike<addshopResp> {
        throw new Error("Method not implemented.");
    }

 // Method to filter customers based on a filter criteria
 public async filterCustomers(filters: any): Promise<any[]> {
    try {
        const queryBuilder = this.repository.createQueryBuilder("customer");

        // Add filters dynamically
        if (filters.name) {
            queryBuilder.andWhere("customer.customerName LIKE :name", { name: `%${filters.name}%` });
        }
        if (filters.mobileNo) {
            queryBuilder.andWhere("customer.customerMobileNo = :mobileNo", { mobileNo: filters.mobileNo });
        }
        if (filters.email) {
            queryBuilder.andWhere("customer.customerEmailId LIKE :email", { email: `%${filters.email}%` });
        }
        if (filters.address) {
            queryBuilder.andWhere("customer.customerAddress LIKE :address", { address: `%${filters.address}%` });
        }

        // Execute query and return results
        return await queryBuilder.getMany();
    } catch (error) {
        throw new Error(error.message);
    }
}


public async deleteCustomer(customerId: number): Promise<DeleteResult> {
    try {
        console.log('Jumped in CCustomerModel => deleteCustomer()');
        return await this.repository.delete(customerId); // Deletes the customer record
    } catch (error) {
        console.error('Error in deleteCustomer:', error);
        throw new Error('Error in deleteCustomer: ' + error.message);
    }
}

}






























