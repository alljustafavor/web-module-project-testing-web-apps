import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from "../ContactForm";


test('renders without errors', () => {
    render(<ContactForm />);
    const header = screen.getByText(/contact form/i);
    const first_name = screen.getByLabelText(/first name/i);
    const last_name = screen.getByLabelText(/last name/i);
    const email = screen.getByLabelText(/email/i);
    const custom_message = screen.getByLabelText(/message/i);
    const submit_button = screen.getByRole('button');
    const error_element = screen.queryAllByTestId('error');
    expect(header).toBeInTheDocument();
    expect(first_name).toBeInTheDocument();
    expect(last_name).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(custom_message).toBeInTheDocument();
    expect(submit_button).toBeInTheDocument();
    expect(error_element).toHaveLength(0);
});

test('renders the contact form header', () => {
    render(<ContactForm />);
    const header = screen.getByText(/contact form/i);
    expect(header).toBeInTheDocument();
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm />);
    const first_name = screen.getByLabelText(/first name/i);
    userEvent.type(first_name, "Joe");
    
    await waitFor(() => {
        const error_element = screen.queryAllByTestId('error');
        expect(error_element).toHaveLength(1);
        expect(error_element).not.toHaveLength(0);
    });
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm />);
    const submit_button = screen.getByRole('button');
    userEvent.click(submit_button);

    await waitFor(() => {
        const error_element = screen.queryAllByTestId('error');
        expect(error_element).toHaveLength(3);
    });
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm />);
    const first_name = screen.getByLabelText(/first name/i);
    const last_name = screen.getByLabelText(/last name/i);
    const submit_button = screen.getByRole('button');
    userEvent.type(first_name, "Joseph");
    userEvent.type(last_name, "Noblett");
    userEvent.click(submit_button);

    await waitFor(() => {
        const error_element = screen.queryAllByTestId('error');
        expect(error_element).toHaveLength(1);
        expect(error_element).not.toHaveLength(0);
    });
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm />);
    const email = screen.getByLabelText(/email/i);
    userEvent.type(email, "invalid-email");

    await waitFor(() => {
        const error_element = screen.queryAllByTestId('error');
        expect(error_element).toHaveLength(1);
        expect(error_element).not.toHaveLength(0);
        expect(error_element[0]).toHaveTextContent("email must be a valid email address.");
    });
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm />);
    const first_name = screen.getByLabelText(/first name/i);
    const email = screen.getByLabelText(/email/i);
    const submit_button = screen.getByRole('button');
    userEvent.type(first_name, "Joseph");
    userEvent.type(email, "bluebill1049@hotmail.com");
    userEvent.click(submit_button);


    await waitFor(() => {
        const error_element = screen.queryAllByTestId('error');
        expect(error_element).toHaveLength(1);
        expect(error_element).not.toHaveLength(0);
        expect(error_element[0]).toHaveTextContent("lastName is a required field");
    });
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm />);
    const first_name = screen.getByLabelText(/first name/i);
    const last_name = screen.getByLabelText(/last name/i);
    const email = screen.getByLabelText(/email/i);
    const submit_button = screen.getByRole('button');
    userEvent.type(first_name, "Joseph");
    userEvent.type(last_name, "Noblett");
    userEvent.type(email, "bluebill1049@hotmail.com");
    userEvent.click(submit_button);

    //display container

    await waitFor(() => {
    
        // Query elements within the displayContainer
        const first_name_display = screen.getByTestId("firstnameDisplay");
        const last_name_display = screen.queryByTestId("lastnameDisplay");
        const email_display = screen.queryByTestId("emailDisplay");
        const message_display = screen.queryByTestId("messageDisplay");
        
        // Check if elements within the displayContainer are in the DOM
        expect(first_name_display).toBeInTheDocument();
        expect(last_name_display).toBeInTheDocument();
        expect(email_display).toBeInTheDocument();
    
        // Check if the message element is not in the DOM
        expect(message_display).toBeNull();
    });
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm />);
    const first_name = screen.getByLabelText(/first name/i);
    const last_name = screen.getByLabelText(/last name/i);
    const email = screen.getByLabelText(/email/i);
    const custom_message = screen.getByLabelText(/message/i);
    const submit_button = screen.getByRole('button');
    userEvent.type(first_name, "Joseph");
    userEvent.type(last_name, "Noblett");
    userEvent.type(email, "bluebill1049@hotmail.com");
    userEvent.type(custom_message, "Hello World!");
    userEvent.click(submit_button);

    await waitFor(() => {
        const first_name_display = screen.getByTestId("firstnameDisplay");
        const last_name_display = screen.queryByTestId("lastnameDisplay");
        const email_display = screen.queryByTestId("emailDisplay");
        const message_display = screen.queryByTestId("messageDisplay");

        expect(first_name_display).toBeInTheDocument();
        expect(last_name_display).toBeInTheDocument();
        expect(email_display).toBeInTheDocument();
        expect(message_display).toBeInTheDocument();
    });
});
