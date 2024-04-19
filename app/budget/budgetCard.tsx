import { Card, CardContent, Typography, Grid } from '@mui/material';

const BudgetCard = (props: any) => {
  const { sx, text, value } = props;

  const formattedValue = value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'RON', // Assuming the currency is Romanian Leu, you can adjust it accordingly
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).replace(/,/g, '.');

  return (
    <Card
    sx={{
        ...sx, // Spread the custom styles passed as props
        bgcolor: 'white',
        justifyContent: 'center',
        display: 'flex',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        border: "4px solid #FCD34D",
    }}
    elevation={5}
    >
      <CardContent>
        <Grid container spacing={3} textAlign="center">
          <Grid item xs={12} md={12} lg={12}>
            <Typography variant="h3" fontWeight={800}>
              {text}
            </Typography>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <Typography variant="h1" color={"#00A663"} fontWeight={1200}>
              {formattedValue}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default BudgetCard;
