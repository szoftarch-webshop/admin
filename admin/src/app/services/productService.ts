import ProductDto from '../dtos/productDto';
import PaginatedResult from '../dtos/paginatedResultDto';

const productApi = "https://localhost:44315/api/Product";

export const fetchProducts = async (
    sortBy: string,
    sortDirection: string,
    minPrice?: number | '',
    maxPrice?: number | '',
    category?: string,
    material?: string,
    searchTerm?: string
): Promise<PaginatedResult<ProductDto>> => {
    try {
        const query = `${productApi}?sortBy=${sortBy}&sortDirection=${sortDirection}` +
            (minPrice ? `&minPrice=${minPrice}` : '') +
            (maxPrice ? `&maxPrice=${maxPrice}` : '') +
            (category ? `&category=${category}` : '') +
            (material ? `&material=${material}` : '') +
            (searchTerm ? `&searchString=${searchTerm}` : '');

        const response = await fetch(query, { credentials: 'include' });
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

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
