import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// Note: FluentProvider and Layout are part of App's rendering tree.
// If they have complex side effects or context, those might need to be mocked
// or provided in a more sophisticated test setup for isolated page testing.

describe('App Routing', () => {
  const renderWithRouter = (initialEntries: string[] = ['/']) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <App /> {/* App already includes FluentProvider and Layout */}
      </MemoryRouter>
    );
  };

  it('redirects from / to /dashboard and renders DashboardPage', async () => {
    renderWithRouter(['/']);
    // Check for text unique to DashboardPage
    await waitFor(() => {
      expect(screen.getByText(/this is the dashboard page/i)).toBeInTheDocument();
    });
  });

  it('renders MembersPage on /members route', async () => {
    renderWithRouter(['/members']);
    await waitFor(() => {
      // Check for the title rendered by MemberList
      expect(screen.getByRole('heading', { name: /Members/i })).toBeInTheDocument();
      // Instead of looking for a specific member name which might change,
      // check for a table or the add member button which should always be present
      expect(screen.getByRole('button', { name: /Add Member/i })).toBeInTheDocument();
    });
  });

  it('renders ChatPage on /chat route', async () => {
    renderWithRouter(['/chat']);
    await waitFor(() => {
      expect(screen.getByText(/this is the chat page/i)).toBeInTheDocument();
    });
  });

  it('renders ReportsPage on /reports route', async () => {
    renderWithRouter(['/reports']);
    await waitFor(() => {
      expect(screen.getByText(/this is the reports page/i)).toBeInTheDocument();
    });
  });

  it('renders SettingsPage on /settings route', async () => {
    renderWithRouter(['/settings']);
    await waitFor(() => {
      expect(screen.getByText(/this is the settings page/i)).toBeInTheDocument();
    });
  });

  it('renders Page Not Found for an unknown route', async () => {
    renderWithRouter(['/some/unknown/route']);
    await waitFor(() => {
      expect(screen.getByText(/page not found/i)).toBeInTheDocument();
    });
  });

  it('navigates to the Tests page and renders test content', async () => {
    renderWithRouter(['/tests']);
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Tests/i })).toBeInTheDocument();
      // Check for the "Add Test" button specific to TestsPage
      expect(screen.getByRole('button', { name: /Add Test/i })).toBeInTheDocument();
    });
  });

  // Add tests for other routes as they are implemented (e.g., /chat, /reports, /settings)
}); 