"use client"
import React, {useState, useEffect} from "react"
import {Card, CardContent, Grid, TextField, Button, Container, Box, Typography, Toolbar, Paper} from "@mui/material"
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs" 
import { DateRange, LocalizationProvider} from "@mui/x-date-pickers-pro"
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker"
import {DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo"
import Select from "react-select"
import Navbar from "../components/navbar"
import Sidebar from "../components/sidebar"
import { useRouter } from "next/navigation"

interface Income {
    AMOUNT_TAKEN: number;
    PAYMENT_DATE: Date;
    DESCRIPTION: string;
    I_CATEGORY: string;
}

interface category{
    id: number;
    ID_CATEGORY: number;
    CATEGORY: string;
}



const IncomesForm = () => {
    const [incomeDescription, setIncomeDescription] = useState<string>('')
    const [incomeAmount, setIncomeAmount] = useState<number>();
    const [incomeDate, setIncomeDate] = useState<DateRange<Date>>([null, null])
    const [incomeCategory, setIncomeCategory] = useState<string>('')
    const [formError, setFormError] = useState<string | null>(null)
    const [existingCategories, setExistingCategories] = useState<category[]>([]);
    const router = useRouter()

    const handleSubmit = (event: any) => {
        event.preventDefault()
    
        {/* if the select or dateRangePicker are empty trow an error*/}
        {/* always reset the error to null berfor checking for empty fields*/}
        setFormError(null)
    
        {/* Createing a project with the properties from the fields to store in the db */}
        if (incomeDate[0] == null) {
            setFormError("Please select a date for the project")
            return
        }

        if (incomeDate[1] == null) {
            setFormError("Please select a date for the project")
            return 
        }

        if(incomeAmount == null || incomeAmount < 0){
            setFormError("Please enter the amount spent")
            return
        }
    

        let startDate = incomeDate[0]
        const endDate = incomeDate[1]
        console.log('startDate:', startDate);

    
        const income: Income = {
            DESCRIPTION: incomeDescription,
            PAYMENT_DATE: startDate,
            AMOUNT_TAKEN: incomeAmount,
            I_CATEGORY: incomeCategory
        }
        console.log(income.AMOUNT_TAKEN);
        createIncome(income)
    }

    const createIncome = async(inc: Income)=>{
        try {
          const response = await fetch('/insert-income', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                inc: inc,
                userId: localStorage.getItem('id') 
              })
          
            })
            const data = await response.json();
    
            if (response.ok) {
              alert(data.message);

            } else {
              alert(data.message);
            }
      } catch (error) {
          console.error(error)
      }
    
      }

      useEffect(() => {
        const fetchCategories = async () => {
          try {
            const response = await fetch("/get-categories", {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            });
      
            if (response.ok) {
              const data = await response.json();
      
              const srvCategories = data.incCategories.map((category: any, index: number) => ({
                ...category,
                id: index + 1,
              }));
      
              setExistingCategories(srvCategories);
            } else {
              console.error("Error fetching categories:", response.statusText);
            }
          } catch (error) {
            console.error("Error fetching categories:", error);
          }
        };
      
        fetchCategories();
      }, []);
      
      // Move console.log outside the fetchCategories function to log the updated state
      useEffect(() => {
        console.log("Existing Categories:", existingCategories);
      }, [existingCategories]);

      const page='Income Form';
    

    return (
        <div className="flex">
        <Navbar page={page}/>
        <Sidebar />

        <Box component={Paper} sx={{flexGrow: 1, py: 8}}>
            <Container maxWidth="xl">
                <Toolbar sx={{mt: -5}} />
                <Typography variant="h6" fontWeight={600} sx={{color: '#FFD700', margin: '0', width: '200px',mx: 'auto', my: 'auto'}} align="center">
                    Add Income
                </Typography>
                <Toolbar sx={{mt: -5}}/>
                <Card elevation={5} style={{maxWidth: 450, margin: "0 auto", padding: "30px 5px"}}>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <TextField 
                                        placeholder="Enter the amount you will get"
                                        variant="outlined"
                                        fullWidth
                                        required
                                        onChange={(event:any) => setIncomeAmount(parseInt(event.target.value))}
                                        value={incomeAmount}
                                    />
                                </Grid>
                                <Toolbar sx={{mt: -6}}/>

                                <Grid item xs={12} >
                                    <TextField 
                                        rows={5}
                                        placeholder="Enter an income description"
                                        variant="outlined"
                                        fullWidth
                                        multiline
                                        required
                                        onChange={(event:any) => setIncomeDescription(event.target.value)}
                                        value={incomeDescription}
                                        inputProps={{ maxLength: 255 }}
                                    />
                                </Grid>
                                
                                <Grid item xs={6}>
                                <Box width={400}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DemoContainer components={['DateRangerPicker']}>
                                                <DemoItem label="Select date" component="DateRangePicker">
                                                    <DateRangePicker
                                                        value={incomeDate}
                                                        onChange={(newValue: any) => setIncomeDate(newValue)}
                                                        format="MM/DD/YYYY"
                                                    />
                                                </DemoItem>
                                            </DemoContainer>
                                        </LocalizationProvider>  
                                    </Box> 
                                </Grid>

                                <Toolbar sx={{mt: -8}}/>


                                <Grid item xs={12} sx={{mb: 3, mt: 3}}>
                                        <Select
                                            placeholder="Add Category"
                                            onChange={(event:any) => setIncomeCategory(event.label)}
                                            options={existingCategories.map((Category: { ID_CATEGORY: any; CATEGORY: any }) => {
                                                return ({value: Category.ID_CATEGORY, label: Category.CATEGORY})
                                            })}
                                            instanceId="selectManagerBox"
                                        />
                                </Grid>

                                <Grid item xs={12}>
                                    <Button 
                                        variant="contained" 
                                        fullWidth
                                        type="submit"
                                        className="bg-green-500 hover:bg-green-600"
                                    >
                                        Submit Income
                                    </Button>
                                    {formError && <Typography variant="h6" className="text-red-500 mt-2" align="center">{formError}</Typography>}
                                    
                                </Grid>
                                
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    </div>
    )
}

export default IncomesForm;