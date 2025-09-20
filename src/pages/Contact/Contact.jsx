import React from 'react';
import { ToastContainer } from 'react-toastify';
import TextHeading from '@components/layout/TextHeading';
import ContentBody from '@components/layout/ContentBody';
import ContactIntro from '@components/contact/ContactIntro';
import ContactForm from '@components/contact/ContactForm';

import 'react-toastify/dist/ReactToastify.css';

function Contact() {
  return (
    <>
      <div>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
      <div>
        <TextHeading>Contact Us</TextHeading>
        <ContentBody>
          <ContactIntro />
          <ContactForm />
        </ContentBody>
      </div>
    </>
  );
}

export default Contact;
