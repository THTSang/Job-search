import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import LinearProgress, { type LinearProgressProps } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

interface LogoutProgressModalProps {
  open: boolean;
  onComplete: () => void;
  duration?: number; // Duration in milliseconds, default 1500ms
}

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary' }}
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

function LogoutProgressModal({ open, onComplete, duration = 1500 }: LogoutProgressModalProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!open) {
      setProgress(0);
      return;
    }

    const intervalTime = 50; // Update every 50ms
    const increment = (100 * intervalTime) / duration;

    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + increment;
        if (newProgress >= 100) {
          clearInterval(timer);
          // Small delay before calling onComplete for visual feedback
          setTimeout(() => {
            onComplete();
          }, 100);
          return 100;
        }
        return newProgress;
      });
    }, intervalTime);

    return () => {
      clearInterval(timer);
    };
  }, [open, duration, onComplete]);

  return (
    <Modal
      open={open}
      aria-labelledby="logout-progress-modal"
      aria-describedby="logout-progress-description"
      disableEscapeKeyDown
    >
      <Box sx={modalStyle}>
        <Typography id="logout-progress-modal" variant="h6" component="h2" sx={{ mb: 2 }}>
          Đang đăng xuất...
        </Typography>
        <LinearProgressWithLabel value={progress} />
      </Box>
    </Modal>
  );
}

export { LogoutProgressModal };
