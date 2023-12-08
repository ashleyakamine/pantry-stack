import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { Link, useLocation } from 'react-router-dom';
import InventoryIcon from '@mui/icons-material/Inventory';
import MenuBookIcon from '@mui/icons-material/MenuBook';

const pages = [
  { name: 'Inventory', path: '/inventory' },
  { name: 'Recipe', path: '/recipe' },
];

function Header() {
  const location = useLocation();
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar 
    sx={{ bgcolor: '#FFEBA2', boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)' }} 
    position="static" 
    >
      <Container maxWidth="xl" >
        <Toolbar  disableGutters>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <img src="/logo.png" alt="Logo" style={{ height: '50px' , paddingRight: '20px' }} />
            <Typography
              variant="h6"
              noWrap
              component="div" 
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                color: '#000000',
                textDecoration: 'none',
              }}
            >
            </Typography>
          </Link>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="#000000"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
                {pages.map((page) => ( // for small small window
                  <MenuItem 
                  key={page.name} 
                  onClick={handleCloseNavMenu} 
                  component={Link} 
                  to={page.path}
                  sx={{
                    color: location.pathname === page.path ? '#000000' : '#636363',
                  }}>
                    <Typography textAlign="center">{page.name}</Typography>
                  </MenuItem>
                ))}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              color: '#000000',
              textDecoration: 'none',
            }}
          >
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          {pages.map((page) => ( // for full screen window
            <Button
              key={page.name}
              onClick={handleCloseNavMenu}
              sx={{
                my: 2,
                fontWeight: 700,
                color: location.pathname === page.path ? '#000000' : '#636363',
                '&:hover': {
                  backgroundColor: '#dbca8a'
                },
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
              }}
              component={Link}
              to={page.path}
              startIcon={
                page.name === 'Inventory' 
                  ? <InventoryIcon/> 
                  : <MenuBookIcon/>
              }
            >
              {page.name}
            </Button>
          ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;