import React from 'react';
import { ToastContainer } from 'react-toastify';
import TextHeading from '@components/common/TextHeading';
import ContentBody from '@components/common/ContentBody';
import ContactIntro from './ContactIntro';
import ContactForm from './ContactForm';

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
        <ContentBody maxWidth="684px">
          <ContactIntro />
          <ContactForm />
        </ContentBody>
      </div>
    </>
  );
}

export default Contact;
