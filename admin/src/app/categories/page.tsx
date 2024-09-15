"use client";

import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, Button, Box, Typography, TablePagination
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import AuthorizeView from '../components/AuthorizedView';
import CategoryDto from '../dtos/categoryDto';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../services/categoryService';
import CreateCategoryDialog from './CreateCategoryDialog';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import EditCategoryDialog from './EditCategoryDialog';

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
        loadCategories();
    }, []);

    const loadCategories = async () => {
        const data = await fetchCategories();
        setCategories(data);
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

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
            await updateCategory(editCategoryId, editCategoryName, editParentCategoryId || null);
            setEditDialogOpen(false);
            await loadCategories();
        }
    };

    const handleCreateCategory = async () => {
        await createCategory(newCategoryName, parentCategoryId || null);
        handleCloseDialog();
        await loadCategories();
    };

    const handleOpenConfirmDeleteDialog = (id: number) => {
        setCategoryToDelete(id);
        setConfirmDeleteDialogOpen(true);
    };

    const handleCloseConfirmDeleteDialog = () => {
        setConfirmDeleteDialogOpen(false);
        setCategoryToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (categoryToDelete !== null) {
            await deleteCategory(categoryToDelete);
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
                <Typography variant="h3">Categories</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={handleOpenDialog}
                >
                    Add New
                </Button>
            </Box>

            <TableContainer component={Paper} elevation={3} sx={{ width: '80%', margin: '0 auto', marginTop: "30px" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Parent Name</TableCell>
                            <TableCell style={{ width: 100 }}>Actions</TableCell>
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

            <CreateCategoryDialog
                open={openDialog}
                onClose={handleCloseDialog}
                onCreate={handleCreateCategory}
                newCategoryName={newCategoryName}
                setNewCategoryName={setNewCategoryName}
                parentCategoryId={parentCategoryId}
                setParentCategoryId={setParentCategoryId}
                categories={categories}
            />

            <ConfirmDeleteDialog
                open={confirmDeleteDialogOpen}
                onClose={handleCloseConfirmDeleteDialog}
                onConfirm={handleConfirmDelete}
            />

            <EditCategoryDialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                onUpdate={handleUpdateCategory}
                editCategoryName={editCategoryName}
                setEditCategoryName={setEditCategoryName}
                editParentCategoryId={editParentCategoryId}
                setEditParentCategoryId={setEditParentCategoryId}
                categories={categories}
                editCategoryId={editCategoryId}
            />
        </AuthorizeView>
    );
};

export default CategoriesPage;