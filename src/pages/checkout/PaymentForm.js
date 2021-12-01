import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import DatePicker from '@mui/lab/DatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

export const PaymentForm = ({paymentInfo, setPaymentInfo, errorMessage}) => {
  const [value, setValue] = React.useState(paymentInfo.expiration_date);
  const handleDatePicker = (newValue) => {
    setValue(newValue);
    setPaymentInfo({...paymentInfo, expiration_date: newValue.toISOString().substring(0,10)})
  };
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Payment method
      </Typography>
      <Typography variant="h6" gutterBottom color="red">
        {errorMessage}
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
            defaultValue={paymentInfo.name_on_card}
            onChange={(event) => setPaymentInfo({...paymentInfo, name_on_card: event.target.value})}
            error={errorMessage.length > 0}
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
            defaultValue={paymentInfo.card_number}
            onChange={(event) => setPaymentInfo({...paymentInfo, card_number: event.target.value})}
            error={errorMessage.length > 0}
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
            defaultValue={paymentInfo.csv_code}
            onChange={(event) => setPaymentInfo({...paymentInfo, csv_code: event.target.value})}
            error={errorMessage.length > 0}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
