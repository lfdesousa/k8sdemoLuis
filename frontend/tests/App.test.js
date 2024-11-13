// tests/App.test.js
import { render, screen } from '@testing-library/react';
import App from '../src/App';

test('renders JOM Demo Application header', () => {
  render(<App />);
  const headerElement = screen.getByText(/JOM Demo Application/i);
  expect(headerElement).toBeInTheDocument();
});

