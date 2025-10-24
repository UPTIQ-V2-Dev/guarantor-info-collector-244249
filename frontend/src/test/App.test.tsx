import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { App } from '../App';

describe('App', () => {
    it('should render without crashing', () => {
        render(<App />);
        // The app should render the dashboard page initially
        expect(screen.getByText(/Guarantor Dashboard/i)).toBeInTheDocument();
    });
});
