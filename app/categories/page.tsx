"use client"
import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";
import {
  Box,
  Toolbar,
  Container,
  Typography,
  Grid,
  Button,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import CategoryActions from "./categoryAct";
import AddButton from "../components/addButton";



const Categories = () => {

  interface category{
    id: number;
    ID_CATEGORY: number;
    CATEGORY: string;
  }

  const [incCategories, setIncCategories] = useState<category[]>([]);
  const [expCategories, setExpCategories] = useState<category[]>([]);
  const useRequireAuth = () => {
    const [user_FName, setFName] = useState<string | null>(null);
    const [user_LName, setLName] = useState<string | null>(null);
    const [user_email, setEmail] = useState<string | null>(null);

    useEffect(() => {
      const email = localStorage.getItem("email");
      const first_name = localStorage.getItem("l_name");
      const last_name = localStorage.getItem("f_name");

      if (!email) {
        window.location.href = "/login";
      } else {
        setFName(first_name);
        setLName(last_name);
        setEmail(email);
      }
    }, []);

    return null;
  };

  useRequireAuth();

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

  const [deletingCategoryID,setDeletingCategoryID] = useState(0);
  const [deletingCategoryType,setDeletingCategoryType] = useState<string>('');
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  const handleDeleteCategory = async (id: number, type: string): Promise<void> => {
    setDeletingCategoryID(id);
    setDeletingCategoryType(type);
    setDeleteConfirmationOpen(true);
    //console.log('am ajuns la handleDeleteCategory!');
  };

  
  const handleConfirmationChoice = (confirmed: boolean) => {
    //console.log('am ajuns aproape la if confirmed acm il incerc');
    if (confirmed) {
        // Delete the categories
        //console.log('am ajuns la if confirmed');
        deleteCategory(deletingCategoryID, deletingCategoryType);
    }
    // Reset confirmation-related state variables
    setDeletingCategoryID(0);
    setDeletingCategoryType('');
    setDeleteConfirmationOpen(false);
  };


  const deleteCategory = async (id: number, type: string) => {
    try {
      const response = await fetch(`/delete-category/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: localStorage.getItem('id'),
          type: type,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Category deleted successfully

        alert(data.message);

        if (type === 'Income') {
          setIncCategories((prevCategories) => prevCategories.filter((category) => category.ID_CATEGORY !== id));
        } else if (type === 'Expense') {
          setExpCategories((prevCategories) => prevCategories.filter((category) => category.ID_CATEGORY !== id));
        }
      } else {

        alert(data.message);
        console.error('Failed to delete category');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };



  const handleEditCategory = async (row: any) => {
    try {
      const { CATEGORY, ID_CATEGORY, type } = row;
      const categoryUpper = CATEGORY.toUpperCase();
      console.log("CATEGORY, ID_CATEGORY, type: ", categoryUpper, ID_CATEGORY, type);
      if(type === 'Expense'){
      console.log('handleEditCategory called');
      setExpCategories((prevExpCategories) => {
        const updatedExpCategories = [...prevExpCategories];
        const rowIndex = updatedExpCategories.findIndex((category) => category.ID_CATEGORY === ID_CATEGORY);
  
        if (rowIndex > -1) {
          updatedExpCategories[rowIndex] = {
            ...updatedExpCategories[rowIndex],
          };
  
          console.log('Updated expense categories:', updatedExpCategories);
  
          fetch(`/update-category`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: type,
              cID: ID_CATEGORY,
              name: categoryUpper,
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
              console.error('An error occurred while updating expense category:', error);
            });
        }
  
        return prevExpCategories;
      });

    }else if(type === 'Income'){
      console.log('handleEditCategory called');
      setExpCategories((prevIncCategories) => {
        const updatedIncCategories = [...prevIncCategories];
        const rowIndex = updatedIncCategories.findIndex((category) => category.ID_CATEGORY === ID_CATEGORY);
  
        if (rowIndex > -1) {
          updatedIncCategories[rowIndex] = {
            ...updatedIncCategories[rowIndex],
          };
  
          console.log('Updated income categories:', updatedIncCategories);
  
          fetch(`/update-category`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: type,
              cID: ID_CATEGORY,
              name: categoryUpper,
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
              console.error('An error occurred while updating income category:', error);
            });
        }
  
        return prevIncCategories;
      });
    }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const page: string = "Categories";
  const form: string="categoriesForm";

  const columns = [
    { field: "id", headerName: "ID", width: 60 },
    { field: "CATEGORY", headerName: "Category", width: 270, editable: true },
    {
      field: "actions",
      headerName: "Actions",
      type: 'actions',
      renderCell: (params: any) => (
        <CategoryActions {...{ params, onDelete: handleDeleteCategory, onEdit: handleEditCategory }} />
      ),
    },
  ];

  return (
    <div className="flex">
      <Navbar page={page} />
      <Sidebar />
      <AddButton form={form} />
      <Box
        component={Paper}
        sx={{
          flexGrow: 1,
          height: "100vh",
          pt: 12,
          pl: 12,
          pr: 2,
          backgroundColor: "white",
          overflow: 'auto',
        }}
      >
        <Container maxWidth="xl">

          {/* Incomes categories */}
          <DataGrid 
            columns={columns}
            rows={incCategories}
            getRowId={(row: { id: any; }) => row.id}
            
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
                  background: 'linear-gradient(135deg, white 50%, #FFD700 50%)',
                  transform: 'scale(1.05)',
                },
              },
            }}
          />

          {/* Add a little space between the two DataGrids */}
          <Box mt={2} />

          {/* Expenses categories */}
          <DataGrid 
            columns={columns}
            rows={expCategories}
            getRowId={(row: { id: any; }) => row.id}
            
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
                  background: 'linear-gradient(135deg, white 50%, #FFD700 50%)',
                  transform: 'scale(1.05)',
                },
              },
            }}
          />
        </Container>
      </Box>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteConfirmationOpen} onClose={() => handleConfirmationChoice(false)}>
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Are you sure you want to delete this category?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleConfirmationChoice(true)}>Delete</Button>
          <Button onClick={() => handleConfirmationChoice(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

    </div>
  );
};

export default Categories;