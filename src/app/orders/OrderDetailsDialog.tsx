import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography,
    TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper
} from '@mui/material';
import OrderDto from '../dtos/orderDto';

interface OrderDetailsDialogProps {
    open: boolean;
    onClose: () => void;
    order?: OrderDto;
}

const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({ open, onClose, order }) => {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Order Details</DialogTitle>
            <DialogContent>
                {order && (
                    <>
                        <Typography variant="h6">Order ID: {order.id}</Typography>
                        <Typography>Status: {order.status}</Typography>
                        <Typography>Order Date: {new Date(order.orderDate).toLocaleDateString()}</Typography>
                        <Typography variant="h6">Shipping Address</Typography>
                        <Typography>Name: {order.shippingAddress.name}</Typography>
                        <Typography>Phone Number: {order.shippingAddress.phoneNumber}</Typography>
                        <Typography>Email: {order.shippingAddress.email}</Typography>
                        <Typography>Country: {order.shippingAddress.country}</Typography>
                        <Typography>Street: {order.shippingAddress.street}</Typography>
                        <Typography>City: {order.shippingAddress.city}</Typography>
                        <Typography>Zip Code: {order.shippingAddress.zipCode}</Typography>

                        <Typography variant="h6">Invoice Details</Typography>
                        <Typography>Invoice ID: {order.invoice.id}</Typography>
                        <Typography>Customer Name: {order.invoice.customerName}</Typography>
                        <Typography>Email: {order.invoice.customerEmail}</Typography>
                        <Typography>Phone Number: {order.invoice.customerPhoneNumber}</Typography>
                        <Typography>Address: {order.invoice.customerStreet}, {order.invoice.customerCity}, {order.invoice.customerZipCode}, {order.invoice.customerCountry}</Typography>
                        <Typography>Creation Date: {new Date(order.invoice.creationDate).toLocaleDateString()}</Typography>
                        <Typography>Payment Method: {order.invoice.paymentMethod.name}</Typography>

                        <Typography variant="h6">Order Items</Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Serial Number</TableCell>
                                        <TableCell>Amount</TableCell>
                                        <TableCell>Ordered Price</TableCell>
                                        <TableCell>Categories</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {order.orderItems.map((item) => (
                                        <TableRow key={item.productId}>
                                            <TableCell>{item.product.id}</TableCell>
                                            <TableCell>{item.product.name}</TableCell>
                                            <TableCell>{item.product.serialNumber}</TableCell>
                                            <TableCell>{item.amount}</TableCell>
                                            <TableCell>{item.orderedPrice}</TableCell>
                                            <TableCell>{item.product.categoryNames.join(', ')}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default OrderDetailsDialog;
