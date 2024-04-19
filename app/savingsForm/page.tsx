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

interface Saving {
    ID_SAV: number;
    PRESENT_AMOUNT: number;
    TARGET_AMOUNT: number;
    DESCRIPTION: string;
}



const SavingsForm = () => {
    const [savingId, setInvId] = useState(0);
    const [savingPresentAmount, setPresentAmount] = useState<number | null>(null);
    const [savingTargetAmount, setTargetAmount] = useState<number | null>(null);
    const [savingDescription, setDescription] = useState<string>('');
    const [formError, setFormError] = useState<string | null>(null);

    const handleSubmit = (event: any) => {
        event.preventDefault()
    
        setFormError(null)
    
        {/* Createing a project with the properties from the fields to store in the db */}

        if(savingPresentAmount == null || savingPresentAmount < 0 || savingTargetAmount == null || savingTargetAmount < savingPresentAmount){
            setFormError("Prestent or target amount incorect!");
            return
        }
    
    
        const saving: Saving = {
            DESCRIPTION: savingDescription,
            PRESENT_AMOUNT: savingPresentAmount,
            TARGET_AMOUNT: savingTargetAmount,
            ID_SAV: savingId
        }
        createSaving(saving)
    }

    const createSaving = async(sav: Saving)=>{
        try {
          const response = await fetch('/insert-saving', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                sav: sav,
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

      const page='Savings Form';
    

    return (
        <div className="flex">
        <Navbar page={page}/>
        <Sidebar />

        <Box component={Paper} sx={{flexGrow: 1, height: '100vh', pt: 16, pl: 12, pr: 2, backgroundColor: 'white', overflow: 'auto'}}>
            <Container maxWidth="xl">
                <Toolbar sx={{mt: -5}} />
                <Typography variant="h6" fontWeight={600} sx={{color: '#FFD700', margin: '0', width: '200px',mx: 'auto', my: 'auto'}} align="center">
                    Add Saving
                </Typography>
                <Toolbar sx={{mt: -5}}/>
                <Card elevation={5} style={{maxWidth: 450, margin: "0 auto", padding: "30px 5px"}}>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <TextField 
                                        placeholder="Enter the amount you want to start on this saving"
                                        variant="outlined"
                                        fullWidth
                                        required
                                        onChange={(event:any) => setPresentAmount(parseInt(event.target.value))}
                                        value={savingPresentAmount}
                                    />
                                </Grid>

                                <Toolbar sx={{mt: -6}}/>

                                <Grid item xs={12} >
                                    <TextField 
                                        rows={5}
                                        placeholder="Enter a saving description"
                                        variant="outlined"
                                        fullWidth
                                        multiline
                                        required
                                        onChange={(event:any) => setDescription(event.target.value)}
                                        value={savingDescription}
                                        inputProps={{ maxLength: 255 }}
                                    />
                                </Grid>

                                <Toolbar sx={{mt: -6}}/>
                                <Grid item xs={12}>
                                    <TextField
                                        placeholder="Enter the amount that you want to get to"
                                        variant="outlined"
                                        fullWidth
                                        required
                                        onChange={(event: any) =>setTargetAmount(event.target.value)}
                                        value={savingTargetAmount}
                                    />

                                </Grid>

                                <Toolbar sx={{mt: -8}}/>

                                <Grid item xs={12}>
                                    <Button 
                                        variant="contained" 
                                        fullWidth
                                        type="submit"
                                        className="bg-green-500 hover:bg-green-600"
                                    >
                                        Submit Saving
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

export default SavingsForm;