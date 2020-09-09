import React, {useState} from 'react';
import FaqHeader from './FaqHeader';
import FaqMainSection from './FaqMainSection'

const Faq = () => {
  const [searchTerm, updateSearch] = useState("");

  return (
  <div className="faq-311">
    <FaqHeader updateSearch={updateSearch}/>
    <FaqMainSection searchTerm={searchTerm}/>
  </div>
  );
}

export default Faq;