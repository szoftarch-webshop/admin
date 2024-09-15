import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, FormControl,
    InputLabel, Select, MenuItem
} from '@mui/material';
import CategoryDto from '../dtos/categoryDto';

interface CreateCategoryDialogProps {
    open: boolean;
    onClose: () => void;
    onCreate: () => void;
    newCategoryName: string;
    setNewCategoryName: React.Dispatch<React.SetStateAction<string>>;
    parentCategoryId: number | '';
    setParentCategoryId: React.Dispatch<React.SetStateAction<number | ''>>;
    categories: CategoryDto[];
}

const CreateCategoryDialog: React.FC<CreateCategoryDialogProps> = ({
    open, onClose, onCreate, newCategoryName, setNewCategoryName, parentCategoryId, setParentCategoryId, categories
}) => {
    return (
        <Dialog open={open} onClose={onClose}>
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
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onCreate} color="primary">Create</Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateCategoryDialog;
