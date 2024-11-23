import { Box, IconButton, Tooltip } from '@mui/material';
import EditAttributesIcon from '@mui/icons-material/EditAttributes';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

interface ExpenseActionsProps {
  params: any;
  onDelete: (id: number) => Promise<void>;
  onEdit: (id: number) => Promise<void>;
}

const ExpenseActions = (props: ExpenseActionsProps) => {
  const { params, onDelete, onEdit } = props;
  const{ID_EXP, E_CATEGORY, DESCRIPTION, FINAL_DATE, AMOUNT_PAID} = params.row;

  const handleDeleteClick = async () => {
    await onDelete(ID_EXP);
  };

  const handleEditClick = async () => {
    await onEdit(params.row);
    //console.log('handleEdit called');
  };

  return (
    <Box>
      <Tooltip title="Edit expense details">
        <IconButton onClick={handleEditClick}>
          <EditAttributesIcon sx={{ color: '#00A663', fontSize: 32 }} />
        </IconButton>
      </Tooltip>

      <Tooltip title="Delete this expense">
        <IconButton onClick={handleDeleteClick}>
          <DeleteOutlineIcon sx={{ color: '#FFD700', fontSize: 32 }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ExpenseActions;