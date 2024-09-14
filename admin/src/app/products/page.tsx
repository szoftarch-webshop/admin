"use client";

import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, Button, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, Select, MenuItem, InputLabel, FormControl, TablePagination,
    Box, Typography,
    Container,
    SelectChangeEvent
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

interface ProductWithImageDto {
    serialNumber: string;
    name: string;
    weight: number;
    material: string;
    description: string;
    price: number;
    stock: number;
    image: File | null;
    categoryNames: string[]; // Adjust to match backend
}

interface CategoryDto {
    id: number;
    name: string;
    parentId: number | null;
    children?: CategoryDto[];
}

const defaultProduct: ProductDto & { image?: File } = {
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

const productApi = "https://localhost:44315/api/Product";
const categoryApi = "https://localhost:44315/api/Category";

const ProductsPage = () => {
    const [products, setProducts] = useState<ProductDto[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalItems, setTotalItems] = useState<number>(0);
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
        image: null as File | null,
        categories: []
    });
    const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<number | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editProduct, setEditProduct] = useState<ProductDto & { image?: File }>({ ...defaultProduct });
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const fetchProducts = async (page: number) => {
        try {
            const response = await fetch(`${productApi}?page=${page}`);
            const data: PaginatedResult<ProductDto> = await response.json();

            // Update state with the paginated result
            setProducts(data.items);
            setTotalPages(data.totalPages);
            setCurrentPage(data.currentPage);
            setTotalItems(data.totalItems);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    // Fetch products on load
    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage]);  // fetch new products when the page changes

    // Open the create product dialog
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    useEffect(() => {

        async function fetchCategories() {
            const response = await fetch(categoryApi);
            const data = await response.json();
            setCategories(data);
        }

        fetchCategories();

    }, []);

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
            image: null,
            categories: []
        });
    };

    // Open the edit product dialog
    const handleOpenEditDialog = (product: ProductDto) => {
        setEditProduct({ ...product });
        setSelectedCategories(product.categoryNames);
        setEditDialogOpen(true);
    };

    // Handle create product
    const handleCreateProduct = async () => {
        const formData = new FormData();

        // Append product data as JSON
        formData.append('productDtoJson', JSON.stringify({
            id: 0,
            serialNumber: newProduct.serialNumber,
            name: newProduct.name,
            weight: newProduct.weight,
            material: newProduct.material,
            description: newProduct.description,
            price: newProduct.price,
            stock: newProduct.stock,
            imageUrl: "",
            categoryNames: selectedCategories
        }));

        // Append the image file if available
        if (newProduct.image) {
            formData.append('image', newProduct.image);
        }

        const response = await fetch(productApi, {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            handleCloseDialog();

            // Refresh products after creation
            await fetchProducts(currentPage);
        } else {
            const error = await response.json();
            console.error('Error:', error);
        }
    };

    // Handle update product
    const handleUpdateProduct = async () => {
        if (editProduct) {
            const formData = new FormData();

            // Append product data as JSON
            formData.append('productDtoJson', JSON.stringify({
                id: editProduct.id,
                serialNumber: editProduct.serialNumber,
                name: editProduct.name,
                weight: editProduct.weight,
                material: editProduct.material,
                description: editProduct.description,
                price: editProduct.price,
                stock: editProduct.stock,
                imageUrl: editProduct.imageUrl,
                categoryNames: editProduct.categoryNames
            }));

            // Append the image file if it exists
            if (editProduct.image) {
                formData.append('image', editProduct.image);
            }

            const response = await fetch(`${productApi}/${editProduct.id}`, {
                method: 'PUT',
                body: formData,
            });

            if (response.ok) {
                setEditDialogOpen(false);

                await fetchProducts(currentPage);
            } else {
                const error = await response.json();
                console.error('Error:', error);
            }
        }
    };

    const handleCategoryChange = (event: SelectChangeEvent<string[]>) => {
        setSelectedCategories(event.target.value as string[]);
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

    // Pagination handlers
    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
        setCurrentPage(newPage + 1); // API pages start from 1
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset page to 0 when rows per page changes
        setCurrentPage(1); // Reset to first page
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
                    count={totalItems}
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
                        margin="normal"
                        fullWidth
                        label="Serial Number"
                        value={newProduct.serialNumber}
                        onChange={(e) => setNewProduct({ ...newProduct, serialNumber: e.target.value })}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Weight"
                        type="number"
                        value={newProduct.weight}
                        onChange={(e) => setNewProduct({ ...newProduct, weight: Number(e.target.value) })}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Material"
                        value={newProduct.material}
                        onChange={(e) => setNewProduct({ ...newProduct, material: e.target.value })}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Price"
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Stock"
                        type="number"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="categories-select-label">Categories</InputLabel>
                        <Select
                            labelId="categories-select-label"
                            label="Categories"
                            multiple
                            value={selectedCategories}
                            onChange={handleCategoryChange}
                            renderValue={(selected) => (selected as string[]).join(', ')}
                        >
                            <MenuItem value="">None</MenuItem>
                            {categories
                                .map((category) => (
                                    <MenuItem key={category.id} value={category.name}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                    <Container fixed>
                        <input
                            accept="image/*"
                            type="file"
                            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files ? e.target.files[0] : null })}
                            style={{ marginTop: '20px' }}
                        />
                    </Container>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleCreateProduct}>Create</Button>
                </DialogActions>
            </Dialog>

            {/* Edit Product Dialog */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                <DialogTitle>Edit Product</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Serial Number"
                        value={editProduct.serialNumber}
                        onChange={(e) => setEditProduct({ ...editProduct, serialNumber: e.target.value })}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Name"
                        value={editProduct.name}
                        onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Weight"
                        type="number"
                        value={editProduct.weight}
                        onChange={(e) => setEditProduct({ ...editProduct, weight: Number(e.target.value) })}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Material"
                        value={editProduct.material}
                        onChange={(e) => setEditProduct({ ...editProduct, material: e.target.value })}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Description"
                        value={editProduct.description}
                        onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Price"
                        type="number"
                        value={editProduct.price}
                        onChange={(e) => setEditProduct({ ...editProduct, price: Number(e.target.value) })}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Stock"
                        type="number"
                        value={editProduct.stock}
                        onChange={(e) => setEditProduct({ ...editProduct, stock: Number(e.target.value) })}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="categories-select-label">Categories</InputLabel>
                        <Select
                            labelId="categories-select-label"
                            label="Categories"
                            multiple
                            value={selectedCategories}
                            onChange={handleCategoryChange}
                            renderValue={(selected) => (selected as string[]).join(', ')}
                        >
                            <MenuItem value="">None</MenuItem>
                            {categories
                                .map((category) => (
                                    <MenuItem key={category.id} value={category.name}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                    <input
                        accept="image/*"
                        type="file"
                        onChange={(e) => setEditProduct({ ...editProduct, image: e.target.files ? e.target.files[0] : undefined })}
                        style={{ marginTop: '20px' }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleUpdateProduct}>Save</Button>
                </DialogActions>
            </Dialog>

            {/* Confirm Delete Dialog */}
            <Dialog open={confirmDeleteDialogOpen} onClose={handleCloseConfirmDeleteDialog}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this product?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDeleteDialog}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ProductsPage;
