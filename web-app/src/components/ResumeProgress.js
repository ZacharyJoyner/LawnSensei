import React from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import { Restore, Clear } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useOnboardingProgress from '../hooks/useOnboardingProgress';

const ResumeProgress = () => {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const { clearProgress } = useOnboardingProgress();
  const hasProgress = !!localStorage.getItem('lawn_sensei_onboarding_progress');

  if (!hasProgress) return null;

  const handleResume = () => {
    const savedProgress = JSON.parse(localStorage.getItem('lawn_sensei_onboarding_progress'));
    
    // Determine which page to resume to based on saved data
    if (savedProgress.user) {
      navigate('/onboarding/account');
    } else if (savedProgress.sections?.length > 0) {
      navigate('/onboarding/review');
    } else if (savedProgress.mapCenter) {
      navigate('/onboarding/property');
    } else if (savedProgress.address) {
      navigate('/onboarding');
    }
    setOpen(false);
  };

  const handleClear = () => {
    clearProgress();
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        startIcon={<Restore />}
        onClick={() => setOpen(true)}
        sx={{ ml: 2 }}
      >
        Resume Progress
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Resume Your Progress</DialogTitle>
        <DialogContent>
          <Typography>
            Would you like to continue where you left off with your lawn setup?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            startIcon={<Clear />}
            onClick={handleClear}
            color="error"
          >
            Clear Progress
          </Button>
          <Button
            variant="contained"
            onClick={handleResume}
            color="primary"
          >
            Resume
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ResumeProgress; 