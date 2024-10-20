import CategoryDto from '../dtos/categoryDto';
import { backendUrl } from './backendUrl';

const categoryApi = `${backendUrl}/api/Category`;

// Fetch all categories
export async function fetchCategories(): Promise<CategoryDto[]> {
    const response = await fetch(categoryApi, { credentials: 'include' });
    return response.json();
}

// Create a new category
export async function createCategory(name: string, parentId: number | null): Promise<void> {
    const createCategoryDto = { name, parentId };
    await fetch(categoryApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createCategoryDto),
        credentials: 'include',
    });
}

// Update an existing category
export async function updateCategory(id: number, name: string, parentId: number | null): Promise<void> {
    const updateCategoryDto = { name, parentId };
    await fetch(`${categoryApi}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateCategoryDto),
        credentials: 'include',
    });
}

// Delete a category
export async function deleteCategory(id: number): Promise<void> {
    await fetch(`${categoryApi}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });
}
