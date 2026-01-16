import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

interface LoadingSpinnerProps {
  size?: number;
  message?: string;
  fullPage?: boolean;
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'inherit';
}

export default function LoadingSpinner({
  size = 40,
  message,
  fullPage = false,
  color = 'primary'
}: LoadingSpinnerProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        ...(fullPage && {
          minHeight: '60vh',
          width: '100%',
        }),
        ...(!fullPage && {
          padding: 3,
        }),
      }}
    >
      <CircularProgress size={size} color={color} thickness={4} />
      {message && (
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontWeight: 500,
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
}
