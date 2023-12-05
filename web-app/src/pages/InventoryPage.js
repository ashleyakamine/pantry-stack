import React, {useEffect, useState, useMemo} from 'react';
import { useQuery, useMutation } from '@apollo/client';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LinearProgress from '@mui/material/LinearProgress';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import {GET_INVENTORY, UPDATE_INVENTORY_ITEM, DELETE_INVENTORY_ITEM, ADD_INVENTORY_ITEM } from '../gql/gql.js';

export function InventoryPage() {
  const { loading, error, data } = useQuery(GET_INVENTORY, {
    fetchPolicy: 'network-only', 
  });  
  const [updateInventoryItem] = useMutation(UPDATE_INVENTORY_ITEM);
  const [deleteInventoryItem] = useMutation(DELETE_INVENTORY_ITEM);
  const [addInventoryItem] = useMutation(ADD_INVENTORY_ITEM);

  const [sortField, setSortField] = useState('brand');
  const [sortDirection, setSortDirection] = useState('asc'); 
  const [errorMessage, setErrorMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editableRows, setEditableRows] = useState([]);
  const [editMode, setEditMode] = useState({});
  const [anchorPosition, setAnchorPosition] = useState(null);
  const [addAnchorEl, setAddAnchorEl] = useState(null);
  const isAddPopoverOpen = Boolean(addAnchorEl);
  const addPopoverId = isAddPopoverOpen ? 'add-popover' : undefined;
  const sortOptions = [
    { value: 'brand', label: 'Brand' },
    { value: 'simple_name', label: 'Simple Name' },
    { value: 'quantity', label: 'Quantity' },
    { value: 'stock_date', label: 'Stock Date' },
    { value: 'exp_date', label: 'Exp. Date' },
  ];  
  const [newItem, setNewItem] = useState({
    brand: '',
    simple_name: '',
    quantity: 0,
    stock_date: '',
    exp_date: ''
  });

  const sortedEditableRows = useMemo(() => {
    return [...editableRows].sort((a, b) => {
      let valueA = a[sortField];
      let valueB = b[sortField];
  
      if (sortField === 'quantity') {
        valueA = Number(valueA);
        valueB = Number(valueB);
      } else if (sortField === 'stock_date' || sortField === 'exp_date') {
        valueA = new Date(valueA);
        valueB = new Date(valueB);
      }
  
      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [editableRows, sortField, sortDirection]);
  
  
  useEffect(() => {
    if (data && data.inventoryItems) {
      setEditableRows(data.inventoryItems.map(item => ({
        ...item,
        isEditable: false 
      })));
    }
  }, [data]);
  
  if (loading) return <LinearProgress/>;
  if (error) return <p>Error: {error.message}</p>;
  
  const open = Boolean(anchorPosition);
  const id = open ? 'simple-popover' : undefined;

  const handleClick = (event, itemId) => {
    const position = { top: window.innerHeight / 2, left: window.innerWidth / 2 };
    setAnchorPosition(position);
    setEditMode({ [`${itemId}-edit`]: true });
  };

  const handleClose = () => {
    setAnchorPosition(null);
    setEditMode({});
  };

  const handleRowEdit = (itemId, editedField, value) => {
    setEditableRows(editableRows.map(row => 
        row.id === itemId ? { ...row, [editedField]: value } : row
    ));
};

  const handleUpdate = async (itemId) => {
    const item = editableRows[itemId-1];

    try {
      await updateInventoryItem({
        variables: {
          id: item.id,
          brand: item.brand,
          simple_name: item.simple_name,
          quantity: item.quantity,
          exp_date: item.exp_date,
          stock_date: item.stock_date
        },
        awaitRefetchQueries: GET_INVENTORY
      });
    } catch (error) {
      console.log(error)
    }
  };

  const handleDelete = async (itemId) => {
    try {
      await deleteInventoryItem({
        variables: { id: itemId },
        awaitRefetchQueries: GET_INVENTORY
      },
      );
      setEditableRows(editableRows.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleAddNewItem = async () => {
    if (!newItem.brand.trim()) {
      setErrorMessage('Error: Brand name is required.');
      return;
    }

    try {
      const { data } = await addInventoryItem({
        variables: {
          brand: newItem.brand,
          simple_name: newItem.simple_name,
          quantity: parseInt(newItem.quantity),
          stock_date: newItem.stock_date,
          exp_date: newItem.exp_date
        },
      });
  
      setEditableRows([...editableRows, data.addInventoryItem]);
  
      setNewItem({
        brand: '',
        simple_name: '',
        quantity: 0,
        stock_date: '',
        exp_date: ''
      });
      setErrorMessage(''); 
    } catch (error) {
      let errorMsg = 'Error adding new item: ';
      if (error.graphQLErrors?.length > 0) {
        error.graphQLErrors.forEach((err) => {
          errorMsg += err.message + ' ';
        });
      } else {
        errorMsg += error.message;
      }
      setErrorMessage(errorMsg);
    }
  };
  
  
  const handleNewItemChange = (e) => {
    console.log(e); 
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handlePageClick = () => {
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const convertDateFormat = (dateStr) => {
    if (!dateStr) return '';
  
    const [month, day, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };
  
  return (
    <div onClick={handlePageClick} style={{ paddingTop: '12px' }}>
     <Grid container spacing={1} alignItems="center" justifyContent="space-between">
      <Grid item xs={10} sm={8} md={6}>
        <TextField
          label="Search Inventory"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          fullWidth
        />
      </Grid>
      <Grid item style={{ paddingRight: '90px' }}>
        <Button
          aria-describedby={addPopoverId}
          variant="contained"
          color="secondary"
          onClick={(e) => setAddAnchorEl(e.currentTarget)}
        >
          <AddIcon />
        </Button>
      </Grid>
    </Grid>
    <Popover
      id={addPopoverId}
      open={isAddPopoverOpen}
      anchorEl={addAnchorEl}
      onClose={() => setAddAnchorEl(null)}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      {errorMessage && (
        <Alert severity="error" onClose={() => setErrorMessage('')}>
          {errorMessage}
        </Alert>
      )}
      <Typography sx={{ p: 2 }}>
      <TextField
        name="brand"
        label="Brand"
        value={newItem.brand}
        onChange={handleNewItemChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="simple_name"
        label="Simple Name"
        value={newItem.simple_name}
        onChange={handleNewItemChange} 
        fullWidth
        margin="normal"
      />
      <TextField
        name="quantity"
        type="number"
        label="Quantity"
        value={newItem.quantity}
        onChange={handleNewItemChange} 
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          min: 0, 
          step: 1, 
        }}
      />
      <TextField
        name="stock_date"
        label="Stock Date"
        type="date"
        value={(newItem.stock_date)}
        onChange={handleNewItemChange} 
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        label="Expiration Date"
        name="exp_date"
        type="date"
        value={(newItem.exp_date)}
        onChange={handleNewItemChange} 
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
      />
        <Button onClick={handleAddNewItem}>Add</Button>
      </Typography>
  </Popover>
      <TableContainer sx={{ maxHeight: 650, overflow: 'auto'  }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow sx={{ boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)'}}> 
            <TableCell>Item</TableCell>
              <TableCell align="right">Simple Name</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Stock Date</TableCell>
              <TableCell align="right">Exp. Date</TableCell>
              <TableCell align="right" sx={{ width: '250px' }}>
              <Grid container justifyContent="flex-end" alignItems="center" spacing={1}>
                <Grid item>
                  <InputLabel id="sort-by-label">Sort By</InputLabel>
                </Grid>
                <Grid item>
                  <Select
                    labelId="sort-by-label"
                    value={sortField}
                    onChange={(e) => setSortField(e.target.value)}
                    alignItems="right"
                  >
                    {sortOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value} >
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
        {sortedEditableRows
          .filter(item =>
            (item.brand?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (item.simple_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()))
          .map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{item.brand}</TableCell>
              <TableCell align="right">{item.simple_name}</TableCell>
              <TableCell align="right">{item.quantity}</TableCell>
              <TableCell align="right">{item.stock_date}</TableCell>
              <TableCell align="right">{item.exp_date}</TableCell>
              <TableCell align="right">
                <Button onClick={(e) => handleClick(e, item.id)}>
                  <EditIcon />
                </Button>
                <Popover
                id={id}
                open={open && editMode[`${item.id}-edit`]}
                anchorReference="anchorPosition"
                anchorPosition={anchorPosition}
                onClose={handleClose}
                transformOrigin={{
                  vertical: 'center',
                  horizontal: 'center',
                }}
                >
                  <Typography sx={{ p: 2 }}>
                    <TextField
                      name="brand"
                      label="Brand"
                      value={item.brand}
                      onChange={handleNewItemChange}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      name="simple_name"
                      label="Simple Name"
                      value={item.simple_name}
                      onChange={(e) => handleRowEdit(item.id, 'simple_name', e.target.value)}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      name="quantity"
                      type="number"
                      label="Quantity"
                      value={item.quantity}
                      onChange={(e) => handleRowEdit(item.id, 'quantity', e.target.value)}
                      fullWidth
                      margin="normal"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        min: 0, 
                        step: 1, 
                      }}
                    />
                    <TextField
                      name="stock_date"
                      label="Stock Date"
                      type="date"
                      value={convertDateFormat(item.stock_date)}
                      onChange={(e) => handleRowEdit(item.id, 'stock_date', e.target.value)}
                      fullWidth
                      margin="normal"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    <TextField
                      label="Expiration Date"
                      type="date"
                      value={convertDateFormat(item.exp_date)}
                      onChange={(e) => handleRowEdit(item.id, 'exp_date', e.target.value)}
                      fullWidth
                      margin="normal"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    <Button onClick={() => {
                      handleUpdate(item.id);
                      handleClose();
                    }}>
                      Save
                    </Button>
                  </Typography>
                </Popover>
                <Button
                  onClick={() => handleDelete(item.id)}
                  color="alert"
                >
                  <DeleteIcon />
                </Button>
              </TableCell>
            </TableRow>
                ))}
      </TableBody>
        </Table>
      </TableContainer>
    </div>                
  );
}
