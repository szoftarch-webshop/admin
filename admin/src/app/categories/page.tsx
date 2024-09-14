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

// Category DTO interface
interface CategoryDto {
    id: number;
    name: string;
    parentId: number | null;
    children?: CategoryDto[];
}

const mockCategories: CategoryDto[] = [
    { id: 1, name: 'Electronics', parentId: null },
    { id: 2, name: 'Laptops', parentId: 1 },
    { id: 3, name: 'Phones', parentId: 1 },
    { id: 4, name: 'Home Appliances', parentId: null },
    { id: 5, name: 'Refrigerators', parentId: 4 },
    { id: 6, name: 'Washing Machines', parentId: 4 },
];

const categoryApi = "https://localhost:44315/api/Category";

const CategoriesPage = () => {
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [parentCategoryId, setParentCategoryId] = useState<number | ''>('');
    const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editCategoryId, setEditCategoryId] = useState<number | null>(null);
    const [editCategoryName, setEditCategoryName] = useState('');
    const [editParentCategoryId, setEditParentCategoryId] = useState<number | ''>('');




    // Fetch categories on load
    useEffect(() => {

        async function fetchCategories() {
            const response = await fetch(categoryApi);
            const data = await response.json();
            setCategories(data);
        }

        fetchCategories();


        //setCategories(mockCategories);
    }, []);

    // Open the create category dialog
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    // Close the create category dialog
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setNewCategoryName('');
        setParentCategoryId('');
    };

    const handleOpenEditDialog = (category: CategoryDto) => {
        setEditCategoryId(category.id);
        setEditCategoryName(category.name);
        setEditParentCategoryId(category.parentId || '');
        setEditDialogOpen(true);
    };

    const handleUpdateCategory = async () => {
        if (editCategoryId !== null) {
            const updateCategoryDto = { name: editCategoryName, parentId: editParentCategoryId || null };
            await fetch(`${categoryApi}/${editCategoryId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateCategoryDto),
            });
            setEditDialogOpen(false);

            // Refresh the categories after updating
            const response = await fetch(categoryApi);
            const data = await response.json();
            setCategories(data);
        }
    };

    // Handle creating a new category
    const handleCreateCategory = async () => {
        const createCategoryDto = { name: newCategoryName, parentId: parentCategoryId || null };
        await fetch(categoryApi, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(createCategoryDto),
        });
        handleCloseDialog();
        // Refresh categories after creation
        const response = await fetch(categoryApi);
        const data = await response.json();
        setCategories(data);
    };

    // Open the delete confirmation dialog
    const handleOpenConfirmDeleteDialog = (id: number) => {
        setCategoryToDelete(id);
        setConfirmDeleteDialogOpen(true);
    };

    // Close the delete confirmation dialog
    const handleCloseConfirmDeleteDialog = () => {
        setConfirmDeleteDialogOpen(false);
        setCategoryToDelete(null);
    };

    // Confirm delete
    const handleConfirmDelete = async () => {
        if (categoryToDelete !== null) {
            await fetch(`${categoryApi}/${categoryToDelete}`, { method: 'DELETE' });
            setCategories(categories.filter((category) => category.id !== categoryToDelete));
            setConfirmDeleteDialogOpen(false);
            setCategoryToDelete(null);
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
                <Typography variant="h3">Categories</Typography>
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

            {/* Categories Table */}

            <TableContainer component={Paper} elevation={3} sx={{ width: '80%', margin: '0 auto', marginTop: "30px" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Parent Name</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((category) => (
                            <TableRow key={category.id}>
                                <TableCell>{category.id}</TableCell>
                                <TableCell>{category.name}</TableCell>
                                <TableCell>{category.parentId ? categories.find(c => c.id === category.parentId)?.name : 'None'}</TableCell>
                                <TableCell style={{ width: 100 }}>
                                    <IconButton color="primary" onClick={() => handleOpenEditDialog(category)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleOpenConfirmDeleteDialog(category.id)}>
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
                    count={categories.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>


            {/* Create Category Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Create Category</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="normal"
                        label="Category Name"
                        fullWidth
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="parent-category-select-label">Parent Category</InputLabel>
                        <Select
                            labelId="parent-category-select-label"
                            label="Parent Category"
                            value={parentCategoryId}
                            onChange={(e) => setParentCategoryId(e.target.value as number | '')}
                        >
                            <MenuItem value="">None</MenuItem>
                            {categories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleCreateCategory} color="primary">Create</Button>
                </DialogActions>
            </Dialog>
            {/* Delete Confirmation Dialog */}
            <Dialog open={confirmDeleteDialogOpen} onClose={handleCloseConfirmDeleteDialog}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography >Are you sure you want to delete this category?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDeleteDialog}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                <DialogTitle>Edit Category</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="normal"
                        label="Category Name"
                        fullWidth
                        value={editCategoryName}
                        onChange={(e) => setEditCategoryName(e.target.value)}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="edit-parent-category-select-label">Parent Category</InputLabel>
                        <Select
                            labelId="edit-parent-category-select-label"
                            label="Parent Category"
                            value={editParentCategoryId}
                            onChange={(e) => setEditParentCategoryId(e.target.value as number | '')}
                        >
                            <MenuItem value="">None</MenuItem>
                            {categories
                                .filter((category) => category.id !== editCategoryId) // Exclude the current category being edited
                                .map((category) => (
                                    <MenuItem key={category.id} value={category.id}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleUpdateCategory} color="primary">Update</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default CategoriesPage;