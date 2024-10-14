import ProductDto from '../dtos/productDto';
import PaginatedResult from '../dtos/paginatedResultDto';

const productApi = "https://localhost:44315/api/Product";

export async function fetchProducts(
    pageNumber: number = 1,
    pageSize: number = 10,
    sortBy: string = "name", // or any default sort field for products
    sortDirection: string = "asc",
    minPrice?: number | '',
    maxPrice?: number | '',
    category?: number,
    material?: string,
    searchTerm?: string
): Promise<PaginatedResult<ProductDto>> {
    try {
        const queryParams = new URLSearchParams({
            pageNumber: pageNumber.toString(),
            pageSize: pageSize.toString(),
            sortBy,
            sortDirection
        });
        if (minPrice !== '' && minPrice !== undefined) {
            queryParams.append('minPrice', minPrice.toString());
        }
        if (maxPrice !== '' && maxPrice !== undefined) {
            queryParams.append('maxPrice', maxPrice.toString());
        }
        if (category) {
            queryParams.append('category', category.toString());
        }
        if (material) {
            queryParams.append('material', material);
        }
        if (searchTerm) {
            queryParams.append('searchString', searchTerm);
        }

        const response = await fetch(`${productApi}?${queryParams.toString()}`, {
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error(`Error fetching products: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}


export const saveProduct = async (product: ProductDto): Promise<void> => {
    const method = product.id ? 'PUT' : 'POST';
    const url = product.id ? `${productApi}/${product.id}` : productApi;

    const formData = new FormData();

    // Convert productDto to JSON string
    formData.append('productDtoJson', JSON.stringify({
        id: product.id,
        serialNumber: product.serialNumber,
        name: product.name,
        weight: product.weight,
        material: product.material,
        description: product.description,
        price: product.price,
        stock: product.stock,
        imageUrl: product.imageUrl,
        categoryNames: product.categoryNames,
    }));

    // Attach the image if present
    if (product.image) {
        formData.append('image', product.image);
    }

    await fetch(url, {
        method,
        body: formData,
        credentials: 'include',
    });
};


export const deleteProduct = async (id: number): Promise<void> => {
    await fetch(`${productApi}/${id}`, { method: 'DELETE', credentials: 'include' });
};
