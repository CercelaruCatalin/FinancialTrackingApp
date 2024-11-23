import React from "react";
import { Card, Typography } from "@mui/material";
import IncomeActions from "./incomeActions";

const IncomeCards = (props: any) => {
  const { sx, description, amount, date, category, onDelete, income_id, income_amount } = props;

  // Format the date to DD/MM format
  const formattedDate = new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <Card
      sx={{
        ...sx,
        bgcolor: "#00A663",
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center", // Adjusted alignItems for vertical centering
        justifyContent: "space-between",
        padding: "12px",
        minHeight: "0px", // Adjusted the minHeight for more space
      }}
      elevation={5}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "center"}}>
        {/* Added margin to create space between date and category */}
        <Typography color="#FFD700" variant="h6">
          {formattedDate}
        </Typography>
        <Typography color="#FFD700" variant="h6">
          {category}
        </Typography>
      </div>
      <div style={{ display: "flex", flexDirection: "column", overflowWrap: "break-word"}}>
        {/* Added margin to create space between description and amount */}
        <Typography color="#FFD700" variant="h6" sx={{ maxWidth: "300px" }}>
          {description}
        </Typography>
      </div>
      <div>
        <Typography color="#FFD700" variant="h5" fontWeight={800}>
          +{amount} LEI
        </Typography>
      </div>
      <div>
        <IncomeActions onDelete={onDelete} incomeId={income_id} incomeAmount={income_amount} />
      </div>
    </Card>
  );
};

export default IncomeCards;
