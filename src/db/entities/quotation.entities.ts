import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('quotations')
export class Quotation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quotationNumber: string;

    @Column()
    quotationDate: string;

    @Column()
    quotationTerms: string;

    @Column()
    shopId: number; // Instead of ManyToOne relation, store shop ID directly.

    @Column()
    shopName: string; // Store shop name separately

    @Column()
    shopOwner: string; // Store owner name separately

    @Column()
    shopAddress: string; // Store address separately

    @Column('json')
    products: { productId: number; name: string; quantity: number; price: number; total: number }[];
}
