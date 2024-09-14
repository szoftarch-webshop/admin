"use client";

import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, Button, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, Select, MenuItem, InputLabel, FormControl, TablePagination,
    Box,
    Typography
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';

interface PaginatedResult<T> {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    items: T[];
}

// Product DTO interface
interface ProductDto {
    id: number;
    serialNumber: string;
    name: string;
    weight: number;
    material: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    categoryNames: string[];
}

const productApi = "https://localhost:44315/api/Product";

const ProductsPage = () => {
    const [products, setProducts] = useState<ProductDto[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [openDialog, setOpenDialog] = useState(false);
    const [newProduct, setNewProduct] = useState({
        serialNumber: '',
        name: '',
        weight: 0,
        material: '',
        description: '',
        price: 0,
        stock: 0,
        imageUrl: '',
        categories: []
    });
    const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<number | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editProduct, setEditProduct] = useState<ProductDto | null>(null);

    // Fetch products on load
    useEffect(() => {
        const fetchProducts = async (page: number) => {
            try {
                const response = await fetch(productApi);
                const data: PaginatedResult<ProductDto> = await response.json();

                // Update state with the paginated result
                setProducts(data.items);
                setTotalPages(data.totalPages);
                setCurrentPage(data.currentPage);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts(currentPage);
    }, [currentPage]);  // fetch new products when the page changes

    // Open the create product dialog
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    // Close the create product dialog
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setNewProduct({
            serialNumber: '',
            name: '',
            weight: 0,
            material: '',
            description: '',
            price: 0,
            stock: 0,
            imageUrl: '',
            categories: []
        });
    };

    const handleOpenEditDialog = (product: ProductDto) => {
        setEditProduct(product);
        setEditDialogOpen(true);
    };

    const handleUpdateProduct = async () => {
        if (editProduct) {
            const updateProductDto = {
                serialNumber: editProduct.serialNumber,
                name: editProduct.name,
                weight: editProduct.weight,
                material: editProduct.material,
                description: editProduct.description,
                price: editProduct.price,
                stock: editProduct.stock,
                imageUrl: editProduct.imageUrl,
                categories: editProduct.categoryNames
            };
            await fetch(`${productApi}/${editProduct.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateProductDto),
            });
            setEditDialogOpen(false);

            // Refresh the products after updating
            const response = await fetch(productApi);
            const data = await response.json();
            setProducts(data);
        }
    };

    // Handle creating a new product
    const handleCreateProduct = async () => {
        await fetch(productApi, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProduct),
        });
        handleCloseDialog();

        // Refresh products after creation
        const response = await fetch(productApi);
        const data = await response.json();
        setProducts(data);
    };

    // Open the delete confirmation dialog
    const handleOpenConfirmDeleteDialog = (id: number) => {
        setProductToDelete(id);
        setConfirmDeleteDialogOpen(true);
    };

    // Close the delete confirmation dialog
    const handleCloseConfirmDeleteDialog = () => {
        setConfirmDeleteDialogOpen(false);
        setProductToDelete(null);
    };

    // Confirm delete
    const handleConfirmDelete = async () => {
        if (productToDelete !== null) {
            await fetch(`${productApi}/${productToDelete}`, { method: 'DELETE' });
            setProducts(products.filter((product) => product.id !== productToDelete));
            setConfirmDeleteDialogOpen(false);
            setProductToDelete(null);
        }
    };

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset page to 0 when rows per page changes
    };

    return (
        <div>
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
                    onClick={handleOpenDialog}
                    sx={{}}
                >
                    Add New
                </Button>
            </Box>

            {/* Products Table */}
            <TableContainer component={Paper} elevation={3} sx={{ width: '80%', margin: '0 auto', marginTop: "30px" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Serial Number</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Stock</TableCell>
                            <TableCell>Categories</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.id}</TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.serialNumber}</TableCell>
                                <TableCell>{product.price}</TableCell>
                                <TableCell>{product.stock}</TableCell>
                                <TableCell>{product.categoryNames.join(', ')}</TableCell>
                                <TableCell style={{ width: 100 }}>
                                    <IconButton color="primary" onClick={() => handleOpenEditDialog(product)}>
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
                    count={products.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>

            {/* Create Product Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Create Product</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="normal"
                        label="Serial Number"
                        fullWidth
                        value={newProduct.serialNumber}
                        onChange={(e) => setNewProduct({ ...newProduct, serialNumber: e.target.value })}
                    />
                    <TextField
                        margin="normal"
                        label="Product Name"
                        fullWidth
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    />
                    <TextField
                        margin="normal"
                        label="Weight"
                        fullWidth
                        type="number"
                        value={newProduct.weight}
                        onChange={(e) => setNewProduct({ ...newProduct, weight: parseFloat(e.target.value) })}
                    />
                    <TextField
                        margin="normal"
                        label="Material"
                        fullWidth
                        value={newProduct.material}
                        onChange={(e) => setNewProduct({ ...newProduct, material: e.target.value })}
                    />
                    <TextField
                        margin="normal"
                        label="Description"
                        fullWidth
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    />
                    <TextField
                        margin="normal"
                        label="Price"
                        fullWidth
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: parseInt(e.target.value) })}
                    />
                    <TextField
                        margin="normal"
                        label="Stock"
                        fullWidth
                        type="number"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                    />
                    <TextField
                        margin="normal"
                        label="Image URL"
                        fullWidth
                        value={newProduct.imageUrl}
                        onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                    />
                    {/* Add Category Selection logic */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
                    <Button onClick={handleCreateProduct} color="primary">Create</Button>
                </DialogActions>
            </Dialog>

            {/* Edit Product Dialog */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                <DialogTitle>Edit Product</DialogTitle>
                <DialogContent>
                    {/* Similar fields as the create dialog, but bound to editProduct */}
                    {editProduct && (
                        <>
                            <TextField
                                autoFocus
                                margin="normal"
                                label="Serial Number"
                                fullWidth
                                value={editProduct.serialNumber}
                                onChange={(e) => setEditProduct({ ...editProduct, serialNumber: e.target.value })}
                            />
                            <TextField
                                margin="normal"
                                label="Product Name"
                                fullWidth
                                value={editProduct.name}
                                onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                            />
                            <TextField
                                margin="normal"
                                label="Weight"
                                fullWidth
                                type="number"
                                value={editProduct.weight}
                                onChange={(e) => setEditProduct({ ...editProduct, weight: parseFloat(e.target.value) })}
                            />
                            <TextField
                                margin="normal"
                                label="Material"
                                fullWidth
                                value={editProduct.material}
                                onChange={(e) => setEditProduct({ ...editProduct, material: e.target.value })}
                            />
                            <TextField
                                margin="normal"
                                label="Description"
                                fullWidth
                                value={editProduct.description}
                                onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                            />
                            <TextField
                                margin="normal"
                                label="Price"
                                fullWidth
                                type="number"
                                value={editProduct.price}
                                onChange={(e) => setEditProduct({ ...editProduct, price: parseInt(e.target.value) })}
                            />
                            <TextField
                                margin="normal"
                                label="Stock"
                                fullWidth
                                type="number"
                                value={editProduct.stock}
                                onChange={(e) => setEditProduct({ ...editProduct, stock: parseInt(e.target.value) })}
                            />
                            <TextField
                                margin="normal"
                                label="Image URL"
                                fullWidth
                                value={editProduct.imageUrl}
                                onChange={(e) => setEditProduct({ ...editProduct, imageUrl: e.target.value })}
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)} color="primary">Cancel</Button>
                    <Button onClick={handleUpdateProduct} color="primary">Update</Button>
                </DialogActions>
            </Dialog>

            {/* Delete confirmation dialog */}
            <Dialog open={confirmDeleteDialogOpen} onClose={handleCloseConfirmDeleteDialog}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this product?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDeleteDialog} color="primary">Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="secondary">Delete</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ProductsPage;
