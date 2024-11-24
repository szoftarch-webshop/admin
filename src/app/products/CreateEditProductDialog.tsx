import React, { useEffect, useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl,
    InputLabel, Select, MenuItem, Checkbox, ListItemText, Button,
    Container,
    Box,
    Typography
} from '@mui/material';
import ProductDto from '../dtos/productDto';
import CategoryDto from '../dtos/categoryDto';
import { backendUrl } from '../services/backendUrl';

interface CreateEditProductDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: () => void;
    product: ProductDto;
    categories: CategoryDto[];
    setProduct: React.Dispatch<React.SetStateAction<ProductDto>>;
    viewOnly: boolean;
}



const CreateEditProductDialog: React.FC<CreateEditProductDialogProps> = ({
    open, onClose, onSave, product, categories, setProduct, viewOnly
}) => {
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (product.image && !viewOnly) {
            // If a new image is selected, create a preview URL
            setImagePreviewUrl(URL.createObjectURL(product.image));
        } else if (product.imageUrl) {
            if(product.imageUrl.startsWith('http')){
                setImagePreviewUrl(`${product.imageUrl}`);
            }
            else{
                setImagePreviewUrl(`${backendUrl}/${product.imageUrl}`);
            }
        } else {
            // No image selected/uploaded
            setImagePreviewUrl(null);
        }

        // Clean up the preview URL when component unmounts
        return () => {
            if (imagePreviewUrl && product.image) {
                URL.revokeObjectURL(imagePreviewUrl);
            }
        };
    }, [product.image, product.imageUrl, viewOnly]);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{product?.id ? 'Edit Product' : 'Create Product'}</DialogTitle>
            <DialogContent>
                <TextField
                    margin="normal"
                    label="Product Name"
                    fullWidth
                    value={product?.name || ''}
                    onChange={(e) => setProduct(prev => ({ ...prev!, name: e.target.value }))}
                    inputProps={{ readOnly: viewOnly }}
                />
                <TextField
                    autoFocus
                    margin="normal"
                    label="Serial Number"
                    fullWidth
                    value={product?.serialNumber || ''}
                    onChange={(e) => setProduct(prev => ({ ...prev!, serialNumber: e.target.value }))}
                    inputProps={{ readOnly: viewOnly }}
                />
                <TextField
                    margin="normal"
                    label="Weight"
                    fullWidth
                    type="number"
                    value={product?.weight || ''}
                    onChange={(e) => setProduct(prev => ({ ...prev!, weight: parseFloat(e.target.value) }))}
                    inputProps={{ readOnly: viewOnly }}
                />
                <TextField
                    margin="normal"
                    label="Material"
                    fullWidth
                    value={product?.material || ''}
                    onChange={(e) => setProduct(prev => ({ ...prev!, material: e.target.value }))}
                    inputProps={{ readOnly: viewOnly }}
                />
                <TextField
                    margin="normal"
                    label="Description"
                    fullWidth
                    value={product?.description || ''}
                    onChange={(e) => setProduct(prev => ({ ...prev!, description: e.target.value }))}
                    inputProps={{ readOnly: viewOnly }}
                />
                <TextField
                    margin="normal"
                    label="Price"
                    fullWidth
                    type="number"
                    value={product?.price || ''}
                    onChange={(e) => setProduct(prev => ({ ...prev!, price: parseInt(e.target.value) }))}
                    inputProps={{ readOnly: viewOnly }}
                />
                <TextField
                    margin="normal"
                    label="Stock"
                    fullWidth
                    type="number"
                    value={product?.stock || ''}
                    onChange={(e) => setProduct(prev => ({ ...prev!, stock: parseInt(e.target.value) }))}
                    inputProps={{ readOnly: viewOnly }}
                />
                <TextField
                    margin="normal"
                    label="Image URL"
                    fullWidth
                    value={product?.imageUrl || ''}
                    onChange={(e) => setProduct(prev => ({ ...prev!, imageUrl: e.target.value }))}
                    inputProps={{ readOnly: viewOnly }}
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Categories</InputLabel>
                    <Select
                        label="Categories"
                        multiple
                        value={product?.categoryNames || []}
                        onChange={(e) => setProduct(prev => ({ ...prev!, categoryNames: e.target.value as string[] }))}
                        renderValue={(selected) => (selected as string[]).join(', ')}
                        inputProps={{ readOnly: viewOnly }}
                    >
                        {categories.map((category) => (
                            <MenuItem key={category.id} value={category.name}>
                                <Checkbox checked={product?.categoryNames?.includes(category.name) || false} />
                                <ListItemText primary={category.name} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Box marginTop={2}>
                    {/* Label for the image */}
                    <Typography variant="subtitle1" gutterBottom>
                        Product Image
                    </Typography>

                    {/* Image container with a grey border */}
                    {imagePreviewUrl && (
                        <Box
                            sx={{
                                border: '1px solid #ccc',
                                padding: '10px',
                                borderRadius: '4px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                maxWidth: '100%',
                                marginBottom: '10px',
                            }}
                        >
                            <img
                                src={imagePreviewUrl}
                                alt="Product Preview"
                                style={{ maxWidth: '100%', height: 'auto' }}
                            />
                        </Box>
                    )}
                </Box>
                {/* File input section */}
                {!viewOnly && (
                    <Container fixed>
                        {/* Material UI Button for file upload */}
                        <Button
                            variant="outlined"
                            component="label"
                            style={{ marginTop: '20px', width: '100%' }}
                        >
                            Upload Image
                            <input
                                accept="image/*"
                                type="file"
                                hidden
                                onChange={(e) => {
                                    const file = e.target.files ? e.target.files[0] : null;
                                    setProduct({ ...product, image: file });
                                    if (file) {
                                        setImagePreviewUrl(URL.createObjectURL(file));
                                    }
                                }}
                            />
                        </Button>
                    </Container>
                )}
            </DialogContent>
            <DialogActions>
                {viewOnly ? (
                    <Button onClick={onClose}>Close</Button>
                ) : (
                    <>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button onClick={onSave} variant="contained" color="primary">
                            {product?.id ? 'Update' : 'Create'}
                        </Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default CreateEditProductDialog;
