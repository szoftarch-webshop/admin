export default interface ProductDto {
    id: number;
    serialNumber: string;
    name: string;
    weight: number;
    material: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    categoryNames: string[];
}