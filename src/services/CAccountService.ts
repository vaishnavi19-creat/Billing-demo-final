import { CAccountModel } from "../db/models/CAccountModel";
import { DeleteResult } from "typeorm";
import { UserModel } from "../db/models/User.model";
import * as bcrypt from "bcrypt";



const objAccountModel = new CAccountModel();

export class CAccountService {
  UserModel: any;
 
  constructor() {
    this.UserModel = new UserModel(); // Yaha Pe Initialize Karo
  }

  async addAccount(accountData: any, req: any) {
    try {
        console.log("Received Account Data in Service:", accountData);

        // Check for Required Fields
        if (!accountData.customerName || !accountData.customerEmailId || !accountData.customerMobileNo) {
            throw new Error("Missing required fields: Name, Email, or Mobile Number.");
        }

        // Check If Email or Mobile Already Exists
        const existingAccount = await objAccountModel.getAccountByEmailOrMobile(
            accountData.customerEmailId,
            accountData.customerMobileNo
        );
        if (existingAccount) {
            throw new Error("Account with this Email or Mobile Number already exists.");
        }

        // Automatic CreatedBy & UpdatedBy Set Karo
        accountData.createdBy = req["userId"] || 1;
        accountData.updatedBy = req["userId"] || 1;

        // Step 1: Save Account First
        const savedAccount = await objAccountModel.addAccount(accountData);
        console.log("Account Saved Successfully:", savedAccount);

        //Automatically Register User
        const randomPassword = Math.random().toString(36).slice(-8); // Random Password
        // const hashPassword = await bcrypt.hash(randomPassword, 10); // Password Hashing

        const userData = {
            username: accountData.customerName,
            email: accountData.customerEmailId,
            password: randomPassword, 
            createdBy: req["userId"] || 1,
            updatedBy: req["userId"] || 1,
        };

        const registeredUser = await this.UserModel.createUser(userData);
        console.log("User Registered Automatically:", registeredUser);

        // Add User Data in Final Response
        savedAccount["user"] = registeredUser;

        return savedAccount;
    } catch (error) {
        console.error("Error in addAccount Service:", error.message);
        throw new Error(error.message);
    }
}


  async getAllAccounts(limit: number, pageNumber: number) {
    return await objAccountModel.getAllAccounts(limit, pageNumber);
  }

  async getAccountById(accountId: number) {
    const account = await objAccountModel.getAccountById(accountId);
    if (!account) throw new Error("Account not found");
    return { status: 200, message: "Success", data: account };
  }

  async updateAccount(accountId: number, updatedData: any) {
    const updatedAccount = await objAccountModel.updateAccountById(accountId, updatedData);
    return { status: 200, message: "Account updated successfully", data: updatedAccount };
  }

  async patchAccount(accountId: number, patchData: Partial<any>) {
    const patchedAccount = await objAccountModel.patchAccount(accountId, patchData);
    return { status: 200, message: "Account patched successfully", data: patchedAccount };
  }

  async deleteAccountById(accountId: number): Promise<{ status: number; message: string }> {
    await objAccountModel.deleteAccountById(accountId);
    return { status: 200, message: "Account deleted successfully" };
  }

  async filterAccounts(filters: any) {
    const accounts = await objAccountModel.filterAccounts(filters);
    return { status: 200, message: "Success", data: accounts };
  }

}


































// import { CAccountModel } from "../db/models/CAccountModel";
// import { DeleteResult } from "typeorm";
// import { UserModel } from "../db/models/User.model";


// const objAccountModel = new CAccountModel();

// export class CAccountService {


//   async addAccount(accountData: any) {
//     try {
//       console.log("Received Account Data in Service:", accountData); // Debugging log

//       // Ensure required fields are present
//       if (!accountData.customerName || !accountData.customerEmailId || !accountData.customerMobileNo) {
//         throw new Error("Missing required fields: Name, Email, or Mobile Number.");
//       }

//       // Check if email or mobile number already exists
//       const existingAccount = await objAccountModel.getAccountByEmailOrMobile(
//         accountData.customerEmailId,
//         accountData.customerMobileNo
//       );

//       if (existingAccount) {
//         throw new Error("Account with this Email or Mobile Number already exists.");
//       }

//       // Save the new account
//       const savedAccount = await objAccountModel.addAccount(accountData);
//       console.log("Account Saved Successfully:", savedAccount);

//       return savedAccount;
//     } catch (error) {
//       console.error("Error in addAccount Service:", error.message);
//       throw new Error(error.message);
//     }
//   }

//   async getAllAccounts(limit: number, pageNumber: number) {
//     return await objAccountModel.getAllAccounts(limit, pageNumber);
//   }

//   async getAccountById(accountId: number) {
//     const account = await objAccountModel.getAccountById(accountId);
//     if (!account) throw new Error("Account not found");
//     return { status: 200, message: "Success", data: account };
//   }

//   async updateAccount(accountId: number, updatedData: any) {
//     const updatedAccount = await objAccountModel.updateAccountById(accountId, updatedData);
//     return { status: 200, message: "Account updated successfully", data: updatedAccount };
//   }

//   async patchAccount(accountId: number, patchData: Partial<any>) {
//     const patchedAccount = await objAccountModel.patchAccount(accountId, patchData);
//     return { status: 200, message: "Account patched successfully", data: patchedAccount };
//   }

//   async deleteAccountById(accountId: number): Promise<{ status: number; message: string }> {
//     await objAccountModel.deleteAccountById(accountId);
//     return { status: 200, message: "Account deleted successfully" };
//   }

//   async filterAccounts(filters: any) {
//     const accounts = await objAccountModel.filterAccounts(filters);
//     return { status: 200, message: "Success", data: accounts };
//   }

// }
