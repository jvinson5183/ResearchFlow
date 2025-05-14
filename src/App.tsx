import React from 'react';
import { FluentProvider } from '@fluentui/react-components';
import { researchFlowTheme } from './styles/theme';
import { Layout } from './components/Layout/Layout';

function App() {
  return (
    <FluentProvider theme={researchFlowTheme}>
      <Layout>
        {/* Content for the main area of the layout */}
        <div style={{ padding: '20px' }}>
          <h1>Welcome to ResearchFlow</h1>
          <p>Application is using the custom Radix-based theme and basic layout.</p>
          {/* Example of using a theme color directly for verification - can be removed later */}
          <div 
            style={{
              marginTop: '20px', 
              padding: '10px', 
              backgroundColor: researchFlowTheme.colorNeutralBackground2, 
              color: researchFlowTheme.colorNeutralForeground1
            }}
          >
            This box uses theme colors: Background2 and Foreground1.
          </div>
          <div 
            style={{
              marginTop: '20px', 
              padding: '10px', 
              backgroundColor: researchFlowTheme.colorBrandBackground, 
              color: researchFlowTheme.colorBrandForeground2
            }}
          >
            This box uses brand colors: BrandBackground and BrandForeground2.
          </div>
        </div>
      </Layout>
    </FluentProvider>
  );
}

export default App;
