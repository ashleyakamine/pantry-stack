import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import {GET_RECIPES}  from '../gql/gql.js';

export function RecipePage() {
  const { loading, error, data } = useQuery(GET_RECIPES);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  if (loading) return <LinearProgress />;
  if (error) return <p>Error: {error.message}</p>;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const filterRecipes = (recipes) => {
    const searchTerms = searchQuery.toLowerCase().split(/,?\s+/).filter(Boolean);
  
    return recipes.filter((recipe) => {
      const searchText = `${recipe.title.toLowerCase()} ${recipe.ingredients.toLowerCase()}`;
  
      return searchTerms.every(term => searchText.includes(term));
    });
  };
  
  return (
    <div style={{ paddingTop: '20px', width: '100%' }}>
      { !loading && (
        <div>
          <TextField
            label="Search Recipe List"
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
              height: '45px', 
              '& .MuiOutlinedInput-input': { 
              padding: '20px 14px', 
              },
            }
          }}
          />
        </div>)}
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow sx={{ boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)'}}> 
              <TableCell >Recipe</TableCell>
              <TableCell align="right">Ingredients</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filterRecipes(data.recipeList)
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((recipe) => (
                <TableRow
                  key={recipe.title}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }
                  }}
                >
                  <TableCell 
                    component="th" 
                    scope="row"
                    sx={{
                      '&:hover': {
                        textDecoration: 'underline',
                      }
                    }}
                  >
                    <a
                      href={`https://${recipe.link}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      {recipe.title}
                    </a>
                  </TableCell>
                  <TableCell align="right">
                    {recipe.ingredients}
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    <TablePagination
        style={{ width: '100%' }} 
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={data.recipeList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>

  );
}
