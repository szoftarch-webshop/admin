import ProductDto from "./productDto";

export default interface OrderItemDto {
    productId: number;
    amount: number;
    orderedPrice: number;
    product: ProductDto;
}