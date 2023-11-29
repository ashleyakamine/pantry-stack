import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

// GraphQL query
const GET_INVENTORY = gql`
  query GetInventory {
    inventoryItems { 
      brand
      simple_name
      quantity
      stock_date
      exp_date
    }
  }
`;

const UPDATE_INVENTORY_ITEM = gql`
  mutation UpdateInventoryItem($brand: String!, $simple_name: String, $quantity: Int, $exp_date: Date, $stock_date: Date) {
    updateInventoryItem(brand: $brand, simple_name: $simple_name, quantity: $quantity, exp_date: $exp_date, stock_date: $stock_date) {
      brand
      simple_name
      quantity
      exp_date
      stock_date
    }
  }
`;

export function InventoryPage() {
  const { loading, error, data } = useQuery(GET_INVENTORY, {
    fetchPolicy: 'network-only', 
  });  
  const [updateInventoryItem] = useMutation(UPDATE_INVENTORY_ITEM, {
    refetchQueries: [{ query: GET_INVENTORY }],
  });
  

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [editableRows, setEditableRows] = React.useState([]);
  const [editMode, setEditMode] = React.useState({});

  React.useEffect(() => {
    if (data && data.inventoryItems) {
      setEditableRows(data.inventoryItems.map(item => ({
        ...item,
        isEditable: false 
      })));
    }
  }, [data]);

  const handleRowEdit = (rowIndex, editedRow) => {
    const newRows = [...editableRows];
    newRows[rowIndex] = editedRow;
    setEditableRows(newRows);
  };

  const toggleEditMode = (rowIndex, fieldName) => {
    const fieldKey = `${rowIndex}-${fieldName}`;
    setEditMode(prev => ({
      ...prev,
      [fieldKey]: !prev[fieldKey]
    }));
  };
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleUpdate = async (rowIndex) => {
    const item = editableRows[rowIndex];
    try {
      await updateInventoryItem({
        variables: {
          brand: item.brand,
          simple_name: item.simple_name,
          quantity: item.quantity,
          exp_date: item.exp_date,
          stock_date: item.stock_date
        },
      });
      console.log("brand ", item.brand)
    } catch (error) {

    }
  };

  return (
    <div>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow sx={{ boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)'}}> 
            <TableCell sx={{ verticalAlign: 'top'}}>
              Item
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
                sx={{
                  width: '60%', 
                  marginLeft: '20px', 
                  verticalAlign: 'middle',
                  '& .MuiInputBase-root': {
                  height: '35px', 
                  '& .MuiOutlinedInput-input': { 
                  padding: '10px 14px', 
                  },
                }
              }}
              />
            </TableCell>
              <TableCell align="right">Simple Name</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Stock Date</TableCell>
              <TableCell align="right">Exp. Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {data.inventoryItems
            .filter(item => 
              item.brand.toLowerCase().includes(searchQuery.toLowerCase()) || 
              item.simple_name.toLowerCase().includes(searchQuery.toLowerCase()))
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((item, rowIndex) => (
                <TableRow
                 key={rowIndex}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)', 
                  } }}
                >
                <TableCell 
                  onClick={() => toggleEditMode(rowIndex, 'brand')}
                  sx={{ padding: '10px 10px' }} 
                >
                  {editMode[`${rowIndex}-brand`] ? (
                    <TextField
                      fullWidth
                      value={editableRows[rowIndex].brand}
                      onChange={(e) => handleRowEdit(rowIndex, { ...editableRows[rowIndex], brand: e.target.value })}
                      onBlur={() => {
                        handleUpdate(rowIndex);
                        toggleEditMode(rowIndex, 'brand');
                      }}
                      autoFocus
                      InputProps={{
                        sx: {
                          height: '100%',
                          '& .MuiInputBase-input': {
                            padding: '3px',
                          }
                        }
                      }}
                    />
                  ) : (
                    item.brand
                  )}
                </TableCell>


                  <TableCell align="right">{item.simple_name}</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">{item.stock_date}</TableCell>
                  <TableCell align="right">{item.expiration}</TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={data.inventoryItems.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}
