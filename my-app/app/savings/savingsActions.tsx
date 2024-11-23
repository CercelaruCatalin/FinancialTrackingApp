import { Box, IconButton, Tooltip } from '@mui/material';
import EditAttributesIcon from '@mui/icons-material/EditAttributes';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { IoIosAddCircle } from "react-icons/io";
import { FaMinusCircle } from "react-icons/fa";

interface SavingsActionsProps {
    onDelete: (id: number, amount: number) => Promise<void>;
    onAdd: (id: number, presentAmount: number, targetAmount: number) => Promise<void>;
    onTake: (id: number, presentAmount: number, targetAmount: number) => Promise<void>;
    savingId: number;
    savingPresentAmount: number;
    savingTargetAmount: number;
  }
  
  const SavingsActions = (props: SavingsActionsProps) => {
    const { onDelete, onAdd, onTake, savingId, savingPresentAmount, savingTargetAmount } = props;
  
    const handleDeleteClick = async () => {
      await onDelete(savingId, savingPresentAmount);

    };

    const handleAddClick = async () => {
      await onAdd(savingId, savingPresentAmount, savingTargetAmount);

    };

    const handleTakeClick = async () => {
      await onTake(savingId, savingPresentAmount, savingTargetAmount);

    };
  
    return (
      <Box>
        <Tooltip title="Delete this saving">
          <IconButton onClick={handleDeleteClick}>
            <DeleteOutlineIcon sx={{ color: '#FFD700', fontSize: 32}} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Add money to this saving">
          <IconButton onClick={handleAddClick} style={{ color: '#00A663', fontSize: 32 }}>
            <IoIosAddCircle />
          </IconButton>
        </Tooltip>
        <Tooltip title="Take money from this saving">
          <IconButton onClick={handleTakeClick} style={{ color: '#FF0000', fontSize: 26 }}>
            <FaMinusCircle />
          </IconButton>
        </Tooltip>
      </Box>
    );
  };
  
  export default SavingsActions;
  