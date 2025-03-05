import {
    Column,
    PrimaryGeneratedColumn,
    Unique,
    Entity,
    Index,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { CBaseEntities } from "./CBase.entities";
import { CShopTypeEntities } from "./CShopType.entities";
import { CAccountEntities } from "./CAccount.entities";
import { CCustomerEntities } from "./CCustomer.entities";

@Entity({ name: "shops" })
@Unique(["shopMobileNumber"])
@Unique(["shopEmailId"])
export class CShopEntities extends CBaseEntities {
    @PrimaryGeneratedColumn({ name: "shop_id" })
    shopId: number;

    @Index()
    @Column({ name: "shop_name", type: "varchar", length: 100, nullable: false })
    shopName: string;

    @Column({ name: "shop_owner_name", type: "varchar", length: 100, nullable: false })
    shopOwnerName: string;

    @Column({ name: "shop_address", type: "varchar", length: 500, nullable: false })
    shopAddress: string;

    @Column({ name: "shop_country_id", type: "integer", nullable: false })
    shopCountryId: string;

    


    @Column({ name: "shop_state_id", type: "integer", nullable: false })
    shopStateId: string;

    @Column({ name: "shop_city", type: "varchar", length: 20, nullable: false })
    shopCity: string;

    @Column({ name: "shop_city_zip_code", type: "varchar", length: 6, nullable: false })
    shopCityZipCode: string;

    @Column({ name: "shop_mobile_number", type: "varchar", length: 10, nullable: false })
    shopMobileNumber: string;

    @Column({ name: "shop_email_id", type: "varchar", length: 50, nullable: false })
    shopEmailId: string;

    @Column({ name: "shop_gst_number", type: "varchar", length: 10, nullable: false })
    shopGSTNumber: string;

    @Column({ name: "shop_status", type: "boolean", default: true })
    shopStatus: boolean;

    @Column({ name: "shop_last_record", type: "text", default: null, nullable: true })
    shopLastRecord: string;

    @Column({ name: "shop_logo_url", type: "varchar", length: 200, nullable: true })
    shopLogoUrl: string;

    @Column({ name: "shop_type", type: "varchar", length: 50, nullable: false })
    shopType: string;

    @Column({ name: "shop_type_id", type: "int", nullable: true })
    shopTypeId?: number | null;
    
   
    // @Column({ name: "account_id", type: "int", nullable: false })
    // accountId: number;
 

    @ManyToOne(() => CShopTypeEntities, (shopType) => shopType.shops, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        nullable: true,
    })
    @JoinColumn({ name: "shop_type_id", referencedColumnName: "shopTypeId" })
    shopTypeStatic?: CShopTypeEntities;
    

    // @ManyToOne(() => CAccountEntities, (account) => account.shops, { nullable: false })
    // @JoinColumn({ name: "account_id" }) 
    // account: CAccountEntities;

    @ManyToOne(() => CAccountEntities, { nullable: true }) // Yeh nullable true kar diya
@JoinColumn({ name: 'account_id' })
accountId: CAccountEntities;



   



}






































// import { Column, PrimaryGeneratedColumn, Unique, Entity, Index, ManyToOne, JoinColumn } from "typeorm";
// import { CBaseEntities } from "./CBase.entities";
// import { CShopTypeEntities } from "./CShopType.entities";

// @Entity({ name: "shops" })
// @Unique(["shopMobileNumber"])
// @Unique(["shopEmailId"])
// export class CShopEntities extends CBaseEntities {
//     [x: string]: any;
//     @PrimaryGeneratedColumn({ name: "shop_id" })
//     shopId: number;

//     @Index()
//     @Column({ name: "shop_name", type: "varchar", length: 100, nullable: false })
//     shopName: string;

//     @Column({ name: "shop_owner_name", type: "varchar", length: 100, nullable: false })
//     shopOwnerName: string;

//     @Column({ name: "shop_address", type: "varchar", length: 500, nullable: false })
//     shopAddress: string;

//     @Column({ name: "shop_country_id", type: "integer", nullable: false })
//     shopCountryId: string;

//     @Column({ name: "shop_state_id", type: "integer", nullable: false })
//     shopStateId: string;

//     @Column({ name: "shop_city", type: "varchar", length: 20, nullable: false })
//     shopCity: string;

//     @Column({ name: "shop_city_zip_code", type: "varchar", length: 6, nullable: false })
//     shopCityZipCode: string;

//     @Column({ name: "shop_mobile_number", type: "varchar", length: 10, nullable: false })
//     shopMobileNumber: string;

//     @Column({ name: "shop_email_id", type: "varchar", length: 50, nullable: false })
//     shopEmailId: string;

//     @Column({ name: "shop_gst_number", type: "varchar", length: 10, nullable: false })
//     shopGSTNumber: string;

//     @Column({ name: "shop_status", type: "boolean", default: true })
//     shopStatus: boolean;

//     @Column({ name: "shop_last_record", type: "text", default: null, nullable: true })
//     shopLastRecord: string;

//     @Column({ name: "shop_logo_url", type: "varchar", length: 200, nullable: true })
//     shopLogoUrl: string;

//     // Shop Type (as a string, General, Medical, etc.)
//     @Column({ name: "shop_type", type: "varchar", length: 50, nullable: false })
//     shopType: string;

 
//     @Column({ name: "shop_type_id", type: "int", nullable: true })
//     shopTypeId?: number | null;


//     // Correcting the Relation
//     @ManyToOne(() => CShopTypeEntities, (shopType) => shopType.shops, {
//         onDelete: "CASCADE",
//         onUpdate: "CASCADE",
//         nullable: true
//     })
//     @JoinColumn({ name: "shop_type_id", referencedColumnName: "shopTypeId" })
//     shopTypeStatic?: CShopTypeEntities;
// }
















