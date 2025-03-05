export interface IQuotation {
    id?: number;
    quotationNumber: string;
    quotationDate: string;
    quotationTerms: string;
    shop: {
        id: number;
        name: string;
        owner: string;
        address: string;
    };
    products: {
        productId: number;
        name: string;
        quantity: number;
        price: number;
        total: number;
    }[];
}
