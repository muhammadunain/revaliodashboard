export interface LayoutProps{
    children: React.ReactNode;
}


export interface PropertyProps{
    address: string;
    country: string;
    towerShip: string;
    city: string;
    zipCode: string;
    propertyType: string;
    listingType: string;
    bedrooms: string;
    bathrooms: string;
    areaSqFt: string;
    floor: string;
    totalFloors: string;
    price: string;
    activeFilingsCount: string;
    filingHistoryCount: string;
    pendingAuthorizations: string;
    outstandingInvoices: string;
    createAt?: Date;
}