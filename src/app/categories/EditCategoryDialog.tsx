import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, FormControl,
    InputLabel, Select, MenuItem
} from '@mui/material';
import CategoryDto from '../dtos/categoryDto';

interface EditCategoryDialogProps {
    open: boolean;
    onClose: () => void;
    onUpdate: () => void;
    editCategoryName: string;
    setEditCategoryName: React.Dispatch<React.SetStateAction<string>>;
    editParentCategoryId: number | '';
    setEditParentCategoryId: React.Dispatch<React.SetStateAction<number | ''>>;
    categories: CategoryDto[];
    editCategoryId: number | null;
}

const EditCategoryDialog: React.FC<EditCategoryDialogProps> = ({
    open, onClose, onUpdate, editCategoryName, setEditCategoryName, editParentCategoryId, setEditParentCategoryId, categories, editCategoryId
}) => {
    return (
        <Dialog open={open} onClose={onClose}>
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
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onUpdate} color="primary">Update</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditCategoryDialog;
