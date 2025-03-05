import AppDataSource from "../dataSource";
import bcrypt from "bcryptjs";
import { IUser, IUserCreateResp, IUserGetByEmailResp, IUserGetByIdResp } from "../../interfaces/User.interface";
import { UserEntities } from "../entities/User.entities";
import { CLoginEntities } from "../entities/CLogin.entities";
import { Repository } from "typeorm/repository/Repository";

// UserModel class to interact with the database
export class UserModel {
  private repository: Repository<UserEntities> = AppDataSource.getRepository(UserEntities);

  async findByEmail(email: string): Promise<UserEntities | undefined> {
    return await this.repository.findOne({ where: { email } });
  }

  async createUser(data: any): Promise<any> {
    try {
      const user = this.repository.create(data);
      const savedUser = await this.repository.save(user);
      return savedUser;
    } catch (error) {
      console.error("Error in Create User:", error.message);
      throw new Error("Database Error while Creating User");
    }
  }

  async getAllUsers() {
    return await this.repository.find();
  }

    
 

    // public async createUser(data: IUser): Promise<IUserCreateResp> {
    //     try {
    //         console.log('Jumped in UserModel => createUser()');

    //         const hashedPassword = await bcrypt.hash(data.password, 10);

    //         const user = this.repository.create({ ...data, password: hashedPassword });
    //         const savedUser = await this.repository.save(user);

    //         const { userId, name, email } = savedUser;

    //         // Return a response with userId, name, and email
    //         return { userId, name, email };

    //     } catch (error) {
    //         // Throw a custom error with a more descriptive message
    //         throw new Error(`Error creating user: ${error.message}`);
    //     }
    // }


    public async getByEmail(email: string): Promise<IUserGetByEmailResp | null> {
        try {
            console.log('Jumped in UserModel => getByEmail()');
            const user = await this.repository.findOne({
                select: {
                    userId: true,
                    username: true,
                    email: true
                },
                where: {
                    email: email
                }
            });
            return user || null;
        } catch (error) {
            throw new Error(error);
        }
    }
      

    // Method to get user details by ID
    public async getById(id: number): Promise<IUserGetByIdResp | null> {
        try {
            console.log('Jumped in UserModel => getById()');

            // Find the user by ID
            const user = await this.repository.findOne({
                select: {
                    userId: true,
                    username: true,
                    email: true
                },
                where: {
                    userId: id
                }
            });

            // Return user or null if not found
            return user || null;
        } catch (error) {
            throw new Error(error);
        }
    }

    

      static async filterUser(filters: { username?: string; email?: string; role?: string }) {
        const userRepository = AppDataSource.getRepository(CLoginEntities);
    
        const query = userRepository.createQueryBuilder('user');
    
        if (filters.username) {
          query.andWhere('user.username = :username', { username: filters.username });
        }
    
        if (filters.email) {
          query.andWhere('user.email = :email', { email: filters.email });
        }
    
        if (filters.role) {
          query.andWhere('user.role = :role', { role: filters.role });
        }
    
        // Execute the query and return the result
        const users = await query.getMany();
        return users.length ? users : null;
      }

      async patchUser(id: number, data: { email?: string; mobileNumber?: string }) {
        const userRepository = AppDataSource.getRepository(CLoginEntities);
        const user = await userRepository.findOne({ where: { loginId: id } });
        if (!user) {
            throw new Error("User not found");
        }
        if (data.email) user.email = data.email;
        if (data.mobileNumber) user.mobileNumber = data.mobileNumber;
        await userRepository.save(user);
        return user;
    }
    

    async deleteUserById(id: number) {
      console.log("➡️ [UserService] Delete User By ID API Called");
      console.log("🔍 Received ID:", id);
    
      const user = await this.repository.findOne({
        where: { userId: id }, // Directly Pass Number
      });
    
      if (!user) {
        console.log(" User Not Found");
        throw new Error("User not found");
      }
    
      console.log("User Found:", user);
    
      // Remove the user from the database
      await this.repository.remove(user);
      console.log(" User Deleted Successfully");
    
      return { message: "User deleted successfully" };
    }
    

  }




















