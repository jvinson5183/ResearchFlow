import React from 'react';
import { Image } from '@fluentui/react-components';
import logoSrc from '../../assets/researchflow-logo.png'; // Adjusted path

export const Logo: React.FC = () => {
  return (
    <Image
      src={logoSrc}
      alt="ResearchFlow Logo"
      height={40} // You can adjust the size as needed
      // width={150} // Optionally set width if needed, or let height control aspect ratio
    />
  );
}; 