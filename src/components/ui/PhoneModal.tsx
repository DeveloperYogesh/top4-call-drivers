'use client';

import { formatPhoneNumber, isValidPhoneNumber } from '@/utils/helpers';
import { Close, Phone, Verified } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

interface PhoneModalProps {
  open: boolean;
  onClose: () => void;
  phoneNumber: string;
  onPhoneNumberChange: (phone: string) => void;
}

export default function PhoneModal({
  open,
  onClose,
  phoneNumber,
  onPhoneNumberChange,
}: PhoneModalProps) {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [serverOTPForDev, setServerOTPForDev] = useState('');

  const handleClose = () => {
    setStep('phone');
    setOtp('');
    setError('');
    setServerOTPForDev('');
    onClose();
  };

  const handlePhoneSubmit = async () => {
    if (!isValidPhoneNumber(phoneNumber)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://top4mobileapp.vbsit.in/api/V1/booking/sendOTP', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileno: phoneNumber }),
      });
      const data = await response.json();

      if (response.ok && data.status === 'success') {
        // In development, backend may return OTP for easy testing
        if (data.otp) setServerOTPForDev(data.otp);
        setStep('otp');
        setError('');
      } else {
        setError(data.message || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async () => {
    if (otp.length !== 4) {
      setError('Please enter a valid 4-digit OTP');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileno: phoneNumber, otp }),
      });
      const data = await response.json();

      if (response.ok && data.status === 'success') {
        handleClose();
        alert('Phone number verified successfully! Proceeding with booking...');
      } else {
        setError(data.message || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError('Failed to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://top4mobileapp.vbsit.in/api/V1/booking/sendOTP', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileno: phoneNumber }),
      });
      const data = await response.json();
      if (response.ok && data.status === 'success') {
        if (data.otp) setServerOTPForDev(data.otp);
        alert('OTP resent successfully');
      } else {
        setError(data.message || 'Failed to resend OTP. Please try again.');
      }
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {step === 'phone' ? <Phone color="primary" /> : <Verified color="primary" />}
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {step === 'phone' ? 'Enter Phone Number' : 'Verify OTP'}
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {step === 'phone' ? (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              We'll send you an OTP to verify your phone number
            </Typography>
            
            <TextField
              fullWidth
              label="Phone Number"
              placeholder="Enter 10-digit phone number"
              value={phoneNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                onPhoneNumberChange(value);
                setError('');
              }}
              error={!!error}
              helperText={error || 'Enter your 10-digit mobile number'}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    +91
                  </InputAdornment>
                ),
              }}
              inputProps={{
                maxLength: 10,
                pattern: '[0-9]*',
              }}
            />
          </Box>
        ) : (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              We've sent a 4-digit OTP to {formatPhoneNumber(phoneNumber)}
            </Typography>
            
            {serverOTPForDev && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Demo OTP: {serverOTPForDev}
              </Alert>
            )}
            
            <TextField
              fullWidth
              label="Enter OTP"
              placeholder="4-digit OTP"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setOtp(value);
                setError('');
              }}
              error={!!error}
              helperText={error || 'Enter the 4-digit OTP sent to your phone'}
              inputProps={{
                maxLength: 6,
                pattern: '[0-9]*',
                style: { textAlign: 'center', fontSize: '1.2rem', letterSpacing: '0.5rem' },
              }}
            />
            
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button
                variant="text"
                onClick={handleResendOTP}
                disabled={isLoading}
                size="small"
              >
                Resend OTP
              </Button>
            </Box>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={step === 'phone' ? handlePhoneSubmit : handleOTPSubmit}
          disabled={
            isLoading ||
            (step === 'phone' ? phoneNumber.length !== 10 : otp.length !== 6)
          }
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
          sx={{ minWidth: 120 }}
        >
          {isLoading ? 'Please wait...' : step === 'phone' ? 'Send OTP' : 'Verify OTP'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

