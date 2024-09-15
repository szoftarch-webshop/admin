"use client";

import React from 'react';
import {
    Box, TextField, Select, MenuItem, FormControl, InputLabel, ListItemText
} from '@mui/material';
import CategoryDto from '../dtos/categoryDto';

interface ProductFilterProps {
    searchTerm: string;
    minPrice: number | '';
    maxPrice: number | '';
    material: string;
    category: string;
    sortBy: string;
    sortDirection: string;
    categories: CategoryDto[];
    setSearchTerm: (value: string) => void;
    setMinPrice: (value: number | '') => void;
    setMaxPrice: (value: number | '') => void;
    setMaterial: (value: string) => void;
    setCategory: (value: string) => void;
    setSortBy: (value: string) => void;
    setSortDirection: (value: string) => void;
}

const ProductFilter: React.FC<ProductFilterProps> = ({
    searchTerm, setSearchTerm, minPrice, setMinPrice, maxPrice, setMaxPrice,
    material, setMaterial, category, setCategory, sortBy, setSortBy,
    sortDirection, setSortDirection, categories
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
            <TextField
                label="Search"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ flex: 2 }}
            />            
            <TextField
                label="Material"
                variant="outlined"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                sx={{ flex: 1 }}
            />
            <TextField
                label="Min Price"
                variant="outlined"
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value ? parseInt(e.target.value) : '')}
                sx={{ flex: 1 }}
            />
            <TextField
                label="Max Price"
                variant="outlined"
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value ? parseInt(e.target.value) : '')}
                sx={{ flex: 1 }}
            />
            <FormControl variant="outlined" sx={{ flex: 1 }}>
                <InputLabel>Category</InputLabel>
                <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as string)}
                    label="Category"
                >
                    <MenuItem key={'All'} value={undefined} sx={{padding: '15px'}}>
                        <ListItemText primary={'All'} />
                    </MenuItem>
                    {categories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.name} sx={{padding: '15px'}}>
                            <ListItemText primary={cat.name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl variant="outlined" sx={{ flex: 1 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as string)}
                    label="Sort By"
                >
                    <MenuItem value="name">Name</MenuItem>
                    <MenuItem value="price">Price</MenuItem>
                </Select>
            </FormControl>
            <FormControl variant="outlined" sx={{ flex: 1 }}>
                <InputLabel>Sort Direction</InputLabel>
                <Select
                    value={sortDirection}
                    onChange={(e) => setSortDirection(e.target.value as string)}
                    label="Sort Direction"
                >
                    <MenuItem value="asc">Ascending</MenuItem>
                    <MenuItem value="desc">Descending</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
};

export default ProductFilter;