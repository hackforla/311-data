import { describe, expect, it } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "@utils/test-utils";
import FilterMenu from "./FilterMenu";

describe('FilterMenu', () => {
  it('selects/deselects all request types', () => {
    renderWithProviders(<FilterMenu />);

    const requestTypes = screen.getAllByRole('checkbox');
    const allCheckbox = screen.getByLabelText('Select/Deselect All');

    requestTypes.forEach(checkbox => {
      expect(checkbox.checked).toEqual(true);
    });

    fireEvent.click(allCheckbox);
    requestTypes.forEach(checkbox => {
      expect(checkbox.checked).toEqual(false);
    });

    fireEvent.click(allCheckbox);
    requestTypes.forEach(checkbox => {
      expect(checkbox.checked).toEqual(true);
    });
  });
});
