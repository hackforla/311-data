import React from 'react';
import { ToastContainer } from 'react-toastify';
import ContactImage from './ContactImage';
import ContactIntro from './ContactIntro';
import ContactForm from './ContactForm';

import 'react-toastify/dist/ReactToastify.css';

const Contact = () => (
  <>
    <div>
      <ToastContainer />
    </div>
    <div>
      <ContactImage>Contact Us</ContactImage>
      <ContactIntro />
      <ContactForm />
    </div>
  </>
);

export default Contact;
