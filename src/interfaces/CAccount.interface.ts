export interface AccountBasicDetails {
    customerName: string;
    customerMobileNo: string;
  }
  
  export interface AccountDetails extends AccountBasicDetails {
    accountId: number;
    customerEmailId: string;
    customerAddress: string;
  }
  