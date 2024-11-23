"use client"
import React, {useEffect, useState} from "react"
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";
import IncomeCards from "./cards";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {
  Box, 
  Toolbar, 
  Container, 
  Typography,
  Grid,
  Button,
  Divider,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Card,
  Stack
 } 
from "@mui/material";
import AddButton from "../components/addButton";


const Incomes = () => {
  const [user_FName, setFName] = useState<string | null>(null);
  const [user_LName, setLName] = useState<string | null>(null);
  const [user_email, setEmail] = useState<string | null>(null);
  const [user_id, setId] = useState<number | null>(null);

  const useRequireAuth = () => {
    useEffect(() => {
      const email = localStorage.getItem("email");
      const first_name = localStorage.getItem("f_name");
      const last_name = localStorage.getItem("l_name");
      const id = Number(localStorage.getItem("id")); // Parse id as a number

      if (!id) {
        window.location.href = "/login";
      } else {
        setFName(first_name);
        setLName(last_name);
        setEmail(email);
        setId(id);
      }
    }, []);

    return null;
  };

  useRequireAuth();

  interface income {
    ID_INCOME: number; 
    AMOUNT_TAKEN: number;
    PAYMENT_DATE: Date;
    DESCRIPTION: string;
    I_CATEGORY: string;
    id: number;
  }

  const [incomes, setIncomes] = useState<income[]>([]);

  useEffect(() => {
    const fetchIncomes = async (user_id: number) => { 
      try {
        const response = await fetch("/card-incomes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id }),
        });

        if (response.ok) {
          const data = await response.json();

          const srvIncomes = data.incomes.map((income: any, index: number) => ({
            ...income,
            id: index + 1,
          }));

          setIncomes(srvIncomes);
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    if (user_id) {
      fetchIncomes(user_id);
    }
  }, [user_id]);

  const cards = incomes.map((incomes, index) => ({
    income_id: incomes.ID_INCOME,
    description: incomes.DESCRIPTION,
    amount: incomes.AMOUNT_TAKEN,
    date: incomes.PAYMENT_DATE,
    category: incomes.I_CATEGORY,
    id: index + 1,
  }));

  

  const deleteIncome = async (id: number, amountGot: number) => {
    try {
      console.log('am ajuns la deleteIncome!', id, ' ', amountGot);
      const response = await fetch(`/delete-income/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: localStorage.getItem('id'),
          amount: amountGot,
        }),
      });
  
      if (response.ok) {
        // Expense deleted successfully
        setIncomes((prevIncomes) => prevIncomes.filter((incomes) => incomes.ID_INCOME !== id));
      } else {
        console.error('Failed to delete expense');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [deletingIncomeID,setDeletingIncomeID] = useState(0);
  const [deletingIncomeAmount, setDeletingIncomeAmount] = useState(0);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  const handleDeleteIncome = async (id: number, amount: number): Promise<void> => {
    setDeletingIncomeID(id);
    setDeletingIncomeAmount(amount);
    setDeleteConfirmationOpen(true);
  };

  
  const handleConfirmationChoice = (confirmed: boolean) => {
    if (confirmed) {
        // Delete the expense
        deleteIncome(deletingIncomeID, deletingIncomeAmount);

    }
    // Reset confirmation-related state variables
    setDeletingIncomeID(0);
    setDeleteConfirmationOpen(false);
  };

    


  const page: string = "Incomes";
  const form: string = "incomesForm";

  return (
    <div className="flex">
      <Navbar page={page} />
      <Sidebar />
      <AddButton form={form} />
      <Box
        component={Paper}
        sx={{ flexGrow: 1, height: "100vh", pt: 12, pl: 12, pr: 2, backgroundColor: "white", overflow: 'auto'}}
      >
        <Container maxWidth="xl">

 {/* Box for column names */}
          <Box sx={{p: 2, mb: 3 }}>
            <Stack direction="row" spacing={3} justifyContent="space-between">
              <Typography color="#FFD700" variant="h4" fontWeight={800} >
                Date & Category
              </Typography>
              <Typography color="#FFD700" variant="h4" fontWeight={800}>
                Description
              </Typography>
              <Typography color="#FFD700" variant="h4" fontWeight={800} paddingLeft={15} paddingRight={3}>
                Amount
              </Typography>
              <Typography color="#FFD700" variant="h4" fontWeight={800}>
                Actions
              </Typography>
              {/* Add other column names as needed */}
            </Stack>
          </Box>

          <Grid container spacing={3}>
            {cards.map((elem) => (
              <Grid item xs={12} sm={12} md={12} lg={12} key={elem.id}>
                <IncomeCards sx={{ height: "100%" }} 
                description={elem.description}
                 amount={elem.amount}
                  date={elem.date}
                 category={elem.category}
                 onDelete={() => handleDeleteIncome(elem.income_id, elem.amount)}
                 income_id={elem.income_id}
                 income_amount={elem.amount}/>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
            {/* Delete confirmation dialog */}
          <Dialog open={deleteConfirmationOpen} onClose={() => handleConfirmationChoice(false)}>
        <DialogTitle>Delete Income</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Are you sure you want to delete this income?</Typography>

        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleConfirmationChoice(true)}>Delete</Button>
          <Button onClick={() => handleConfirmationChoice(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Incomes;



