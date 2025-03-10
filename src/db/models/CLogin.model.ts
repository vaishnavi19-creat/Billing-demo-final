import { CLoginEntities } from "../entities/CLogin.entities";
import AppDataSource from "../dataSource";
import { LoginReq, getAllLoginsResp } from "../../interfaces/CLogin.interface";
import jwt from 'jsonwebtoken';
import { UserEntities } from "../entities/User.entities";

export class CLoginModel {
    getUserDetailsByUsernamePassword(username: string, password: string) {
        throw new Error("Method not implemented.");
    }
    protected repository;
    sessions: any;

    constructor() {
        this.repository = AppDataSource.getRepository(CLoginEntities);
    }

    public async getUserDetails(identifier: string, password: string): Promise<any> { 
        try {
            console.log("Fetching user by username or email in CLoginModel");
            console.log("Identifier (Username/Email):", identifier);
            console.log("Password:", password);
    
            const user = await this.repository
                .createQueryBuilder("users")
                .where("users.username = :identifier", { identifier })
                .orWhere("users.email = :identifier", { identifier })
                .andWhere("users.password = :password", { password })
                .printSql()  // Log the SQL query for debugging
                .getOne();
    
            console.log("Generated SQL Query: ", user);
    
            if (user) {
                console.log("User Found in DB:", user);
                return user;
            }
    
            console.log("User not found");
            return null;
        } catch (error) {
            console.log("Error in getUserDetails():", error);
            throw error;
        }
    }
    
    

    
    
    generateToken(userId: string): string {
        console.log("Generating JWT Token");
        return jwt.sign({ userId }, "your_secret_key", { expiresIn: "1h" });
    }





    // Method for checking if the user session is valid
    public async checkSessionValidity(userId: string): Promise<boolean> {
        try {
            console.log('Checking session validity for userId:', userId);
            // Check if the session exists
            const session = this.sessions.get(userId);

            if (session) {
                // Check if the session has expired
                const isExpired = session.expiresAt <= new Date();
                if (isExpired) {
                    console.log('Session has expired for userId:', userId);
                    this.sessions.delete(userId); // Remove expired session
                    return false; // Session is expired
                }

                console.log('Session is valid for userId:', userId);
                return true; // Session is valid
            } else {
                console.log('No session found for userId:', userId);
                return false; // No session found means invalid
            }
        } catch (error) {
            console.error('Error checking session validity:', error);
            throw new Error('Error checking session validity');
        }
    }

    // Method for invalidating a user session
    public async invalidateSession(userId: string): Promise<boolean> {
        try {
            console.log('Invalidating session for userId:', userId);
            // Check if the session exists
            const sessionExists = this.sessions.has(userId);

            if (sessionExists) {
                this.sessions.delete(userId); // Remove the session
                console.log('Session invalidated for userId:', userId);
                return true; // Successfully invalidated
            } else {
                console.log('No session found to invalidate for userId:', userId);
                return false; // No session found means nothing to invalidate
            }
        } catch (error) {
            console.error('Error invalidating session:', error);
            throw new Error('Error invalidating session');
        }
    }


    // Method to get all login details based on userId and password
    public async getAllLogins(userId: string, password: string): Promise<getAllLoginsResp[]> {
        try {
            console.log('Jumped in CLoginModel => getAllLogins()');
            return await this.repository.find({
                select: {
                    loginId: true,
                    userId: true,
                    username: true,
                    loginTime: true,
                    logoutTime: true,
                },
                where: {
                    userId: userId,
                    password: password
                }
            });
        } catch (error) {
            throw new Error(error);
        }
    }
}










































// import { CLoginEntities } from "../entities/CLogin.entities";
// import AppDataSource from "../dataSource";
// import { LoginReq, getAllLoginsResp } from "../../interfaces/CLogin.interface";
// import jwt from 'jsonwebtoken';

// export class CLoginModel {
//     protected repository;
//     sessions: any;

//     constructor() {
//         this.repository = AppDataSource.getRepository(CLoginEntities);
//     }

//     // Method for checking if the user session is valid
//     async checkSessionValidity(userId: string): Promise<boolean> {
//         try {
//             console.log('Checking session validity for userId:', userId);
//             // Check if the session exists
//             const session = this.sessions.get(userId);

//             if (session) {
//                 // Check if the session has expired
//                 const isExpired = session.expiresAt <= new Date();
//                 if (isExpired) {
//                     console.log('Session has expired for userId:', userId);
//                     this.sessions.delete(userId); // Remove expired session
//                     return false; // Session is expired
//                 }

//                 console.log('Session is valid for userId:', userId);
//                 return true; // Session is valid
//             } else {
//                 console.log('No session found for userId:', userId);
//                 return false; // No session found means invalid
//             }
//         } catch (error) {
//             console.error('Error checking session validity:', error);
//             throw new Error('Error checking session validity');
//         }
//     }

//     // Method for invalidating a user session
//     async invalidateSession(userId: string): Promise<boolean> {
//         try {
//             console.log('Invalidating session for userId:', userId);
//             // Check if the session exists
//             const sessionExists = this.sessions.has(userId);

//             if (sessionExists) {
//                 this.sessions.delete(userId); // Remove the session
//                 console.log('Session invalidated for userId:', userId);
//                 return true; // Successfully invalidated
//             } else {
//                 console.log('No session found to invalidate for userId:', userId);
//                 return false; // No session found means nothing to invalidate
//             }
//         } catch (error) {
//             console.error('Error invalidating session:', error);
//             throw new Error('Error invalidating session');
//         }
//     }
    
//     // Method for retrieving user details by username and password
//     public async getUserDetailsByUsernamePassword(username: string, password: string): Promise<CLoginEntities | null> {
//         try {
//             console.log('Jumped in CLoginModel => getUserDetailsByUsernamePassword()');
//             return await this.repository.findOne({
//                 where: {
//                     username: username,
//                     password: password
//                 }
//             });
//         } catch (error) {
//             throw new Error(error);
//         }
//     }

    
//     // Method for generating a JWT token 
//     public async generateToken(userId: string): Promise<string> {
//         try {
//             console.log('Jumped in CLoginModel => generateToken()');

//             // Define the payload to include user information
//             const payload = {
//                 userId: userId,
//             };

//             // Sign the JWT with a secret key and an expiration time (e.g., 1 hour)
//             const token = jwt.sign(payload, 'your_secret_key', { expiresIn: '1h' });

//             return token;
//         } catch (error) {
//             throw new Error(error);
//         }
//     }


//     // Method to get all login details based on userId and password
//     public async getAllLogins(userId: string, password: string): Promise<getAllLoginsResp[]> {
//         try {
//             console.log('Jumped in CLoginModel => getAllLogins()');
//             return await this.repository.find({
//                 select: {
//                     loginId: true,
//                     userId: true,
//                     username: true,
//                     loginTime: true,
//                     logoutTime: true,
//                 },
//                 where: {
//                     userId: userId,
//                     password: password
//                 }
//             });
//         } catch (error) {
//             throw new Error(error);
//         }
//     }
// }

































