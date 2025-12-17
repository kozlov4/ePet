import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import InputField from '../../../components/ui/InputField';

describe('InputField', () => {
    const mockOnChange = jest.fn();

    const defaultProps = {
        label: 'Test Label',
        name: 'testName',
        value: '',
        onChange: mockOnChange,
    };

    beforeEach(() => {
        mockOnChange.mockClear();
    });

    it('renders the label and input correctly', () => {
        render(<InputField {...defaultProps} />);

        expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toHaveAttribute('name', 'testName');
    });

    it('displays the correct value', () => {
        render(<InputField {...defaultProps} value="Hello World" />);

        expect(screen.getByRole('textbox')).toHaveValue('Hello World');
    });

    it('calls onChange when input value changes', () => {
        render(<InputField {...defaultProps} />);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'New Value' } });

        expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it('supports different input types', () => {
        render(<InputField {...defaultProps} type="email" />);

        const input = screen.getByLabelText('Test Label');
        expect(input).toHaveAttribute('type', 'email');
    });

    it('applies required attribute when required prop is true', () => {
        render(<InputField {...defaultProps} required={true} />);

        expect(screen.getByRole('textbox')).toBeRequired();
    });
});
