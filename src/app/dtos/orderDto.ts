import InvoiceDto from "./invoiceDto";
import OrderItemDto from "./orderItemDto";
import { OrderStatus } from "./orderStatus";
import ShippingAddressDto from "./shippingAddressDto";

export default interface OrderDto {
    id: number;
    status: OrderStatus;
    orderDate: string; // Use ISO 8601 format date strings
    orderItems: OrderItemDto[];
    shippingAddress: ShippingAddressDto;
    invoice: InvoiceDto;
}