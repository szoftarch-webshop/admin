"use client";

import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, Button, Box, Typography, CircularProgress, TablePagination
} from '@mui/material';
import { Edit, Delete, Add, Visibility } from '@mui/icons-material';
import AuthorizeView from '../components/AuthorizedView';
import CategoryDto from '../dtos/categoryDto';
import ProductDto from '../dtos/productDto';
import { fetchProducts, saveProduct, deleteProduct } from '../services/productService';
import { fetchCategories } from '../services/categoryService';
import CreateEditProductDialog from './CreateEditProductDialog';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import ProductFilter from './ProductFilter';  // Import the new ProductFilter component

const ProductsPage = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [products, setProducts] = useState<ProductDto[]>([]);
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editProduct, setEditProduct] = useState<ProductDto | null>(null);
    const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<number | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalItems, setTotalItems] = useState(0);
    const [viewOnlyDialog, setViewOnlyDialog] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [minPrice, setMinPrice] = useState<number | ''>('');
    const [maxPrice, setMaxPrice] = useState<number | ''>('');
    const [category, setCategory] = useState<string>('');
    const [material, setMaterial] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('name');
    const [sortDirection, setSortDirection] = useState<string>('asc');

    const defaultProduct: ProductDto = {
        id: 0,
        serialNumber: '',
        name: '',
        weight: 0,
        material: '',
        description: '',
        price: 0,
        stock: 0,
        imageUrl: '',
        categoryNames: []
    };

        useEffect(() => {
            fetchProducts(page + 1, rowsPerPage, sortBy, sortDirection, minPrice, maxPrice, category, material, searchTerm)
            .then(data => {
                setProducts(data.items);
                setTotalItems(data.totalItems);
                setLoading(false);
            })
            .catch(console.error);

            fetchCategories().then(setCategories).catch(console.error);
    }, [page, rowsPerPage, sortBy, sortDirection, minPrice, maxPrice, category, material, searchTerm]);

    const handleOpenDialog = (product: ProductDto | null = null, mode: 'edit' | 'view' = 'edit') => {
        if (mode === 'view') {
            setEditProduct(product || null);
            setViewOnlyDialog(true);
        } else {
            setEditProduct(product || { ...defaultProduct });
            setViewOnlyDialog(false);
        }
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditProduct(null);
    };

    const handleSaveProduct = async () => {
        if (editProduct) {
            await saveProduct(editProduct);
            setDialogOpen(false);
            fetchProducts(page + 1, rowsPerPage, sortBy, sortDirection, minPrice, maxPrice, category, material, searchTerm)
                .then(data => setProducts(data.items))
                .catch(console.error);
        }
    };

    const handleOpenConfirmDeleteDialog = (id: number) => {
        setProductToDelete(id);
        setConfirmDeleteDialogOpen(true);
    };

    const handleCloseConfirmDeleteDialog = () => {
        setConfirmDeleteDialogOpen(false);
        setProductToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (productToDelete !== null) {
            await deleteProduct(productToDelete);
            setProducts(products.filter((product) => product.id !== productToDelete));
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
                <Typography variant="h3">Products</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={() => handleOpenDialog()}
                >
                    Add New
                </Button>
            </Box>
            
            <ProductFilter
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                material={material}
                setMaterial={setMaterial}
                category={category}
                setCategory={setCategory}
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortDirection={sortDirection}
                setSortDirection={setSortDirection}
                categories={categories}
            />

            {!loading && (
            <TableContainer component={Paper} elevation={3} sx={{ width: '80%', margin: '0 auto', marginTop: "30px" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Serial Number</TableCell>
                            <TableCell>Material</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Stock</TableCell>
                            <TableCell>Categories</TableCell>
                            <TableCell style={{ width: 150, textAlign: 'center' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.id}</TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.serialNumber}</TableCell>
                                <TableCell>{product.material}</TableCell>
                                <TableCell>{product.price}</TableCell>
                                <TableCell>{product.stock}</TableCell>
                                <TableCell>{product.categoryNames.join(', ')}</TableCell>
                                <TableCell style={{ width: 150, textAlign: 'center'}}>
                                    <IconButton color="primary" onClick={() => handleOpenDialog(product, 'view')}>
                                        <Visibility />
                                    </IconButton>
                                    <IconButton color="primary" onClick={() => handleOpenDialog(product)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleOpenConfirmDeleteDialog(product.id)}>
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
                <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="40vh"
                >
                    <CircularProgress size={80} />
                </Box>
            )}

            <CreateEditProductDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                onSave={handleSaveProduct}
                product={editProduct}
                categories={categories}
                setProduct={setEditProduct}
                viewOnly={viewOnlyDialog}
            />

            <ConfirmDeleteDialog
                open={confirmDeleteDialogOpen}
                onClose={handleCloseConfirmDeleteDialog}
                onConfirm={handleConfirmDelete}
            />
        </AuthorizeView>
    );
};

export default ProductsPage;
