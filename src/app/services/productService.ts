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

    await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
        credentials: 'include',
    });
};

export const deleteProduct = async (id: number): Promise<void> => {
    await fetch(`${productApi}/${id}`, { method: 'DELETE', credentials: 'include' });
};
