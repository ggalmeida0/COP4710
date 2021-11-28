import * as React from 'react';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useSelector } from 'react-redux';

export const Review = (props) => {
  const cartItems = useSelector(state => state.cartItems);
  const sumPrices = (cartItems) => 
    cartItems.length > 0 ? 
      cartItems.map(item => parseFloat(item.cost.slice(1))).reduce((item1,item2) => item1 + item2)
    : 0;
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      <List disablePadding>
        {cartItems.map((product) => (
          <ListItem key={product.title} sx={{ py: 1, px: 0 }}>
            <ListItemText primary={product.title} secondary={product.description} />
            <Typography variant="body2">{product.cost}</Typography>
          </ListItem>
        ))}

        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {"$" + sumPrices(cartItems)}
          </Typography>
        </ListItem>
      </List>
    </React.Fragment>
  );
}
