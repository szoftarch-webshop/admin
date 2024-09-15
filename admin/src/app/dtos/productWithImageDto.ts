interface ProductWithImageDto {
    serialNumber: string;
    name: string;
    weight: number;
    material: string;
    description: string;
    price: number;
    stock: number;
    image: File | null;
    categoryNames: string[]; // Adjust to match backend
}