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


interface Category{
    id: number;
    ID_CATEGORY: number;
    CATEGORY: string;
}



const CategoryForm = () => {
    const [categoryName, setCategoryName] = useState<string>('')
    const [formError, setFormError] = useState<string | null>(null)
    const [existingCategories, setExistingCategories] = useState<Category[]>([]);
    const [type, setType] = useState<{ [key: string]: number }>({ Expense: 1, Income: 2 });
    const [selectedType, setSelectedType] = useState<string>('');
    const router = useRouter()

    const handleSubmit = (event: any) => {
        event.preventDefault()

        setFormError(null)

        const categoryUpper = categoryName.toUpperCase();

        for (const category of existingCategories) {
            if (categoryUpper === category.CATEGORY) {
                setFormError("This category already exists");
                return;
            }
        }

    
        console.log(categoryUpper);
        createCategory(categoryUpper,  selectedType);
    }

    const createCategory = async(cat: string, selectedType: string)=>{
        try {
          const response = await fetch('/insert-category', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                cat: cat,
                userId: localStorage.getItem('id'),
                type: selectedType 
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
      
              const srvCategories = data.categories.map((category: any, index: number) => ({
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

      const page='Category Form';
    

    return (
        <div className="flex">
        <Navbar page={page}/>
        <Sidebar />

        <Box component={Paper} sx={{flexGrow: 1, py: 8, backgroundColor: "white", height: '100vh', overflow: 'auto'}}>
            <Container maxWidth="xl">
                <Toolbar sx={{mt: -5}} />
                <Typography variant="h6" fontWeight={600} sx={{color: '#FFD700'}} align="center">
                    Add Category
                </Typography>
                <Toolbar sx={{mt: -5}}/>
                <Card elevation={5} style={{maxWidth: 450, margin: "0 auto", padding: "30px 5px"}}>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={1}>

                                <Grid item xs={12} >
                                    <TextField 
                                        rows={5}
                                        placeholder="Enter a category name"
                                        variant="outlined"
                                        fullWidth
                                        multiline
                                        required
                                        onChange={(event:any) => setCategoryName(event.target.value)}
                                        value={categoryName}
                                        inputProps={{ maxLength: 255 }}
                                        sx={{borderColor: '#FFD700'}}
                                    />
                                </Grid>

                                <Toolbar sx={{mt: -8}}/>


                                <Grid item xs={12} sx={{ mb: 3, mt: 3 }}>
                                  <Select
                                    placeholder="Category type"
                                    onChange={(selectedOption: any) => setSelectedType(selectedOption.label)}
                                    options={Object.keys(type).map((key) => ({
                                      value: type[key],
                                      label: key,
                                    }))}
                                    instanceId="selectManagerBox"
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
                                        Submit Category
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

export default CategoryForm;