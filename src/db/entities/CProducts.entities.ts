import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";

@Entity({ name: "products" })
export class CProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;

  @Column()
  quantity: number;

  @Column()
  stock: number;

  @Column()
  category: string;

  @Column()
  keywords: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_on: Date;

  @Column()
  created_by: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_on: Date;

  @Column()
  updated_by: number;

  @Column()
  shop_id: number; // Foreign key to shops table

  @Column()
  unit_id: number; // Foreign key to unit types table

  @Column()
  hsn_code: string; // Removed nullable: true

  @Column({ type: "date" })
  expiry_date: Date; // Removed nullable: true

  @Column({ type: "date" })
  mfg_date: Date; // Removed nullable: true

  @Column()
  tax_slab: string; // Removed nullable: true
    clothingDetails: any;
}

































































// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   ManyToOne,
//   JoinColumn,
//   OneToMany,
// } from "typeorm";
// import { CShopEntities } from "./CShop.entities";
// import { UnitTypeEntities } from "./UnitType.entities";
// import { CInvoiceProductEntity } from "./Invoice_Product.entities";

// @Entity({ name: "products" })
// export class CProductEntity {
//   [x: string]: any;
//   // Primary Key: Unique ID for each product
//   @PrimaryGeneratedColumn()
//   id: number;

//   // Product name
//   @Column()
//   name: string;

//   // Description of the product
//   @Column()
//   description: string;

//   // Price of the product
//   @Column({ type: "decimal", precision: 10, scale: 2 })
//   price: number;

//   // Available quantity in stock
//   @Column()
//   quantity: number;

//   // Total stock available
//   @Column()
//   stock: number;

//   // Product category (e.g., electronics, groceries, etc.)
//   @Column()
//   category: string;

//   // Keywords for searching or tagging the product
//   @Column()
//   keywords: string;

//   // Date when the product was created
//   @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
//   created_on: Date;

//   // User ID of the creator
//   @Column()
//   created_by: number;

//   // Date when the product was last updated
//   @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
//   updated_on: Date;

//   // User ID of the last updater
//   @Column()
//   updated_by: number;

//   // Harmonized System of Nomenclature (HSN) code
//   @Column({ nullable: true })
//   hsn_code: string;

//   // Expiry date of the product
//   @Column({ type: 'date', nullable: true })
//   expiry_date: Date;

//   // Manufacturing date of the product
//   @Column({ type: 'date', nullable: true })
//   mfg_date: Date;

//   // Tax slab applicable to the product
//   @Column({ nullable: true })
//   tax_slab: string;

//   // Relationship with Shop: Each product belongs to a shop
//   // @ManyToOne(() => CShopEntities, (shop) => shop.id)
//   // @JoinColumn({ name: "shop_id" })
//   // shop: CShopEntities;

//   @ManyToOne(() => CShopEntities, (shop) => shop.shopId)
//   @JoinColumn({ name: "shop_id", referencedColumnName: "shopId" })
//   shop: CShopEntities;
  


//   // Relationship with Unit Type: Each product has a unit of measurement
//   @ManyToOne(() => UnitTypeEntities, (unit) => unit.id)
//   @JoinColumn({ name: "unit_id" })
//   unit: UnitTypeEntities;

//   // Relationship with Invoice Products-Track sold or purchased products
//   @OneToMany(() => CInvoiceProductEntity, (invoiceProduct) => invoiceProduct.product)
//   invoiceProducts: CInvoiceProductEntity[];
// }




























