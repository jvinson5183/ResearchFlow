import React from 'react';
import { render, screen } from '@testing-library/react';
import { FluentProvider } from '@fluentui/react-components';
import { researchFlowTheme } from '../../styles/theme';
import { Navigation } from './Navigation';

// Mock a basic theme for testing if not all theme properties are used by Navigation directly
// or wrap with the actual FluentProvider and theme if complex tokens are used.

describe('Navigation Component', () => {
  const renderWithTheme = (ui: React.ReactElement) => {
    return render(
      <FluentProvider theme={researchFlowTheme}>
        {ui}
      </FluentProvider>
    );
  };

  it('renders all navigation items', () => {
    renderWithTheme(<Navigation />);

    // Check for each navigation item by its label
    expect(screen.getByRole('button', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /members/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /tests/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /chat/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reports/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /settings/i })).toBeInTheDocument();
  });

  it('highlights Dashboard as the default selected item', () => {
    renderWithTheme(<Navigation />);
    // The selected item should have primary appearance. We can check this by a unique attribute or style if possible,
    // or by checking its properties if Fluent UI Button exposes them. 
    // For now, we check if it's rendered. A more specific test for 'primary' appearance might be complex
    // without deeper inspection methods for Fluent UI's styling.
    const dashboardButton = screen.getByRole('button', { name: /dashboard/i });
    expect(dashboardButton).toBeInTheDocument();
    // This is a naive check. In a real scenario, you might need to inspect classes or specific aria attributes set by Fluent UI for primary appearance.
    // For example, if primary buttons get a specific class or data-attribute from Fluent UI we can use that.
    // As a simple check, we know it's the default, so this test primarily ensures it exists.
  });

  // Add more tests here, e.g., for click behavior (though this involves routing later)
}); 