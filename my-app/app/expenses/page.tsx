"use client"
import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
  Grid,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Paper
} from '@mui/material';
import { DataGrid, GridRowParams, gridClasses } from "@mui/x-data-grid";
import ExpenseActions from "./expenseActions";
import AddButton from "../components/addButton";

const Expenses = () => {
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

  interface expense {
    id: number;
    ID_EXP: number; 
    AMOUNT_PAID: number;
    FINAL_DATE: string;
    DESCRIPTION: string;
    E_CATEGORY: string;
  }

  interface category{
    id: number;
    ID_CATEGORY: number;
    CATEGORY: string;
  }

  const [incCategories, setIncCategories] = useState<category[]>([]);
  const [expCategories, setExpCategories] = useState<category[]>([]);
  const [expenses, setExpenses] = useState<expense[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/get-categories", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
  
        if (response.ok) {
          const data = await response.json();
  
          const srvIncCategories = data.incCategories.map((category: any, index: number) => ({
            ...category,
            id: index + 1,
            type: 'Income', // Add a 'type' property for income categories
          }));
  
          setIncCategories(srvIncCategories);
  
          const srvExpCategories = data.expCategories.map((category: any, index: number) => ({
            ...category,
            id: index + 1,
            type: 'Expense', // Add a 'type' property for expense categories
          }));
  
          setExpCategories(srvExpCategories);

        } else {
          console.error("Error fetching categories:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
  
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchExpenses = async (user_id: number) => { 
      try {
        const response = await fetch("/card-expenses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id }),
        });

        if (response.ok) {
          const data = await response.json();

          const srvExpenses = data.expenses.map((expense: any, index: number) => ({
            ...expense,
            id: index + 1,
          }));

          setExpenses(srvExpenses);
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    if (user_id) {
      fetchExpenses(user_id);
    }
  }, [user_id]);


  const page: string = "Expenses";
  

  const [deletingExpenseID,setDeletingExpenseID] = useState(0);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  const handleDeleteExpense = async (id: number): Promise<void> => {
    setDeletingExpenseID(id);
    setDeleteConfirmationOpen(true);
    //console.log('am ajuns la handleDeleteExpense!');
  };

  
  const handleConfirmationChoice = (confirmed: boolean) => {
    //console.log('am ajuns aproape la if confirmed acm il incerc');
    if (confirmed) {
        // Delete the expense
        //console.log('am ajuns la if confirmed')
        deleteExpense(deletingExpenseID);

    }
    // Reset confirmation-related state variables
    setDeletingExpenseID(0);
    setDeleteConfirmationOpen(false);
  };


  const deleteExpense = async (id: number) => {
    try {
      console.log('am ajuns la deleteExpense!');
      const response = await fetch(`/delete-expense/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: localStorage.getItem('id'),
        }),
      });
      if (response.ok) {
        // Expense deleted successfully
        setExpenses((prevExpenses) => prevExpenses.filter((expenses) => expenses.ID_EXP !== id));
      } else {
        console.error('Failed to delete expense');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleEdit = async (row: any) => {
    try {
      console.log('handleEdit called');
      setExpenses((prevExpenses) => {
        const updatedExpenses = [...prevExpenses];
        const { E_CATEGORY, DESCRIPTION, FINAL_DATE, AMOUNT_PAID, ID_EXP } = row;
        console.log("E_CATEGORY, DESCRIPTION, FINAL_DATE, AMOUNT_PAID, ID_EXP: ", E_CATEGORY, DESCRIPTION, FINAL_DATE, AMOUNT_PAID, ID_EXP);
        const rowIndex = updatedExpenses.findIndex((expense) => expense.ID_EXP === ID_EXP);
  
        if (rowIndex > -1) {
          updatedExpenses[rowIndex] = {
            ...updatedExpenses[rowIndex],
          };
  
          console.log('Updated State:', updatedExpenses);
  
          fetch(`/update-expense`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              E_CATEGORY: E_CATEGORY,
              DESCRIPTION: DESCRIPTION,
              FINAL_DATE: FINAL_DATE,
              AMOUNT_PAID: AMOUNT_PAID,
              ID_EXP: ID_EXP,
              user_id: localStorage.getItem('id'),
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log("Response data:", data);
              if (data.ok) {
                alert(data.message);
              } else {
                alert(`Something went wrong: ${data.message}`);
              }
            })
            .catch((error) => {
              console.error('An error occurred while updating expense:', error);
            });
        }
  
        return prevExpenses;
      });
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  
  const columns = [
    { field: "id", headerName: "ID", width: 60, },
    { field: "E_CATEGORY", headerName: "Category", width: 170, 
    editable: true, 
    type: 'singleSelect', 
    valueOptions: expCategories.map(category => category.CATEGORY), },
    { field: "DESCRIPTION", headerName: "Description", width: 170, editable: true },
    {
      field: "FINAL_DATE",
      headerName: "Date",
      width: 240, editable: true,
      valueFormatter: (params: { value: string | number | Date; }) => {
        const date = new Date(params.value);
        return new Intl.DateTimeFormat("eu", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }).format(date);
      },
    },
    { field: "AMOUNT_PAID", headerName: "Amount", width: 140, editable: true },
    { field: "actions", 
    headerName: "Actions", 
    type:'actions', 
    renderCell:(params: any) =>(
      <ExpenseActions {...{params, onDelete: handleDeleteExpense, onEdit:handleEdit}}/>
      ),
    },
  ];

  const form: string="expensesForm";


  return (
    <div className="flex">
      <Navbar page={page} />
      <Sidebar />
      <AddButton form={form} />
      <Box
        component={Paper}
        sx={{ flexGrow: 1, height: "100vh", pt: 12, pl: 12, pr: 2, backgroundColor: "white" }}
      >
        <Container maxWidth="xl">
          <DataGrid 
            columns={columns}
            rows={expenses}
            getRowId={(row: { id: any; }) => row.id}
            editMode="row"
            
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                }
              }
            }}
            
            pageSizeOptions={[5, 25, 50]}
            getRowSpacing={(params: any) => ({
              top: params.isFirstVisible ? 0 : 5,
              bottom: params.isLastVisible ? 0 : 5
            })}
            sx={{
              '& .MuiDataGrid-row': {
                '&:hover': {
                  background: 'linear-gradient(135deg, #FFD700 50%, red 50%)',
                  transform: 'scale(1.05)',
                },
              },
            }}
          />
        </Container>
      </Box>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteConfirmationOpen} onClose={() => handleConfirmationChoice(false)}>
        <DialogTitle>Delete Expense</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Are you sure you want to delete this expense?</Typography>

        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleConfirmationChoice(true)}>Delete</Button>
          <Button onClick={() => handleConfirmationChoice(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

    </div>
  );
};


export default Expenses;

