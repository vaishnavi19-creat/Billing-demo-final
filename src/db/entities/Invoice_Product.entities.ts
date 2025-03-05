import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("invoice_product")
export class CInvoiceProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product_id: number; // Foreign key to products table

  @Column()
  invoice_id: number; // Foreign key to invoices table

  @Column()
  quantity: number; // Number of products sold or purchased

  @Column()
  unit: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price_per_unit: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  total_price: number; 

  @CreateDateColumn({ type: "timestamp" })
  created_on: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_on: Date;
}















































// import {
//     Entity,
//     PrimaryGeneratedColumn,
//     Column,
//     ManyToOne,
//     JoinColumn,
//     CreateDateColumn,
//     UpdateDateColumn,
//   } from "typeorm";
//   import { CProductEntity } from "./CProducts.entities"; // Product connection
//   import { InvoiceEntities } from "./Invoice.entities"; // Invoice connection (to be created later)
  
//   // @Entity({ name: "invoice_products" })
//   @Entity('invoice_product')
//   export class CInvoiceProductEntity {
//     @PrimaryGeneratedColumn()
//     id: number;
  
//     @ManyToOne(() => CProductEntity, (product) => product.id)
//     @JoinColumn({ name: "product_id" })
//     product: CProductEntity;
  
//     @ManyToOne(() => InvoiceEntities, (invoice) => invoice.id)
//     @JoinColumn({ name: "invoice_id" })
//     invoice: InvoiceEntities;
  
//     @Column()
//     quantity: number; // Number of products sold or purchased
  
//     @Column()
//     unit: string; // Unit of the product (e.g., kg, pcs)
  
//     @Column({ type: "decimal", precision: 10, scale: 2 })
//     price_per_unit: number; // Price of one unit
  
//     @Column({ type: "decimal", precision: 10, scale: 2 })
//     total_price: number; // Total price for the quantity
  
//     @CreateDateColumn({ type: "timestamp" })
//     created_on: Date;
  
//     @UpdateDateColumn({ type: "timestamp" })
//     updated_on: Date;
//   }
  