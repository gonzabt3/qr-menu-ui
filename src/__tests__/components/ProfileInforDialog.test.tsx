// __tests__/ProfileInfoDialog.test.tsx
import React from 'react';
import { render } from '@testing-library/react';
import { screen, fireEvent } from '@testing-library/react';
import ProfileInfoDialog from '../../pages/profile/ProfileInfoDialog';

describe('ProfileInfoDialog', () => {
  it('renders the ProfileInfoDialog component', () => {
    render(<ProfileInfoDialog isFirsLogin={true} user={{ name: 'John Doe', email: 'john.doe@example.com' }} isOpen={true} setOpen={() => {}} />);
    expect(screen.getByText('Guardar')).toBeInTheDocument();
  });

  it('calls handleUpdate when the save button is clicked', () => {
    const handleUpdate = jest.fn();
    render(<ProfileInfoDialog isFirsLogin={true} user={{ name: 'John Doe', email: 'john.doe@example.com' }} isOpen={true} setOpen={() => {}} />);
    fireEvent.click(screen.getByText('Guardar'));
    expect(handleUpdate).toHaveBeenCalled();
  });
});