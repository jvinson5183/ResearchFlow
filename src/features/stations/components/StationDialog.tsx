import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogContent,
  DialogActions,
  Button,
  Input,
  Switch,
  Field,
  makeStyles,
  tokens,
  DialogOpenChangeEvent,
  DialogOpenChangeData,
} from '@fluentui/react-components';
import { Station } from '../types';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  error: {
    color: tokens.colorPaletteRedForeground1,
    fontSize: tokens.fontSizeBase200,
    marginTop: tokens.spacingVerticalXS,
  },
});

interface StationDialogProps {
  open: boolean;
  station?: Station;
  onOpenChange: (event: DialogOpenChangeEvent, data: DialogOpenChangeData) => void;
  onSubmit: (data: { name: string; terminal_id?: string; pin?: string }) => void;
}

export const StationDialog: React.FC<StationDialogProps> = ({ 
  open, 
  station, 
  onOpenChange, 
  onSubmit 
}) => {
  const styles = useStyles();
  const [name, setName] = useState('');
  const [terminalId, setTerminalId] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    pin?: string;
    confirmPin?: string;
  }>({});

  // Reset form when dialog opens/closes or station changes
  useEffect(() => {
    if (station) {
      setName(station.name);
      setTerminalId(station.terminal_id || '');
      setIsLocked(!!station.pin);
      setPin(station.pin || '');
      setConfirmPin(station.pin || '');
    } else {
      setName('');
      setTerminalId('');
      setIsLocked(false);
      setPin('');
      setConfirmPin('');
    }
    setErrors({});
  }, [open, station]);

  const handleSubmit = () => {
    const newErrors: {
      name?: string;
      pin?: string;
      confirmPin?: string;
    } = {};

    // Validate name
    if (!name.trim()) {
      newErrors.name = 'Station name is required';
    }

    // Validate PIN if terminal is locked
    if (isLocked) {
      if (pin.length < 4) {
        newErrors.pin = 'PIN must be at least 4 digits';
      }
      if (pin !== confirmPin) {
        newErrors.confirmPin = 'PINs do not match';
      }
    }

    setErrors(newErrors);

    // Submit if no errors
    if (Object.keys(newErrors).length === 0) {
      onSubmit({
        name,
        terminal_id: terminalId || undefined,
        pin: isLocked ? pin : undefined,
      });
      onOpenChange({} as DialogOpenChangeEvent, { open: false } as DialogOpenChangeData);
    }
  };

  const handleCancel = () => {
    onOpenChange({} as DialogOpenChangeEvent, { open: false } as DialogOpenChangeData);
  };

  const dialogTitle = station ? 'Edit Station' : 'Add Station';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogSurface>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <div className={styles.form}>
            <Field 
              label="Name" 
              required
              validationMessage={errors.name}
              validationState={errors.name ? 'error' : 'none'}
            >
              <Input
                value={name}
                onChange={(e, data) => setName(data.value)}
                placeholder="Enter station name"
              />
            </Field>

            <Field label="Terminal ID">
              <Input
                value={terminalId}
                onChange={(e, data) => setTerminalId(data.value)}
                placeholder="Enter terminal ID (optional)"
              />
            </Field>

            <Field label="Terminal Lock">
              <Switch
                checked={isLocked}
                onChange={(e, data) => setIsLocked(data.checked)}
                label="Enable PIN protection"
                role="switch"
              />
            </Field>

            {isLocked && (
              <>
                <Field 
                  label="PIN" 
                  required={isLocked}
                  validationMessage={errors.pin}
                  validationState={errors.pin ? 'error' : 'none'}
                >
                  <Input
                    type="password"
                    value={pin}
                    onChange={(e, data) => setPin(data.value)}
                    placeholder="Enter PIN (minimum 4 digits)"
                  />
                </Field>

                <Field 
                  label="Confirm PIN" 
                  required={isLocked}
                  validationMessage={errors.confirmPin}
                  validationState={errors.confirmPin ? 'error' : 'none'}
                >
                  <Input
                    type="password"
                    value={confirmPin}
                    onChange={(e, data) => setConfirmPin(data.value)}
                    placeholder="Confirm PIN"
                  />
                </Field>
              </>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button appearance="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button appearance="primary" onClick={handleSubmit}>
            {station ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </DialogSurface>
    </Dialog>
  );
}; 