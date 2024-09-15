// services/orderService.ts

import OrderDto from '../dtos/orderDto';
import { OrderStatus } from '../dtos/orderStatus';
import PaginatedResult from '../dtos/paginatedResultDto';

const orderApi = "https://localhost:44315/api/Order";

export async function fetchOrders(): Promise<PaginatedResult<OrderDto>> {
    try{
        const response = await fetch(orderApi, { credentials: 'include' });
        return response.json();
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
}

export const deleteOrder = async (id: number): Promise<void> => {
    await fetch(`${orderApi}/${id}`, { method: 'DELETE', credentials: 'include' });
};

export const updateOrderStatus = async (id:number, status: OrderStatus): Promise<void> => {
    await fetch(`${orderApi}/${id}/status`, { 
        method: 'PUT', 
        credentials: 'include', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'newStatus': status }) 
    });
};