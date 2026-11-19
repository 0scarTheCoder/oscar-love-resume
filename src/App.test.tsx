import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  window.location.hash = '';
  // The live panels fetch on mount; keep tests offline.
  (global as any).fetch = jest.fn(() => new Promise(() => {}));
  window.scrollTo = jest.fn();
  (window as any).IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

test('renders the profile with the CV roles in order', () => {
  render(<App />);
  expect(screen.getByRole('heading', { level: 1, name: 'OSCAR LOVE' })).toBeInTheDocument();
  expect(screen.getByText('Data Analyst and Software Developer')).toBeInTheDocument();
  const page = document.body.textContent || '';
  const order = ['Entech Pty Ltd', 'Canetoad AI', 'Hodie Labs', 'Robert Willis Algorithms', 'Private consulting', 'Invest America', 'Vitruvian', 'Theatre Orderly', 'Private Tutor', 'VWA • March 2021'];
  const positions = order.map((name) => page.indexOf(name));
  expect(positions.every((p) => p >= 0)).toBe(true);
  expect([...positions].sort((a, b) => a - b)).toEqual(positions);
});

test('page never mentions EY or stale claims', () => {
  render(<App />);
  const page = document.body.textContent || '';
  expect(page).not.toMatch(/\bEY\b|investment banking|Remote Worldwide|Current GPA|© 2025/i);
});

test('TAILOR PROFILE opens the maintenance page and back returns', async () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'TAILOR PROFILE' }));
  expect(window.location.hash).toBe('#/tailor');
  await act(async () => {
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  });
  expect(screen.getByRole('heading', { name: 'MAINTENANCE IN PROGRESS' })).toBeInTheDocument();
  expect(screen.queryByText('Entech Pty Ltd • March 2026 to present')).not.toBeInTheDocument();
  window.location.hash = '#/';
  await act(async () => {
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  });
  expect(screen.getByRole('heading', { level: 1, name: 'OSCAR LOVE' })).toBeInTheDocument();
});
