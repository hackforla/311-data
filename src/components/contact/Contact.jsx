import React from 'react';
import ContactImage from './ContactImage';
import ContactIntro from './ContactIntro';
import ContactForm from './ContactForm';

// uncomment About and remove slice limit from Pin map

const Contact = () => (
  <div className="contact-311">
    <ContactImage />
    <ContactIntro />
    <ContactForm />
  </div>
);

export default Contact;
