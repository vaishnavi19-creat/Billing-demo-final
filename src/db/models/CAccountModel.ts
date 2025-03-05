import { CAccountEntities } from "../entities/CAccount.entities"
import AppDataSource from "../dataSource";
import { DeepPartial, DeleteResult } from "typeorm";

export class CAccountModel {
  private repository = AppDataSource.getRepository(CAccountEntities);
    getSelectedAccount: any;

  // Add a new account
 
  public async addAccount(objNewAccount: Partial<CAccountEntities>): Promise<CAccountEntities> {
    try {
        console.log("Saving new account:", objNewAccount);
        const savedAccount = await this.repository.save(objNewAccount);
        console.log("Account saved:", savedAccount);
        return savedAccount;
    } catch (error) {
        console.error("Error saving account:", error.message);
        throw new Error("Database error while saving account.");
    }
}

  

  // Get all accounts with pagination
  public async getAllAccounts(limit: number, pageNumber: number): Promise<CAccountEntities[]> {
    const skip = (limit * pageNumber) - limit;
    return this.repository.find({ skip, take: limit });
  }

  
 // Get account by ID
 public async getAccountById(accountId: number): Promise<CAccountEntities | null> {
  return this.repository.findOne({ where: { accountId } });
}

// Update an account
public async updateAccountById(accountId: number, updatedData: DeepPartial<CAccountEntities>) {
  return this.repository.update(accountId, updatedData);
}

// Patch an account (partial update)
public async patchAccount(accountId: number, patchData: Partial<CAccountEntities>) {
  return this.repository.update(accountId, patchData);
}


// Delete an account permanently
public async deleteAccountById(accountId: number): Promise<DeleteResult> {
  return this.repository.delete(accountId);
}



  // Check if email or mobile number already exists
  public async getAccountByEmailOrMobile(email: string, mobile: string): Promise<CAccountEntities | null> {
    try {
      console.log("Checking existing account for Email:", email, "or Mobile:", mobile);
      return await this.repository.findOne({
        where: [{ customerEmailId: email }, { customerMobileNo: mobile }],
      });
    } catch (error) {
      console.error("Error in getAccountByEmailOrMobile:", error.message);
      throw new Error("Error checking account existence.");
    }
  }

  // Filter accounts
  public async filterAccounts(filters: any): Promise<CAccountEntities[]> {
    const query = this.repository.createQueryBuilder("account");

    if (filters.name) query.andWhere("account.customerName LIKE :name", { name: `%${filters.name}%` });
    if (filters.email) query.andWhere("account.customerEmailId = :email", { email: filters.email });
    if (filters.mobileNo) query.andWhere("account.customerMobileNo = :mobileNo", { mobileNo: filters.mobileNo });

    return query.getMany();
  }
}






























// import { CAccountEntities } from "../entities/CAccount.entities"
// import AppDataSource from "../dataSource";
// import { DeepPartial, DeleteResult } from "typeorm";

// export class CAccountModel {
//   private repository = AppDataSource.getRepository(CAccountEntities);
//     getSelectedAccount: any;

//   // Add a new account
//   public async addAccount(objNewAccount: Partial<CAccountEntities>): Promise<CAccountEntities> {
//     try {
//       console.log("Saving new account:", objNewAccount);
//       const savedAccount = await this.repository.save(objNewAccount);
//       console.log("Account saved:", savedAccount);
//       return savedAccount;
//     } catch (error) {
//       console.error("Error saving account:", error.message);
//       throw new Error("Database error while saving account.");
//     }
//   }

  

//   // Get all accounts with pagination
//   public async getAllAccounts(limit: number, pageNumber: number): Promise<CAccountEntities[]> {
//     const skip = (limit * pageNumber) - limit;
//     return this.repository.find({ skip, take: limit });
//   }

  
//  // Get account by ID
//  public async getAccountById(accountId: number): Promise<CAccountEntities | null> {
//   return this.repository.findOne({ where: { accountId } });
// }

// // Update an account
// public async updateAccountById(accountId: number, updatedData: DeepPartial<CAccountEntities>) {
//   return this.repository.update(accountId, updatedData);
// }

// // Patch an account (partial update)
// public async patchAccount(accountId: number, patchData: Partial<CAccountEntities>) {
//   return this.repository.update(accountId, patchData);
// }


// // Delete an account permanently
// public async deleteAccountById(accountId: number): Promise<DeleteResult> {
//   return this.repository.delete(accountId);
// }



//   // Check if email or mobile number already exists
//   public async getAccountByEmailOrMobile(email: string, mobile: string): Promise<CAccountEntities | null> {
//     try {
//       console.log("Checking existing account for Email:", email, "or Mobile:", mobile);
//       return await this.repository.findOne({
//         where: [{ customerEmailId: email }, { customerMobileNo: mobile }],
//       });
//     } catch (error) {
//       console.error("Error in getAccountByEmailOrMobile:", error.message);
//       throw new Error("Error checking account existence.");
//     }
//   }

//   // Filter accounts
//   public async filterAccounts(filters: any): Promise<CAccountEntities[]> {
//     const query = this.repository.createQueryBuilder("account");

//     if (filters.name) query.andWhere("account.customerName LIKE :name", { name: `%${filters.name}%` });
//     if (filters.email) query.andWhere("account.customerEmailId = :email", { email: filters.email });
//     if (filters.mobileNo) query.andWhere("account.customerMobileNo = :mobileNo", { mobileNo: filters.mobileNo });

//     return query.getMany();
//   }
// }
