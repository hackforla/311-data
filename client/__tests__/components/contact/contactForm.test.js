import ContactForm from '@components/contact/ContactForm'
// import App from '@root/App'
import { create } from 'react-test-renderer'
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

describe("My first snapshot test", ()=>{
    test('testing ContactForm', ()=>{
        const initialState = {
            ui: {
                displayFeedbackSuccess: false,
                error: {
                    isOpen: false,
                  }
            }            
        }
        const mockStore = configureStore()
        let store = mockStore(initialState)

        let tree = create(
            <Provider store={store}>
                <ContactForm />
            </Provider>
        )
        // let tree = create(<App />)
        expect(tree.toJSON()).toMatchSnapshot();
    })
})