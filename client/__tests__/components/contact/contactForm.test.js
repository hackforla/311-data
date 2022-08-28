import ContactForm from '@components/contact/ContactForm'
import { create } from 'react-test-renderer'
import { Provider } from 'react-redux';
import store from '@root/redux/store';

describe("My first snapshot test", ()=>{
    test('testing ContactForm', ()=>{
        let tree = create(
            <Provider store={store}>
                <ContactForm />
            </Provider>
        )
        expect(tree.toJSON()).toMatchSnapshot();
    })

})