import React, {useState} from 'react';
import FaqHeader from './FaqHeader';
import FaqQuestion from './FaqQuestion';
import { FAQS } from '@components/common/FaqContent.js';

const Faq = () => {
  const [searchTerm, updateSearch] = useState("");

  return (
  <div className="faq-311">
    <FaqHeader updateSearch={updateSearch}/>
    <div className="faq-main-section">
      <h4>Frequently Asked Questions (FAQ)</h4>
      <React.Fragment>
        {(searchTerm === "") ? (
            
              FAQS.map((row, i) => {
                return (
                <div key={i} className="faq-question-holder">
                  <FaqQuestion question={row.question} answer={row.answer} />
                </div>
                )
              })
            
        ) : (
          
            FAQS.map((row, i) => {
              const question = row.question.toLowerCase();
              if(question.match(`${searchTerm}`)) {
                return (
                <div key={i} className="faq-question-holder">
                  <FaqQuestion question={row.question} answer={row.answer} />
                </div>
                )
              }

            })
          
        )};
      </React.Fragment>
    </div>  
  </div>
  );
}

export default Faq;