import { create } from 'react-test-renderer'
import { Provider } from 'react-redux';
import store from '@root/redux/store';
import {render, screen} from '@utils/test-utils'
import ContactForm from '@components/contact/ContactForm'

describe("ContactForm", ()=>{
    describe("General",()=>{
        test('should display a contact form with all labels', ()=>{
            render(<ContactForm />)
            expect(screen.getByLabelText('First Name *')).toBeTruthy()
            expect(screen.getByLabelText('Last Name *')).toBeTruthy()
            expect(screen.getByLabelText('Email *')).toBeTruthy()
            expect(screen.getByLabelText('Association')).toBeTruthy()
            expect(screen.getByLabelText('Message *')).toBeTruthy()
        })
        test('should initialize with expected values',()=>{
            render(<ContactForm />)
            expect(screen.getByLabelText('First Name *').value).toBe("")
            expect(screen.getByLabelText('Last Name *').value).toBe("")
            expect(screen.getByLabelText('Email *').value).toBe("")
            expect(screen.getByLabelText('Association').value).toBe("")
            expect(screen.getByLabelText('Message *').value).toBe("") 
        })
    })
    describe.skip("Validation",()=>{
        test('should not be able to submit without a first name',()=>{})
        test('should not be able to submit without a last name',()=>{})
        test('should be able to submit without an association',()=>{})
        test('should be able to submit with an association',()=>{})
        test('should not be able to sumit without a message',()=>{})
        test('should not be able to submit with an incorrectly formatted email',()=>{})
        test('should not be able to submit with a blank email',()=>{})
        test('should submit when email is formatted correctly',()=>{})
    })
    describe.skip("Workflow",()=>{
        test('should return the correct loading status upon successful submission',()=>{})
        test('should hide submit button upon sucessful submission',()=>{})
        test('should display a CircularProgress element upon successful submission',()=>{})
        test('should return the proper toast message upon confirmation of successful form submission',()=>{})
        test('should return the proper toast message upon confirmation of failed form submission',()=>{})        
        test('should hide CircularProgress element upon confirmation of successful submission',()=>{})
        test('should show submit button upon confirmation of successful submission',()=>{})
        test.skip('should not be able to submit a blank form',()=>{})
    })
    describe.skip("Helpers",()=>{
        test('validateEmail(email) should return true if a valid email is provided',()=>{})
        test('validateEmail(email) should return false if an invalid email is provided',()=>{})
        test('clearErrors() should reset formValues back to intialFormValues',()=>{})
        test('validateForm() should return true if all required formValues contain proper values',()=>{})
        test('validateForm() should return false if one or more of the formValues contains an improper value',()=>{})


    })

})