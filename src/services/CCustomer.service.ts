import AppDataSource from "../db/dataSource";
import { CCustomerModel } from "../db/models/CCustomer.model";
import { DeleteResult } from "typeorm";

const objCustomerModel = new CCustomerModel();

export class CCustomerService {
  async addCustomer(customerData: any) {
    try {
        console.log(" Received Customer Data:", customerData); // Debugging log

        // Map frontend fields to backend expected fields
        const mappedCustomerData = {
            customerName: customerData.Name, 
            customerMobileNo: customerData.MobileNo,
            customerEmailId: customerData.Email,
            customerAddress: customerData.Address
        };

        console.log(" Mapped Customer Data:", mappedCustomerData); // Debugging log

        // Validate required fields
        if (!mappedCustomerData.customerName || 
            !mappedCustomerData.customerEmailId || 
            !mappedCustomerData.customerMobileNo || 
            !mappedCustomerData.customerAddress) {
            throw new Error("Missing required customer details.");
        }

        // Business logic: Ensure email and mobile number are unique
        const existingCustomer = await objCustomerModel.getCustomerByEmailOrMobile(
            mappedCustomerData.customerEmailId,
            mappedCustomerData.customerMobileNo
        );

        if (existingCustomer) {
            throw new Error("A customer with the same email or mobile number already exists.");
        }

        // Save the customer
        return await objCustomerModel.addCustomer(mappedCustomerData);
    } catch (error) {
        console.error(" Error in addCustomer:", error.message);
        throw new Error(error.message);
    }
}


  // async getAllCustomer(limit: number = 10, pageNumber: number = 1) {
  //   try {
  //     // Validate inputs
  //     if (limit <= 0 || pageNumber <= 0) {
  //       throw new Error("Limit and page number must be greater than 0.");
  //     }

  //     // Fetch customers with pagination
  //     return await objCustomerModel.getAllCustomers(limit, pageNumber);
  //   } catch (error) {
  //     throw new Error(error.message);
  //   }
  // }




async getAllCustomer(limit: number = 10, pageNumber: number = 1) {
    try {
        console.log("Service - Fetching customers with limit:", limit, "and page:", pageNumber);

        // ✅ Ensure database connection is initialized before calling model
        if (!AppDataSource.isInitialized) {
            console.error("Database connection is not initialized. Attempting to reconnect...");
            
            try {
                await AppDataSource.initialize();
                console.log("Database successfully reconnected.");
            } catch (err) {
                console.error("Error initializing database:", err);
                throw new Error("Database connection failed. Please restart the server.");
            }
        }

        // ✅ Validate inputs
        if (limit <= 0 || pageNumber <= 0) {
            throw new Error("Limit and page number must be greater than 0.");
        }

        // ✅ Fetch customers with pagination
        const customers = await objCustomerModel.getAllCustomers(limit, pageNumber);

        if (!customers.length) {
            console.warn("No customers found.");
        }

        return customers;
    } catch (error) {
        console.error("Error in getAllCustomer service:", error.message);
        throw new Error(error.message);
    }
}


  async getCustomerById(customerId: number) {
    try {
        if (!customerId || customerId <= 0) {
            throw new Error("Invalid customer ID.");
        }

        const customer = await objCustomerModel.getCustomerById(customerId);
        if (!customer) {
            return null; // Return null if no customer is found
        }

        return customer; // Return the customer if found
    } catch (error) {
        console.error("Error in getCustomerById:", error.message);
        throw new Error("Failed to fetch customer.");
    }
}


  async softDeleteCustomer(customerId: number): Promise<DeleteResult> {
    try {
      // Validate input
      if (!customerId || customerId <= 0) {
        throw new Error("Invalid customer ID.");
      }

      // Perform soft delete
      const result = await objCustomerModel.softDeleteCustomer(customerId);
      if (!result.affected) {
        throw new Error("Customer not found or already deleted.");
      }

      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateCustomerById(customerId: number, customerData: Partial<any>): Promise<any> {
    try {
      // Validate input
      if (!customerId || customerId <= 0) {
        throw new Error("Invalid customer ID.");
      }
      if (!Object.keys(customerData).length) {
        throw new Error("No data provided for update.");
      }

      // Update customer
      const updatedCustomer = await objCustomerModel.updateCustomerById(customerId, customerData);
      if (!updatedCustomer) {
        throw new Error("Customer not found or update failed.");
      }

      return updatedCustomer;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteCustomer(customerId: number): Promise<DeleteResult> {
    try {
      // Validate input
      if (!customerId || customerId <= 0) {
        throw new Error("Invalid customer ID.");
      }

      // Perform hard delete
      const result = await objCustomerModel.deleteCustomer(customerId);
      if (!result.affected) {
        throw new Error("Customer not found or already deleted.");
      }

      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async filterCustomers(filters: any): Promise<any[]> {
            try {
                const sanitizedFilters: any = {};
        
                if (filters.name) {
                    sanitizedFilters.name = filters.name.trim();
                }
                if (filters.mobileNo) {
                    sanitizedFilters.mobileNo = filters.mobileNo.trim();
                }
                if (filters.email) {
                    sanitizedFilters.email = filters.email.trim();
                }
                if (filters.address) {
                    sanitizedFilters.address = filters.address.trim();
                }
        
                return await objCustomerModel.filterCustomers(sanitizedFilters);
            } catch (error) {
                throw new Error(error.message);
            }
        }
}























