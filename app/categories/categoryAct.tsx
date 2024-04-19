
import { Box, IconButton, Tooltip } from '@mui/material';
import EditAttributesIcon from '@mui/icons-material/EditAttributes';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

interface CategoryActionsProps {
  params: any;
  onDelete: (id: number, type: string) => Promise<void>;
  onEdit: (id: number) => Promise<void>;
}

const CategoryActions = (props: CategoryActionsProps) => {
  const { params, onDelete, onEdit } = props;
  const { ID_CATEGORY, type } = params.row; 

  const handleDeleteClick = async () => {
    await onDelete(ID_CATEGORY, type); 
    //console.log('sunt la categoryActions!', ID_CATEGORY, type);
  };

  const handleEditClick = async () => {
    await onEdit(params.row);
    //console.log('handleEdit called');
  };

  return (
    <Box>
      <Tooltip title="Edit category details">
        <IconButton onClick={handleEditClick}>
          <EditAttributesIcon sx={{ color: '#00A663' }} />
        </IconButton>
      </Tooltip>

      <Tooltip title="Delete this category">
        <IconButton onClick={handleDeleteClick}>
          <DeleteOutlineIcon sx={{ color: '#FFD700' }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default CategoryActions;
