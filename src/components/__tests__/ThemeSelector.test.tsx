import React from 'react';
import { render, screen, fireEvent } from '../../__tests__/test-utils';
import ThemeSelector from '../ThemeSelector';
import { ThemeProvider } from '../../contexts/ThemeContext';

describe('ThemeSelector Component', () => {
  it('renders theme selector with light and dark options', () => {
    render(
      <ThemeProvider>
        <ThemeSelector />
      </ThemeProvider>,
      { needsProviders: false }
    );

    expect(screen.getByText('Theme:')).toBeInTheDocument();
    expect(screen.getByLabelText(/light/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/dark/i)).toBeInTheDocument();
  });

  it('has light theme selected by default', () => {
    render(
      <ThemeProvider>
        <ThemeSelector />
      </ThemeProvider>,
      { needsProviders: false }
    );

    const lightRadio = screen.getByLabelText(/light/i) as HTMLInputElement;
    const darkRadio = screen.getByLabelText(/dark/i) as HTMLInputElement;

    expect(lightRadio.checked).toBe(true);
    expect(darkRadio.checked).toBe(false);
  });

  it('switches to dark theme when dark option is selected', () => {
    render(
      <ThemeProvider>
        <ThemeSelector />
      </ThemeProvider>,
      { needsProviders: false }
    );

    const darkRadio = screen.getByLabelText(/dark/i);
    fireEvent.click(darkRadio);

    expect(darkRadio).toBeChecked();
    expect(screen.getByLabelText(/light/i)).not.toBeChecked();
  });

  it('switches back to light theme when light option is selected', () => {
    render(
      <ThemeProvider>
        <ThemeSelector />
      </ThemeProvider>,
      { needsProviders: false }
    );

    const darkRadio = screen.getByLabelText(/dark/i);
    const lightRadio = screen.getByLabelText(/light/i);

    // Switch to dark first
    fireEvent.click(darkRadio);
    expect(darkRadio).toBeChecked();

    // Switch back to light
    fireEvent.click(lightRadio);
    expect(lightRadio).toBeChecked();
    expect(darkRadio).not.toBeChecked();
  });
});
