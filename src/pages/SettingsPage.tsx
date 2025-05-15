import React, { useState, useRef, useEffect } from 'react';
import {
  Title1,
  Text,
  Card,
  CardHeader,
  CardFooter,
  Button,
  Input,
  Label,
  Spinner,
  makeStyles,
  tokens,
  SpinButton,
  CardPreview,
  Toast,
  ToastTitle,
  ToastBody,
  useToastController,
  useId,
  Toaster,
} from '@fluentui/react-components';
import {
  SaveRegular,
  OpenRegular,
} from '@fluentui/react-icons';
import { useAppData } from '../contexts/AppDataContext';

// Create consistent spacing using multiples of 8px
const spacing = {
  xs: '8px',
  s: '16px',
  m: '24px',
  l: '32px',
  xl: '40px',
};

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.l,
    maxWidth: '640px', // More dialog-like width
    margin: '0 auto',
    padding: spacing.m,
  },
  header: {
    marginBottom: spacing.m,
    textAlign: 'center',
  },
  card: {
    marginBottom: spacing.m,
    boxShadow: tokens.shadow8, // Stronger shadow for dialog-like appearance
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
  },
  cardContent: {
    padding: spacing.m,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.m,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
    marginBottom: spacing.s,
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: spacing.s,
    padding: `${spacing.xs} ${spacing.m}`,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: spacing.m,
    marginBottom: spacing.m,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    paddingBottom: spacing.m,
  },
  statItem: {
    textAlign: 'center',
    padding: spacing.s,
    borderRadius: tokens.borderRadiusSmall,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  statValue: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorBrandForeground1,
    lineHeight: '1.2',
  },
  statLabel: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    marginTop: spacing.xs,
  },
  fileInput: {
    display: 'none',
  },
  infoText: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    marginTop: spacing.xs,
  },
  formLabel: {
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: spacing.xs,
  },
  dialogTitle: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    margin: 0,
    padding: `${spacing.s} ${spacing.m}`,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
});

export const SettingsPage: React.FC = () => {
  const styles = useStyles();
  const {
    currentEvent,
    setCurrentEvent,
    stations,
    tests,
    members,
    saveEventToLocalStorage,
    exportEventAsJSON,
    importEventFromJSON,
  } = useAppData();

  // Form state
  const [eventName, setEventName] = useState(currentEvent.event_name);
  const [maxTime, setMaxTime] = useState(currentEvent.max_time.toString());
  const [isLoading, setIsLoading] = useState(false);
  
  // File input reference
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Toast notifications
  const toasterId = useId('toaster');
  const { dispatchToast } = useToastController(toasterId);

  // Update form when currentEvent changes
  useEffect(() => {
    setEventName(currentEvent.event_name);
    setMaxTime(currentEvent.max_time.toString());
  }, [currentEvent]);

  // Show toast notification
  const showToast = (message: string, success: boolean = true) => {
    dispatchToast(
      <Toast>
        <ToastTitle>{success ? 'Success' : 'Error'}</ToastTitle>
        <ToastBody>{message}</ToastBody>
      </Toast>,
      { intent: success ? 'success' : 'error' }
    );
  };

  // Handle saving current configuration (now exports to file)
  const handleSaveConfiguration = () => {
    // Validate inputs
    if (!eventName.trim()) {
      showToast('Event name is required', false);
      return;
    }

    const maxTimeValue = parseInt(maxTime);
    if (isNaN(maxTimeValue) || maxTimeValue <= 0) {
      showToast('Max time must be a positive number', false);
      return;
    }

    // Update the current event with new values
    setCurrentEvent(prev => ({
      ...prev,
      event_name: eventName.trim(),
      max_time: maxTimeValue,
      updated_at: new Date().toISOString(),
    }));

    // Save to localStorage and export to file
    setIsLoading(true);
    setTimeout(() => {
      saveEventToLocalStorage();
      exportEventAsJSON(); // This triggers file download
      setIsLoading(false);
      showToast('Event configuration saved and downloaded');
    }, 300);
  };

  // Handle loading from file (previously "import")
  const handleLoadFromFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Process the selected file for import
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setIsLoading(true);
        setTimeout(() => {
          const success = importEventFromJSON(content);
          setIsLoading(false);
          
          if (success) {
            showToast('Event configuration loaded successfully');
          } else {
            showToast('Failed to load configuration. Invalid format.', false);
          }
        }, 300);
      }
    };
    reader.readAsText(file);
    
    // Reset the file input
    e.target.value = '';
  };

  return (
    <div className={styles.container}>
      {isLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <Spinner size="large" label="Processing..." />
        </div>
      )}
      
      <Title1 className={styles.header}>Event Configuration</Title1>
      
      <Card className={styles.card}>
        <div className={styles.dialogTitle}>Event Settings</div>
        
        <div className={styles.cardContent}>
          <div className={styles.statsContainer}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{stations.length}</div>
              <div className={styles.statLabel}>Stations</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{members.length}</div>
              <div className={styles.statLabel}>Members</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{tests.length}</div>
              <div className={styles.statLabel}>Tests</div>
            </div>
          </div>
          
          <div className={styles.form}>
            <div className={styles.field}>
              <Label htmlFor="eventName" className={styles.formLabel}>Event Name</Label>
              <Input
                id="eventName"
                value={eventName}
                onChange={(e, data) => setEventName(data.value)}
              />
            </div>
            
            <div className={styles.field}>
              <Label htmlFor="maxTime" className={styles.formLabel}>Maximum Time (minutes)</Label>
              <SpinButton
                value={parseInt(maxTime)}
                onChange={(e, data) => {
                  // Ensure the value is valid and convert to string
                  const newValue = data.value || 0;
                  setMaxTime(newValue.toString());
                }}
                min={1}
                step={5}
              />
              <Text size={200} className={styles.infoText}>
                The target maximum duration for any station in the event
              </Text>
            </div>
            
            <Text size={200} className={styles.infoText} style={{ marginTop: spacing.m }}>
              Use the buttons below to save your configuration to a file or load a previously saved configuration.
              When you save, the current event settings, stations, members, and tests will be exported to a file.
            </Text>
          </div>
        </div>
        
        <div className={styles.actions}>
          <Button 
            appearance="secondary"
            icon={<OpenRegular />}
            onClick={handleLoadFromFile}
          >
            Load from File
          </Button>
          <input 
            type="file"
            ref={fileInputRef}
            className={styles.fileInput}
            accept=".json"
            onChange={handleFileSelect}
          />
          <Button 
            appearance="primary"
            icon={<SaveRegular />}
            onClick={handleSaveConfiguration}
          >
            Save to File
          </Button>
        </div>
      </Card>
      
      <Toaster toasterId={toasterId} />
    </div>
  );
}; 