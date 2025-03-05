import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { CAccountService } from "../services/CAccountService";
import { errorTypeEnum } from "../enums/errorType.enum";

const objAccountService = new CAccountService();

export class CAccountController {

  static async addAccount(req: Request, res: Response, next: NextFunction) {
    try {
        console.log("Received Account Data in Controller:", req.body);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error("Validation Error:", errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        // Yaha Pe req Bhi Pass Karo
        const newAccount = await objAccountService.addAccount(req.body, req);

        if (newAccount) {
            return res.status(201).json({
                status: 201,
                message: "Account Added Successfully With Automatic User Registration ",
                data: newAccount,
            });
        } else {
            return res.status(400).json({
                message: "Unable to save account, please try again.",
            });
        }
    } catch (error) {
        console.error("Error in addAccount Controller:", error.message);
        return next(error);
    }
}

  static async getAllAccounts(req: Request, res: Response, next: NextFunction) {
    try {
      const { limit = 10, pageNumber = 1 } = req.query;
      console.log("Fetching all accounts with limit:", limit, "page:", pageNumber);
      const accounts = await objAccountService.getAllAccounts(Number(limit), Number(pageNumber));

      return res.status(200).json({
        status: 200,
        message: "Success",
        data: accounts.length > 0 ? accounts : [],
      });
    } catch (error) {
      console.error("Error in getAllAccounts Controller:", error.message);
      return next(error);
    }
  }


  static async getAccountById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await objAccountService.getAccountById(Number(id));
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }

  static async updateAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await objAccountService.updateAccount(Number(id), req.body);
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }

  static async patchAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await objAccountService.patchAccount(Number(id), req.body);
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }

  static async deleteAccountById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await objAccountService.deleteAccountById(Number(id));
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }

  static async filterAccounts(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("Received filter parameters:", req.query);

      // Validate request query parameters
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Call service to filter accounts
      const result = await objAccountService.filterAccounts(req.query);
      const accounts = result.data; // Extract the array from response

      return res.status(200).json({
        status: 200,
        message: accounts.length > 0 ? "Filtered accounts retrieved successfully" : "No accounts found",
        data: accounts,
      });
    } catch (error) {
      console.error("Error in filterAccounts Controller:", error.message);
      return next(error);
    }
  }
  
}

































// import { Request, Response, NextFunction } from "express";
// import { validationResult } from "express-validator";
// import { CAccountService } from "../services/CAccountService";
// import { errorTypeEnum } from "../enums/errorType.enum";

// const objAccountService = new CAccountService();

// export class CAccountController {
//   static async addAccount(req: Request, res: Response, next: NextFunction) {
//     try {
//       console.log("Received Account Data in Controller:", req.body); // Debugging log

//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         console.error("Validation Error:", errors.array());
//         return res.status(400).json({ errors: errors.array() });
//       }

//       const newAccount = await objAccountService.addAccount(req.body);

//       if (newAccount) {
//         return res.status(201).json({
//           status: 201,
//           message: "Account added successfully",
//           data: newAccount,
//         });
//       } else {
//         return res.status(400).json({
//           message: "Unable to save account, please try again.",
//         });
//       }
//     } catch (error) {
//       console.error("Error in addAccount Controller:", error.message);
//       return next(error);
//     }
//   }

//   static async getAllAccounts(req: Request, res: Response, next: NextFunction) {
//     try {
//       const { limit = 10, pageNumber = 1 } = req.query;
//       console.log("Fetching all accounts with limit:", limit, "page:", pageNumber);
//       const accounts = await objAccountService.getAllAccounts(Number(limit), Number(pageNumber));

//       return res.status(200).json({
//         status: 200,
//         message: "Success",
//         data: accounts.length > 0 ? accounts : [],
//       });
//     } catch (error) {
//       console.error("Error in getAllAccounts Controller:", error.message);
//       return next(error);
//     }
//   }


//   static async getAccountById(req: Request, res: Response, next: NextFunction) {
//     try {
//       const { id } = req.params;
//       const result = await objAccountService.getAccountById(Number(id));
//       return res.status(200).json(result);
//     } catch (error) {
//       return next(error);
//     }
//   }

//   static async updateAccount(req: Request, res: Response, next: NextFunction) {
//     try {
//       const { id } = req.params;
//       const result = await objAccountService.updateAccount(Number(id), req.body);
//       return res.status(200).json(result);
//     } catch (error) {
//       return next(error);
//     }
//   }

//   static async patchAccount(req: Request, res: Response, next: NextFunction) {
//     try {
//       const { id } = req.params;
//       const result = await objAccountService.patchAccount(Number(id), req.body);
//       return res.status(200).json(result);
//     } catch (error) {
//       return next(error);
//     }
//   }

//   static async deleteAccountById(req: Request, res: Response, next: NextFunction) {
//     try {
//       const { id } = req.params;
//       const result = await objAccountService.deleteAccountById(Number(id));
//       return res.status(200).json(result);
//     } catch (error) {
//       return next(error);
//     }
//   }

//   static async filterAccounts(req: Request, res: Response, next: NextFunction) {
//     try {
//       console.log("Received filter parameters:", req.query);

//       // Validate request query parameters
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//       }

//       // Call service to filter accounts
//       const result = await objAccountService.filterAccounts(req.query);
//       const accounts = result.data; // Extract the array from response

//       return res.status(200).json({
//         status: 200,
//         message: accounts.length > 0 ? "Filtered accounts retrieved successfully" : "No accounts found",
//         data: accounts,
//       });
//     } catch (error) {
//       console.error("Error in filterAccounts Controller:", error.message);
//       return next(error);
//     }
//   }
  
// }
