import React from 'react';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { OrderStatus } from '../dtos/orderStatus';

interface OrderFilterProps {
    startDate: string;
    endDate: string;
    status: string;
    sortBy: string;
    sortDirection: string;
    onStartDateChange: (value: string) => void;
    onEndDateChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onSortByChange: (value: string) => void;
    onSortDirectionChange: (value: string) => void;
}

const OrderFilter: React.FC<OrderFilterProps> = ({
    startDate,
    endDate,
    status,
    sortBy,
    sortDirection,
    onStartDateChange,
    onEndDateChange,
    onStatusChange,
    onSortByChange,
    onSortDirectionChange,
}) => {
    return (
        <Box
            sx={{
                marginBottom: '20px',
                display: 'flex',
                gap: '20px',
                flexWrap: 'wrap',
                width: '80%',
                margin: '0 auto',
            }}
        >
            <FormControl variant="outlined" sx={{ flex: 1 }}>
                <InputLabel>Status</InputLabel>
                <Select
                    value={status}
                    onChange={(e) => onStatusChange(e.target.value as string)}
                    label="Status"
                >
                    <MenuItem value="">All</MenuItem>
                    {Object.values(OrderStatus).map((statusOption) => (
                        <MenuItem key={statusOption} value={statusOption}>
                            {statusOption}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField
                label="Start Date"
                type="date"
                slotProps={{ inputLabel: { shrink: true } }}
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                sx={{ flex: 1 }}
            />
            <TextField
                label="End Date"
                type="date"
                slotProps={{ inputLabel: { shrink: true } }}
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                sx={{ flex: 1 }}
            />
            <FormControl variant="outlined" sx={{ flex: 1 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                    value={sortBy}
                    onChange={(e) => onSortByChange(e.target.value as string)}
                    label="Sort By"
                >
                    <MenuItem value="date">Date</MenuItem>
                    <MenuItem value="customer">Customer Name</MenuItem>
                </Select>
            </FormControl>
            <FormControl variant="outlined" sx={{ flex: 1 }}>
                <InputLabel>Sort Direction</InputLabel>
                <Select
                    value={sortDirection}
                    onChange={(e) => onSortDirectionChange(e.target.value as string)}
                    label="Sort Direction"
                >
                    <MenuItem value="asc">Ascending</MenuItem>
                    <MenuItem value="desc">Descending</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
};

export default OrderFilter;
