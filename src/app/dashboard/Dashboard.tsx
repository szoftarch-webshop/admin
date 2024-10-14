import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Box, Typography, Paper, MenuItem, Select, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { fetchCategories } from '../services/categoryService'; // Import category service
import { fetchMonthlySalesByCategory, fetchProductCountByCategory, fetchProductSalesPercentage, fetchTopSellingProducts } from '../services/dashboardService';

const months: { [key: string]: string } = {
    Jan: '1',
    Feb: '2',
    Mar: '3',
    Apr: '4',
    May: '5',
    Jun: '6',
    Jul: '7',
    Aug: '8',
    Sep: '9',
    Oct: '10',
    Nov: '11',
    Dec: '12',
};

const monthNames: { [key: string]: string } = {
    '1': 'Jan',
    '2': 'Feb',
    '3': 'Mar',
    '4': 'Apr',
    '5': 'May',
    '6': 'Jun',
    '7': 'Jul',
    '8': 'Aug',
    '9': 'Sep',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dec',
};


const Dashboard: React.FC = () => {
    const [categoryData, setCategoryData] = useState<any[]>([]);
    const [salesPercentageData, setSalesPercentageData] = useState<any[]>([]);
    const [salesData, setSalesData] = useState<any[]>([]);
    const [monthlyCategorySalesData, setMonthlyCategorySalesData] = useState<any[]>([]);
    const [mainCategories, setMainCategories] = useState<any[]>([]); // Dynamic categories
    const [categoryHierarchy, setCategoryHierarchy] = useState<any>({});
    const [selectedMainCategory, setSelectedMainCategory] = useState<number | 'all'>('all');

    useEffect(() => {
        // Fetch all categories dynamically
        fetchCategories()
            .then((data) => {
                // Separate categories into main categories and build the hierarchy
                const mainCats = data.filter((cat: any) => cat.parentId === null);
                const hierarchy = data.reduce((acc: any, cat: any) => {
                    if (cat.parentId) {
                        if (!acc[cat.parentId]) {
                            acc[cat.parentId] = [];
                        }
                        acc[cat.parentId].push(cat.name);
                    }
                    return acc;
                }, {});

                setMainCategories(mainCats);
                setCategoryHierarchy(hierarchy);
            })
            .catch((error) => console.error('Error fetching categories:', error));

        const categoryId = selectedMainCategory === 'all' ? undefined : selectedMainCategory;

        fetchProductCountByCategory(categoryId)
            .then((data) => setCategoryData(data))
            .catch((error) => console.error('Error fetching product count by category:', error));

        fetchProductSalesPercentage(categoryId)
            .then((data) => setSalesPercentageData(data))
            .catch((error) => console.error('Error fetching product sales percentage:', error));

        fetchTopSellingProducts()
            .then((data) => setSalesData(data))
            .catch((error) => console.error('Error fetching top-selling products:', error));

        fetchMonthlySalesByCategory()
            .then((data) => {
                const formattedData = formatMonthlyCategorySales(data);
                setMonthlyCategorySalesData(formattedData);
            })
            .catch((error) => console.error('Error fetching monthly category sales:', error));
    }, [selectedMainCategory]);

    // Colors for the pie charts
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

    // Handle main category change
    const handleCategoryChange = (event: SelectChangeEvent) => {
        const value = event.target.value === 'all' ? 'all' : parseInt(event.target.value);
        setSelectedMainCategory(value as number | 'all');
    };

    // Function to format monthly category sales data
    // Function to format monthly category sales data
    const formatMonthlyCategorySales = (data: any[]) => {
        const formattedData: any[] = [];

        data.forEach((item) => {
            const monthNumber = item.month.toString().padStart(2, '0'); // Convert the month integer to a string and pad with zeros if necessary
            let existingMonth = formattedData.find((entry) => entry.month === monthNumber);
            if (!existingMonth) {
                existingMonth = { month: monthNumber }; // Store month as zero-padded string
                formattedData.push(existingMonth);
            }
            existingMonth[item.category] = item.salesCount;
        });

        // Sort the formatted data based on the numeric month value
        return formattedData.sort((a, b) => parseInt(a.month) - parseInt(b.month));
    };


    // Get the relevant categories to display based on the selection
    const displayedCategories = categoryData;


    // Get the relevant sales percentage data based on the selection
    const displayedSalesPercentage = salesPercentageData;

    // Dynamically generate bars for the stacked bar chart
    const generateCategoryBars = () => {
        return mainCategories.map((category: any, index: number) => (
            <Bar key={category.id} dataKey={category.name} stackId="a" fill={COLORS[index % COLORS.length]} />
        ));
    };

    return (
        <Box sx={{ padding: '20px', width: '80%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
            <Typography component='span' variant="h4" align="center" gutterBottom>
                Dashboard
            </Typography>

            {/* Dropdown to select main category or "all" */}
            <FormControl fullWidth>
                <InputLabel>Main Category</InputLabel>
                <Select value={selectedMainCategory.toString()} onChange={handleCategoryChange} label="Main Category">
                    <MenuItem value="all">All Main Categories</MenuItem>
                    {mainCategories.map((category: any) => (
                        <MenuItem key={category.id} value={category.id.toString()}>
                            {category.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Box sx={{ display: 'flex', justifyContent: 'space-around', gap: '40px' }}>
                {/* Pie Chart: Products by Category */}
                <Paper elevation={3} sx={{ padding: '20px', width: '45%' }}>
                    <Typography component='span' variant="h6" gutterBottom>
                        Number of Products by Category
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={displayedCategories}
                                dataKey="productCount"
                                nameKey="categoryName"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label={({ name, value }) => `${name}: ${value}`}
                            >
                                {displayedCategories.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </Paper>

                {/* Pie Chart: Products Sold by Percentage */}
                <Paper elevation={3} sx={{ padding: '20px', width: '45%' }}>
                    <Typography component='span' variant="h6" gutterBottom>
                        Products Sold by Percentage
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={displayedSalesPercentage}
                                dataKey="percentage"
                                nameKey="categoryName"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label={({ name, value }) => `${name}: ${(Math.round(value * 100) / 100).toFixed(1)}%`}
                            >
                                {displayedSalesPercentage.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </Paper>
            </Box>

            {/* Horizontal Bar Chart: Top 5 Selling Products */}
            <Paper elevation={3} sx={{ padding: '20px' }}>
                <Typography component='span' variant="h6" gutterBottom>
                    Top 5 Selling Products
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesData} layout="vertical" margin={{ left: 120 }}>
                        <XAxis type="number" />
                        <YAxis dataKey="productName" type="category" />
                        <Tooltip />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Bar dataKey="salesCount" fill="#1976d2" />
                    </BarChart>
                </ResponsiveContainer>
            </Paper>

            {/* Stacked Bar Chart: Monthly Sales by Main Category */}
            <Paper elevation={3} sx={{ padding: '20px' }}>
                <Typography component='span' variant="h6" gutterBottom>
                    Monthly Sales by Main Category
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyCategorySalesData}>
                        <XAxis
                            dataKey="month"
                            tickFormatter={(tick) => monthNames[tick.replace(/^0+/, '')]}
                        />
                        <YAxis />
                        <Tooltip labelFormatter={(label) => monthNames[label.replace(/^0+/, '')]} />
                        <CartesianGrid strokeDasharray="3 3" />
                        {generateCategoryBars()}
                    </BarChart>
                </ResponsiveContainer>
            </Paper>
        </Box>
    );
};

export default Dashboard;
