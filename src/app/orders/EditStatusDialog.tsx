import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography,
    Select, MenuItem
} from '@mui/material';
import { OrderStatus } from '../dtos/orderStatus';

interface EditStatusDialogProps {
    open: boolean;
    onClose: () => void;
    status: OrderStatus;
    onStatusChange: (status: OrderStatus) => void;
    onSave: () => void;
}

const EditStatusDialog: React.FC<EditStatusDialogProps> = ({ open, onClose, status, onStatusChange, onSave }) => {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Edit Order Status</DialogTitle>
            <DialogContent>
                <Typography variant="h6">Order ID:</Typography>
                <Select
                    value={status}
                    onChange={(event) => onStatusChange(event.target.value as OrderStatus)}
                    fullWidth
                >
                    {Object.values(OrderStatus).map((status) => (
                        <MenuItem key={status} value={status}>
                            {status}
                        </MenuItem>
                    ))}
                </Select>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onSave} variant="contained" color="primary">Update</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditStatusDialog;
