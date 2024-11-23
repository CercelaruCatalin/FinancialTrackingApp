import { Box, IconButton, Tooltip } from '@mui/material';
import EditAttributesIcon from '@mui/icons-material/EditAttributes';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';


interface IncomeActionsProps {
    onDelete: (id: number, amount: number) => Promise<void>;
    incomeId: number;
    incomeAmount: number;
  }
  
  const IncomeActions = (props: IncomeActionsProps) => {
    const { onDelete, incomeId, incomeAmount } = props;
  
    const handleDeleteClick = async () => {
      await onDelete(incomeId, incomeAmount);
      //console.log('sunt la incomeActions la onDelete', incomeId, incomeAmount);
    };
  
    return (
      <Box>
        <Tooltip title="Delete this income">
          <IconButton onClick={handleDeleteClick}>
            <DeleteOutlineIcon sx={{ color: '#FFD700', fontSize: 32}} />
          </IconButton>
        </Tooltip>
      </Box>
    );
  };
  
  export default IncomeActions;
  