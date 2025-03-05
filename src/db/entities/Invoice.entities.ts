import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";

@Entity("invoices")
export class InvoiceEntities {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  invoiceNumber: string;

  @Column("decimal", { precision: 10, scale: 2 })
  amount: number;

  @Column()
  paymentMode: string;

  @CreateDateColumn()
  invoiceDate: Date;

  @Column("decimal", { precision: 5, scale: 2 })
  discount: number; // Removed nullable: true to ensure a value is always set

  @Column({ type: "enum", enum: ["Direct", "Percentage"] })
  discountType: "Direct" | "Percentage"; // Removed nullable: true

  @Column("decimal", { precision: 5, scale: 2 })
  taxAmount: number; // Removed nullable: true

  @Column("decimal", { precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ default: "Pending" })
  status: string;

  @Column()
  dueDate: Date; // Removed nullable: true

  @Column()
  shop_id: number; // Foreign key to shops table

  @Column()
  customer_id: number; // Foreign key to customers table

  @CreateDateColumn()
  createdOn: Date;

  @UpdateDateColumn()
  updatedOn: Date;

  @DeleteDateColumn({ type: "timestamp" })
  deletedOn: Date; // Removed nullable: true

  @Column({ type: "varchar" })
  deletedBy: string; // Removed nullable: true
}




































