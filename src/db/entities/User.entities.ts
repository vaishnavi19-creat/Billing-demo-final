import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { CBaseEntities } from "./CBase.entities";
import { CAccountEntities } from "./CAccount.entities";

export enum UserRole {
    ADMIN = 'admin',
    SHOP_OWNER = 'shop_owner',
}

@Entity('users')  // Maps to the 'users' table in the database
export class UserEntities extends CBaseEntities {
    @PrimaryGeneratedColumn()
    userId: number;

    // @Column({ type: 'varchar', length: 255 })
    // name: string;

  
    @Column()
    username: string;

    

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;
    

    @Column({ type: 'varchar', length: 255 })
    password: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.SHOP_OWNER })
    role: UserRole;
    vendors: any;

    @OneToOne(() => CAccountEntities, (account) => account.user)
    account: CAccountEntities;
}























