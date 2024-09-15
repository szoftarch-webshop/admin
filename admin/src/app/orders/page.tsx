'use client';

import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, TablePagination, Box, Typography,
    CircularProgress
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import AuthorizeView from '../components/AuthorizedView';
import OrderDto from '../dtos/orderDto';
import { fetchOrders, deleteOrder, updateOrderStatus } from '../services/orderService';
import { OrderStatus } from '../dtos/orderStatus';
import OrderDetailsDialog from './OrderDetailsDialog';
import EditStatusDialog from './EditStatusDialog';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import OrderFilter from './OrderFilter';

const OrdersPage = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [orders, setOrders] = useState<OrderDto[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [viewOrder, setViewOrder] = useState<OrderDto | undefined>(undefined);
    const [editOrder, setEditOrder] = useState<OrderDto | undefined>(undefined);
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [statusToEdit, setStatusToEdit] = useState<OrderStatus>(OrderStatus.Pending);
    const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState<number | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalItems, setTotalItems] = useState(0);

    // New states for filtering and sorting
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('date');
    const [sortDirection, setSortDirection] = useState<string>('asc');

    useEffect(() => {
        fetchOrders(
            page + 1,
            rowsPerPage,
            sortBy,
            sortDirection,
            status,
            startDate,
            endDate
        )
            .then(data => {
                setOrders(data.items);
                setTotalItems(data.totalItems);
                setLoading(false);
            })
            .catch(console.error);
    }, [page, rowsPerPage, startDate, endDate, status, sortBy, sortDirection]);

    const handleOpenDialog = (order: OrderDto) => {
        setViewOrder(order);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleOpenStatusDialog = (order: OrderDto) => {
        setEditOrder(order);
        setStatusToEdit(order.status);
        setStatusDialogOpen(true);
    };

    const handleCloseStatusDialog = () => {
        setStatusDialogOpen(false);
    };

    const handleSaveStatus = async () => {
        if (editOrder) {
            await updateOrderStatus(editOrder.id, statusToEdit);
            setStatusDialogOpen(false);
            fetchOrders()
                .then(data => setOrders(data.items))
                .catch(console.error);
        }
    };

    const handleOpenConfirmDeleteDialog = (id: number) => {
        setOrderToDelete(id);
        setConfirmDeleteDialogOpen(true);
    };

    const handleCloseConfirmDeleteDialog = () => {
        setConfirmDeleteDialogOpen(false);
        setOrderToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (orderToDelete !== null) {
            await deleteOrder(orderToDelete);
            setOrders(orders.filter((order) => order.id !== orderToDelete));
            setConfirmDeleteDialogOpen(false);
        }
    };

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <AuthorizeView>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                    marginTop: '100px',
                    padding: '0 200px',
                }}
            >
                <Typography variant="h3">Orders</Typography>
            </Box>

            {/* Filters and Sorting */}
            <OrderFilter
                startDate={startDate}
                endDate={endDate}
                status={status}
                sortBy={sortBy}
                sortDirection={sortDirection}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                onStatusChange={setStatus}
                onSortByChange={setSortBy}
                onSortDirectionChange={setSortDirection}
            />

            {!loading && (
                <TableContainer component={Paper} elevation={3} sx={{ width: '80%', margin: '0 auto', marginTop: "30px" }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Order ID</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Order Date</TableCell>
                                <TableCell>Invoice ID</TableCell>
                                <TableCell>Customer Name</TableCell>
                                <TableCell>Payment Method</TableCell>
                                <TableCell style={{ width: 150, textAlign: 'center' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders
                                .map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell>{order.id}</TableCell>
                                        <TableCell>{order.status}</TableCell>
                                        <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                                        <TableCell>{order.invoice.id}</TableCell>
                                        <TableCell>{order.invoice.customerName}</TableCell>
                                        <TableCell>{order.invoice.paymentMethod.name}</TableCell>
                                        <TableCell style={{ width: 150, textAlign: 'center' }}>
                                            <IconButton color="primary" onClick={() => handleOpenDialog(order)}>
                                                <Visibility />
                                            </IconButton>
                                            <IconButton color="primary" onClick={() => handleOpenStatusDialog(order)}>
                                                <Edit />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => handleOpenConfirmDeleteDialog(order.id)}>
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={totalItems}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableContainer>
            )}
            {loading && (
                <Box display="flex" justifyContent="center" alignItems="center" height="40vh">
                    <CircularProgress size={80} />
                </Box>
            )}

            {/* Dialog Components */}
            <OrderDetailsDialog open={dialogOpen} onClose={handleCloseDialog} order={viewOrder} />
            <EditStatusDialog open={statusDialogOpen} onClose={handleCloseStatusDialog} onSave={handleSaveStatus} status={statusToEdit} onStatusChange={setStatusToEdit} />
            <ConfirmDeleteDialog open={confirmDeleteDialogOpen} onClose={handleCloseConfirmDeleteDialog} onConfirm={handleConfirmDelete} />
        </AuthorizeView>
    );
};

export default OrdersPage;

