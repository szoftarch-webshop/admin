import CategoryProductCountDto from "../dtos/dashboard/categoryProductCountDto";
import CategorySalesPercentageDto from "../dtos/dashboard/categorySalesPercentageDto";
import MonthlyCategorySalesDto from "../dtos/dashboard/monthlyCategorySalesDto";
import ProductSalesDto from "../dtos/dashboard/productSalesDto";
import { backendUrl } from "./backendUrl";

const dashboardApi = `${backendUrl}/api/Dashboard`;

// Helper function to append query parameters
const buildUrlWithCategoryId = (url: string, categoryId?: number): string => {
    if (categoryId) {
        return `${url}?categoryId=${categoryId}`;
    }
    return url;
}

// Fetch the number of products by category (for the "Number of Products by Category" pie chart)
export async function fetchProductCountByCategory(categoryId?: number): Promise<CategoryProductCountDto[]> {
    try {
        const url = buildUrlWithCategoryId(`${dashboardApi}/product-count-by-category`, categoryId);
        const response = await fetch(url, { credentials: 'include' });
        if (!response.ok) {
            throw new Error(`Error fetching product count by category: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching product count by category:', error);
        throw error;
    }
}

// Fetch the product sales percentage by category (for the "Products Sold by Percentage" pie chart)
export async function fetchProductSalesPercentage(categoryId?: number): Promise<CategorySalesPercentageDto[]> {
    try {
        const url = buildUrlWithCategoryId(`${dashboardApi}/product-sales-percentage`, categoryId);
        const response = await fetch(url, { credentials: 'include' });
        if (!response.ok) {
            throw new Error(`Error fetching product sales percentage: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching product sales percentage:', error);
        throw error;
    }
}

// Fetch the top 5 selling products (for the "Top 5 Selling Products" bar chart)
export async function fetchTopSellingProducts(categoryId?: number): Promise<ProductSalesDto[]> {
    try {
        const url = buildUrlWithCategoryId(`${dashboardApi}/top-selling-products`, categoryId);
        const response = await fetch(url, { credentials: 'include' });
        if (!response.ok) {
            throw new Error(`Error fetching top-selling products: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching top-selling products:', error);
        throw error;
    }
}

// Fetch the monthly sales by main category (for the "Monthly Sales by Main Category" stacked bar chart)
export async function fetchMonthlySalesByCategory(categoryId?: number): Promise<MonthlyCategorySalesDto[]> {
    try {
        const url = buildUrlWithCategoryId(`${dashboardApi}/monthly-sales-by-category`, categoryId);
        const response = await fetch(url, { credentials: 'include' });
        if (!response.ok) {
            throw new Error(`Error fetching monthly sales by category: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching monthly sales by category:', error);
        throw error;
    }
}
