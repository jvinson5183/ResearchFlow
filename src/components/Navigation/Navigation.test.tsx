import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { FluentProvider } from '@fluentui/react-components';
import { MemoryRouter } from 'react-router-dom';
import { researchFlowTheme } from '../../styles/theme';
import { Navigation } from './Navigation';

// Mock a basic theme for testing if not all theme properties are used by Navigation directly
// or wrap with the actual FluentProvider and theme if complex tokens are used.

describe('Navigation Component', () => {
  const renderWithThemeAndRouter = (ui: React.ReactElement, initialEntries: string[] = ['/']) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <FluentProvider theme={researchFlowTheme}>
          {ui}
        </FluentProvider>
      </MemoryRouter>
    );
  };

  it('renders all navigation items as links', () => {
    renderWithThemeAndRouter(<Navigation />);

    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /members/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /tests/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /chat/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /reports/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /settings/i })).toBeInTheDocument();
  });

  it('renders the button within the active link', () => {
    renderWithThemeAndRouter(<Navigation />, ['/members']); 
    const membersLink = screen.getByRole('link', { name: /members/i });
    expect(membersLink).toBeInTheDocument();

    const membersButton = within(membersLink).getByRole('button');
    expect(membersButton).toBeInTheDocument();
  });

  // Add more tests here, e.g., for click behavior (though this involves routing later)
});

// Custom within helper removed 