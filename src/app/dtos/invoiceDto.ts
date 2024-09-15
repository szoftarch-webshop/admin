import PaymentMethodDto from "./paymentMethodDto";

export default interface InvoiceDto {
    id: number;
    customerName: string;
    customerEmail: string;
    customerPhoneNumber: string;
    customerZipCode: string;
    customerCountry: string;
    customerCity: string;
    customerStreet: string;
    creationDate: string; // Use ISO 8601 format date strings
    paymentMethod: PaymentMethodDto;
}