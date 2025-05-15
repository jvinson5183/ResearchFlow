import React from 'react';
import { Button, Text, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    padding: '16px',
    marginBottom: '16px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: '4px',
    border: `1px solid ${tokens.colorBrandForeground1}`,
  },
  title: {
    marginBottom: '8px',
    fontWeight: tokens.fontWeightSemibold,
  },
  button: {
    marginTop: '8px',
  }
});

export const ResetAppData: React.FC = () => {
  const styles = useStyles();

  const handleClearLocalStorage = () => {
    localStorage.clear();
    console.log('localStorage cleared');
    alert('localStorage cleared. Refreshing the page...');
    window.location.reload();
  };

  return (
    <div className={styles.container}>
      <Text className={styles.title}>Debug Tools</Text>
      <Text>If you're having issues with the application data, you can reset everything and start fresh.</Text>
      <Button 
        className={styles.button} 
        appearance="primary" 
        onClick={handleClearLocalStorage}
      >
        Clear Storage & Reset App
      </Button>
    </div>
  );
}; 