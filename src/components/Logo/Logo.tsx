import React from 'react';
import { Image } from '@fluentui/react-components';
import logoSrc from '../../assets/researchflow-logo.png'; // Adjusted path
import { makeStyles } from '@fluentui/react-components';

const useStyles = makeStyles({
  logo: {
    width: '180px', // Increase the width
    height: 'auto',
    maxHeight: '50px', // Increase max height
    objectFit: 'contain',
    objectPosition: 'left', // Align to the left
  }
});

export const Logo: React.FC = () => {
  const styles = useStyles();
  
  return (
    <Image
      src={logoSrc}
      alt="ResearchFlow Logo"
      className={styles.logo}
    />
  );
}; 