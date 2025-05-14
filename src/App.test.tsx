import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

it('renders welcome message', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  const welcomeElement = screen.getByRole('heading', { name: /Dashboard/i });
  expect(welcomeElement).toBeInTheDocument();
});
