import OrderDto from '../dtos/orderDto';
import { OrderStatus } from '../dtos/orderStatus';
import PaginatedResult from '../dtos/paginatedResultDto';
import { backendUrl } from './backendUrl';

const orderApi = `${backendUrl}/api/Order`;

export async function fetchOrders(
    pageNumber: number = 1,
    pageSize: number = 10,
    sortBy: string = "date",
    sortDirection: string = "asc",
    status?: string,
    startDate?: string,
    endDate?: string
): Promise<PaginatedResult<OrderDto>> {
    try {
        const queryParams = new URLSearchParams({
            pageNumber: pageNumber.toString(),
            pageSize: pageSize.toString(),
            sortBy,
            sortDirection
        });
        if (status) {
            queryParams.append('status', status);
        }
        if (startDate) {
            queryParams.append('startDate', startDate);
        }
        if (endDate) {
            queryParams.append('endDate', endDate);
        }

        const response = await fetch(`${orderApi}?${queryParams.toString()}`, {
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(`Error fetching orders: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
}

export const deleteOrder = async (id: number): Promise<void> => {
    await fetch(`${orderApi}/${id}`, { method: 'DELETE', credentials: 'include' });
};

export const updateOrderStatus = async (id: number, status: OrderStatus): Promise<void> => {
    await fetch(`${orderApi}/${id}/status`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'newStatus': status })
    });
};