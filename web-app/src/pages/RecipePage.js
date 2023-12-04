import React from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import LinearProgress from '@mui/material/LinearProgress';

// GraphQL query
const GET_RECIPES = gql`
  query GetRecipes {
    recipeList{ 
      title
      link
      ingredients
    }
  }
`;

export function RecipePage() {
  // Execute the query using useQuery
  const { loading, error, data } = useQuery(GET_RECIPES);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  if (loading) return <LinearProgress />;
  if (error) return <p>Error: {error.message}</p>;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Render the data
  return (
    <div>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow sx={{ boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)'}}> 
              <TableCell >Recipe</TableCell>
              <TableCell align="right">Ingredients</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.recipeList
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((recipe) => (
              <TableRow
                key={recipe.title}
                sx={{ '&:last-child td, &:last-child th': { border: 0 },
                '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)', 
                  } }}
              >
                <TableCell 
                  component="th" 
                  scope="row" 
                  sx={{ cursor: 'pointer' }}
                >
                  <a
                    href={`https://${recipe.link}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ textDecoration: 'none',
                     color: 'inherit',
                      }}
                     >
                    {recipe.title}
                  </a>
                </TableCell>
                <TableCell align="right">
                  <a href={`https://${recipe.link}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                    {recipe.ingredients}
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    <TablePagination
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
