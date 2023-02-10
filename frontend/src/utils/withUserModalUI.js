import { fireEvent, render } from "@testing-library/react";

export default function withUserModalUI(browser) {
  const METHOD = {
    'text': { true: browser.getByText, false: browser.queryByText },
    'labelText': { true: browser.getByLabelText, false: browser.queryByLabelText },
    'placeholderText': { true: browser.getByPlaceholderText, false: browser.queryByPlaceholderText },
    'testId': { true: browser.getByTestId, false: browser.queryByTestId },
  };

  const UI = {
    firstName: (raise = true) => METHOD['labelText'][raise]('First Name'),
    lastName: (raise = true) => METHOD['labelText'][raise]('Last Name'),
    country: (raise = true) => METHOD['labelText'][raise]('Country'),
    newCountry: (raise = true) => METHOD['placeholderText'][raise]('Enter new country name'),
    dateOfBirth: (raise = true) => METHOD['labelText'][raise]('Date of Birth'),
    saveButton: (raise = true) => METHOD['testId'][raise]('save-button'),
    cancelButton: (raise = true) => METHOD['text'][raise]('Cancel'),
  };

  function selectAddNewCountry() {
    const country = UI.country();
    // get last option
    const lastOption = country.options[country.options.length - 1];
    fireEvent.change(UI.country(), { target: { value: lastOption.value } });
  }
  return {
    ...browser,
    UI: {
      ...UI,
      // helper method to create a new country
      createCountry: (countryName) => {
        selectAddNewCountry();
        fireEvent.change(UI.newCountry(), { target: { value: countryName } });
      },
      selectAddNewCountry,
    }
  };
};

export function renderingWithUserModalUI(Component) {
  return (props = {}) => {
    const browser = render(<Component {...props} />);
    return withUserModalUI(browser);
  }
}