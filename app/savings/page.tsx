"use client"
import React, { useEffect, useState } from 'react';
import { Box, Paper, Container, Grid, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, TextField } from '@mui/material';
import ProgressBars from './progressBars';
import Sidebar from '../components/sidebar';
import Navbar from '../components/navbar';
import AddButton from '../components/addButton';

interface saving {
  ID_SAV: number;
  PRESENT_AMOUNT: number;
  TARGET_AMOUNT: number;
  DESCRIPTION: string;
  id: number;
}

const Savings = () => {
  const [savings, setSavings] = useState<saving[]>([]);
  const [user_id, setId] = useState<number | null>(null);
  const [user_FName, setFName] = useState<string | null>(null);
  const [user_LName, setLName] = useState<string | null>(null);
  const [user_email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const useRequireAuth = () => {
      const email = localStorage.getItem('email');
      const first_name = localStorage.getItem('f_name');
      const last_name = localStorage.getItem('l_name');
      const id = Number(localStorage.getItem('id'));

      if (!id) {
        window.location.href = '/login';
      } else {
        setFName(first_name);
        setLName(last_name);
        setEmail(email);
        setId(id);
      }
    };

    useRequireAuth();
  }, []);

  useEffect(() => {
    const fetchSavings = async (user_id: number) => {
      try {
        const response = await fetch('/savings-bars', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id }),
        });

        if (response.ok) {
          const data = await response.json();

          const srvSavings = data.savings.map((saving: any, index: number) => ({
            ...saving,
            id: index + 1,
          }));

          setSavings(srvSavings);
          console.log("srvSavings: ", savings);
        }
      } catch (error) {
        console.error('Error fetching savings:', error);
      }
    };

    if (user_id) {
      fetchSavings(user_id);
    }
  }, [user_id]);

  const deleteSaving = async (id: number, amountPresent: number) => {
    try {
      const response = await fetch(`/delete-saving/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: localStorage.getItem('id'),
          amount: amountPresent,
        }),
      });
  
      if (response.ok) {
        // Saving deleted successfully
        setSavings((prevSavings) => prevSavings.filter((savings) => savings.ID_SAV !== id));
      } else {
        console.error('Failed to delete investment');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [deletingSavingID,setDeletingSavingID] = useState(0);
  const [deletingSavingAmount, setDeletingSavingAmount] = useState(0);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  const handleDeleteSaving = async (id: number, amount: number): Promise<void> => {
    setDeletingSavingID(id);
    setDeletingSavingAmount(amount);
    setDeleteConfirmationOpen(true);
  };

  
  const handleConfirmationChoice = (confirmed: boolean) => {
    if (confirmed) {
        // Delete the saving
        deleteSaving(deletingSavingID, deletingSavingAmount);

    }
    // Reset confirmation-related state variables
    setDeletingSavingID(0);
    setDeleteConfirmationOpen(false);
  };

  const addAmountSaving = async (id: number, amountPresent: number, targetAmount: number, amountAdded: number) => {
    try {
      const response = await fetch(`/add-saving-amount/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: localStorage.getItem('id'),
          amount: amountPresent,
          targetAmount:targetAmount,
          amountAdded: amountAdded,
        }),
      });
  
      if (response.ok) {
        // saving deleted successfully
      } else {
        console.error('Failed to delete saving');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [addValue, setAddValue] = useState(0);
  const [addSavingID,setAddID] = useState(0);
  const [addPresentAmount, setAddPresentAmount] = useState(0);
  const [addTargetAmount, setAddTargetAmount] = useState(0);
  const [addConfirmationOpen, setAddConfirmationOpen] = useState(false);

  const handleAddSaving = async (id: number, amountPresent: number, targetAmount: number): Promise<void> => {
    setAddID(id);
    setAddPresentAmount(amountPresent);
    setAddTargetAmount(targetAmount);
    setAddConfirmationOpen(true);
  };

  
  const handleConfirmationChoiceAdd = (confirmed: boolean) => {
    if (confirmed) {
      console.log("addValue", addValue);
      addAmountSaving(addSavingID, addPresentAmount, addTargetAmount, addValue);

    }

    // Reset confirmation-related state variables
    setAddID(0);
    setAddConfirmationOpen(false);
  };

  const takeAmountSaving = async (id: number, amountPresent: number, targetAmount: number, amountAdded: number) => {
    try {
      const response = await fetch(`/take-saving-amount/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: localStorage.getItem('id'),
          amount: amountPresent,
          targetAmount:targetAmount,
          amountTook: amountAdded,
        }),
      });
  
      if (response.ok) {
        // saving deleted successfully
      } else {
        console.error('Failed to delete saving');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [takeValue, setTakeValue] = useState(0);
  const [takeSavingID, setTakeID] = useState(0);
  const [takePresentAmount, setTakePresentAmount] = useState(0);
  const [takeTargetAmount, setTakeTargetAmount] = useState(0);
  const [takeConfirmationOpen, setTakeConfirmationOpen] = useState(false);

  const handleTakeSaving = async (id: number, amountPresent: number, targetAmount: number): Promise<void> => {
    setTakeID(id);
    setTakePresentAmount(amountPresent);
    setTakeTargetAmount(targetAmount);
    setTakeConfirmationOpen(true);
  };

  
  const handleConfirmationChoiceTake = (confirmed: boolean) => {
    if (confirmed) {
      console.log("takeValue", takeValue);
      takeAmountSaving(takeSavingID, takePresentAmount, takeTargetAmount, takeValue);

    }

    // Reset confirmation-related state variables
    setTakeID(0);
    setTakeConfirmationOpen(false);
  };

  const page: string = 'Savings';
  const form: string = 'savingsForm';

  return (
    <div className="flex">
      <Navbar page={page} />
      <Sidebar />
      <AddButton form = {form} />
      <Box component={Paper} sx={{flexGrow: 1, height: '100vh', pt: 16, pl: 12, pr: 2, backgroundColor: 'white', overflow: 'auto'}}>
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            {savings.map((saving) => (
              <Grid item xs={12} sm={12} md={12} lg={12} key={saving.id} className="max-w-screen-lg mx-auto p-4 border-4 border-solid border-yellow-500 my-3">
                <ProgressBars
                  sx={{ height: '100%' }}
                  description={saving.DESCRIPTION}
                  present_amount={saving.PRESENT_AMOUNT}
                  target_amount={saving.TARGET_AMOUNT}
                  id_sav={saving.ID_SAV}
                  onDelete={() => handleDeleteSaving(saving.ID_SAV, saving.PRESENT_AMOUNT)}
                  onAdd={() => handleAddSaving(saving.ID_SAV, saving.PRESENT_AMOUNT, saving.TARGET_AMOUNT)}
                  onTake={() => handleTakeSaving(saving.ID_SAV, saving.PRESENT_AMOUNT, saving.TARGET_AMOUNT)}

                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

            {/* Delete confirmation dialog */}
          <Dialog open={deleteConfirmationOpen} onClose={() => handleConfirmationChoice(false)}>
        <DialogTitle>Delete Saving</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Are you sure you want to delete this saving?</Typography>

        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleConfirmationChoice(true)}>Delete</Button>
          <Button onClick={() => handleConfirmationChoice(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Add confirmation dialog with input field */}
      <Dialog open={addConfirmationOpen} onClose={() => handleConfirmationChoiceAdd(false)}>
        <DialogTitle>Add an amount</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Are you sure you want to add this amount?</Typography>
          <TextField
            label="Amount"
            type="number"
            value={addValue}
            onChange={(e: any) => setAddValue(parseInt(e.target.value))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleConfirmationChoiceAdd(true)}>Add amount</Button>
          <Button onClick={() => handleConfirmationChoiceAdd(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

       {/* Take confirmation dialog with input field */}
       <Dialog open={takeConfirmationOpen} onClose={() => handleConfirmationChoiceTake(false)}>
        <DialogTitle>Take an amount</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Are you sure you want to take this amount?</Typography>
          <TextField
            label="Amount"
            type="number"
            value={takeValue}
            onChange={(e: any) => setTakeValue(parseInt(e.target.value))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleConfirmationChoiceTake(true)}>Take amount</Button>
          <Button onClick={() => handleConfirmationChoiceTake(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
      
      
    </div>
  );
};

export default Savings;