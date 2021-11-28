import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Navigate, useNavigate} from 'react-router-dom';
import { useSelector, useDispatch} from "react-redux";
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import axios from 'axios';
import { GRAPHQL_SERVER } from '../env'
import { CircularProgress } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { ADD_TO_CART, REMOVE_FROM_CART } from '../redux/appReducer';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import Drawer from '@mui/material/Drawer';

const drawerWidth = 240;

const AppBar = MuiAppBar;


const GameCard = gameInfo =>{
  const dispatch = useDispatch();
  return (
    <Grid item xs={4}>
      <Card sx={{ maxWidth: 345 }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {gameInfo.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Genre: {gameInfo.genre}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Description: {gameInfo.description}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Rating: {gameInfo.rating}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cost: {gameInfo.cost}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            onClick={()=>dispatch({type:ADD_TO_CART, payload:gameInfo})}>
              Add to Cart
          </Button>
        </CardActions>
      </Card>
    </Grid>
  )}

const CartItem = item => {
  const dispatch = useDispatch(); 
  return (
    <ListItem>
      <ListItemText primary={item.title} />
      <IconButton edge="end" aria-label="delete" onClick={()=>dispatch({type:REMOVE_FROM_CART, payload:item})}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  );
}

const renderGames = games =>
  (
    games ? games.map(gameInfo => GameCard(gameInfo)) 
    : <CircularProgress/>
  );

const renderCartItems = cartItems =>
  (
    cartItems ? cartItems.map(item => CartItem(item))
    : <></>
  );

const mdTheme = createTheme();

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const DashboardContent = () => {
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const cartItems = useSelector((state) => state.cartItems);
  const navigateTo = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [games, setGames] = React.useState([]);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const query = `
    {
      getAllGames {
        title
        genre
        description
        rating
        cost
      }
    } 
  `
  if(games.length === 0){
    axios.post(GRAPHQL_SERVER,{query:query})
      .then((result) => setGames(result.data.data.getAllGames))
      .catch((error) => console.error(error));
  }
  return (
    !isLoggedIn ? <Navigate to="/login" replace={true}/>
    :
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <Badge badgeContent={cartItems.length > 0 ? cartItems.length : null} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            <Typography
              component="h1"
              variant="h5"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1}}
            >
              Game Start
            <Typography
              component="h1"
              variant="body1"
              color="inherit"
              noWrap
              sx={{flexGrow: 1}}
            >
              Because why would you ever stop games
            </Typography>
            </Typography>
            <Button variant="contained" color="secondary" onClick={() => navigateTo('/checkout')}>
               Checkout 
            </Button>
          </Toolbar>
        </AppBar>
        <Drawer
            sx={{
              width: drawerWidth,
              flexShrink: -1,
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
              },
            }}
            variant="persistent"
            anchor="left"
            open={open}
          >
            <DrawerHeader>
              <Typography sx={{mr:3}} variant="h6">
                Shopping Cart
              </Typography>
              <IconButton onClick={toggleDrawer}>
                {<ChevronLeftIcon />}
              </IconButton>
            </DrawerHeader>
          <List>{renderCartItems(cartItems)}</List>
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" sx={{mb: 4}}>
              Available Games:
            </Typography>
            <Grid container spacing={2}>
              {renderGames(games)}
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider> 
    );
}

export default function Dashboard() { return <DashboardContent /> }
