import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import DatePicker from '@mui/lab/DatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

export const PaymentForm = (props) => {
  const [value, setValue] = React.useState(props.paymentInfo.expiration_date);
  const handleDatePicker = (newValue) => {
    setValue(newValue);
    props.setPaymentInfo({...props.paymentInfo, expiration_date: newValue.toISOString().substring(0,10)})
  };
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Payment method
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="cardName"
            label="Name on card"
            fullWidth
            autoComplete="cc-name"
            variant="standard"
            defaultValue={props.paymentInfo.name_on_card}
            onChange={(event) => props.setPaymentInfo({...props.paymentInfo, name_on_card: event.target.value})}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="cardNumber"
            label="Card number"
            fullWidth
            autoComplete="cc-number"
            variant="standard"
            defaultValue={props.paymentInfo.card_number}
            onChange={(event) => props.setPaymentInfo({...props.paymentInfo, card_number: event.target.value})}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
            label="Expiry date"
            inputFormat="yyyy-MM-dd"
            value={value}
            onChange={handleDatePicker}
            renderInput={(params) => <TextField {...params} sx={{ mt: 2}} name="expirationDate"/>}
            mask="____-__-__"
          />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="cvv"
            label="CVV"
            helperText="Last three digits on signature strip"
            fullWidth
            autoComplete="cc-csc"
            variant="standard"
            defaultValue={props.paymentInfo.csv_code}
            onChange={(event) => props.setPaymentInfo({...props.paymentInfo, csv_code: event.target.value})}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
