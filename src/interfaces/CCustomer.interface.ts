export interface customerBasicDetails {
    customerName : string,
    customerMobileNo : string,
}

export interface SignUpResp extends getcustomerDetailsByCustomerMobileNoResp, getCustomerDetailsByCustomerEmailIdResp{
    customerId:string
    customerName:string
    customerAddress:string
    customerGSTNo:string
    customerlogo:string
    customerMobileNo:string
    customerEmailId:string
    
   
   
};

export interface getCustomerDetailsByNameZipCodeResp extends customerBasicDetails {
    customerCityZipCode : string,
}

export interface getCustomerDetailsByCustomerNameResp extends customerBasicDetails {
    customerEmailId: any
    customerName : string,
}



export interface getcustomerDetailsByCustomerMobileNoResp extends customerBasicDetails {
    customerMobileNo : string,
}

export interface getCustomerDetailsByCustomerEmailIdResp extends customerBasicDetails {
    customerId: string;         
    customerEmailId : string,
}

export interface getcustomerDetailsByCustomerAddressResp extends customerBasicDetails {
    customerAddress: string,
}

export interface getCustomerDetailsByCustomerGSTNodResp extends customerBasicDetails {
    customerGSTNo : string,
}


export interface getAllCustomers extends getCustomerDetailsByCustomerEmailIdResp, getCustomerDetailsByCustomerEmailIdResp {
    customerGSTNo: string,
    customerCityZipCode: string
}






















