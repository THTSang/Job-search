import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface PaginationControlProps {
  currentPage: number; // 0-based index
  totalPages: number;
  totalElements?: number;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
  pageSize?: number;
  color?: 'primary' | 'secondary' | 'standard';
  size?: 'small' | 'medium' | 'large';
}

export default function PaginationControl({
  currentPage,
  totalPages,
  totalElements,
  onPageChange,
  showInfo = true,
  pageSize = 10,
  color = 'primary',
  size = 'medium'
}: PaginationControlProps) {
  if (totalPages <= 1) return null;

  // MUI Pagination uses 1-based index, our API uses 0-based
  const handleChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    onPageChange(page - 1); // Convert back to 0-based for API
  };

  // Calculate display range
  const startItem = totalElements ? currentPage * pageSize + 1 : 0;
  const endItem = totalElements ? Math.min((currentPage + 1) * pageSize, totalElements) : 0;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1.5,
        mt: 3,
        mb: 2,
      }}
    >
      <Stack spacing={2}>
        <Pagination
          count={totalPages}
          page={currentPage + 1} // Convert to 1-based for MUI
          onChange={handleChange}
          color={color}
          size={size}
          showFirstButton
          showLastButton
          sx={{
            '& .MuiPaginationItem-root': {
              fontWeight: 500,
            },
          }}
        />
      </Stack>
      
      {showInfo && totalElements !== undefined && (
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontSize: '0.875rem',
          }}
        >
          Hiển thị {startItem}-{endItem} / {totalElements} kết quả
        </Typography>
      )}
    </Box>
  );
}
