"use client"
import React, {useEffect, useState} from "react"
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";
import {
  Box, 
  Toolbar, 
  Container, 
  Typography,
  Grid,
  Button,
  Divider
 } 
from "@mui/material";
import PieChart from "../components/pieChart";
import BudgetCard from "./budgetCard";
import IncomesChart from "../components/incomeChart";
import ExpensesAreaChart from "../components/expensesAreaChart";



const Budget = () =>{

  const [budget, setBudget] = useState(0);
  const [user_id, setId] = useState<number | null>(null);
  const [user_FName, setFName] = useState<string | null>(null);
  const [user_LName, setLName] = useState<string | null>(null);
  const [user_email, setEmail] = useState<string | null>(null);


  const useRequireAuth = () => {
    useEffect(() => {
      const id = Number(localStorage.getItem("id"));

      if (!id) {
        window.location.href = "/login";
      } else {
        setId(id);
      }
    }, []);

    return null;
  };

  useRequireAuth();


      useEffect(() => {
        const fetchBudget = async (user_id: number) => {
          try {

    
            const response = await fetch('/get-budget', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: user_id
              }),
            });
    
            if (response.ok) {
              const data = await response.json();

              setBudget(data.budget);
              console.log("get-budget fetch"+data.budget);
            } else {
              console.error('Failed to fetch statistics');
            }
          } catch (error) {
            console.error('An error occurred:', error);
          }
        };
    
        if (user_id) {
          fetchBudget(user_id);
        }

      }, [user_id]);
    
      const budgetCards = [
        {
          text: 'Balance',
          value: budget,
        },
      ];

      const page: string = "Budget";

      return (
        <div className="flex">
          <Navbar page="Budget" />
          <Sidebar />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              pt: 12,
              pl: 12,
              pr: 2,
              pb: 2, // Add padding bottom if needed
              backgroundColor: "white",
              flexDirection: "row",
              height: '100vh', // Set the height to 100% of the viewport height
              overflow: 'auto', // Enable scrolling if content overflows
            }}
          >
            <Container maxWidth="xl">
              <Grid container spacing={3}>
                <Toolbar sx={{ mt: -8 }} />
                {budgetCards.map((elem) => {
                  return (
                    <Grid item xs={12} sm={12} lg={12} key={elem.text}>
                      <BudgetCard
                        sx={{ height: '100%' }}
                        text={elem.text}
                        value={elem.value}
                      />
                    </Grid>
                  );
                })}
                <Grid item xs={12} md={6} lg={6}>
                  <PieChart sx={{ height: '100%' }} />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <IncomesChart sx={{ height: '100%' }} />
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <ExpensesAreaChart sx={{ height: '100%' }} />
                </Grid>
              </Grid>
            </Container>
          </Box>
        </div>
      );
    };

export default Budget;



