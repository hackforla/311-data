import React, { useState } from 'react';
import { FAQS } from '@components/common/FaqContent';
import FaqHeader from './FaqHeader';
import FaqQuestion from './FaqQuestion';

const Faq = () => {
  const [searchTerm, updateSearch] = useState('');
  const [resultCount, updateCount] = useState(0);
  const [searchResults, updateResults] = useState([]);

  return (
    <div className="faq-311">
      <FaqHeader
        updateSearch={updateSearch}
        updateCount={updateCount}
        updateResults={updateResults}
      />
      <div className="faq-main-section">
        <>
          {searchTerm.trim() === '' ? (
            <>
              <h4>Frequently Asked Questions (FAQ)</h4>
              {FAQS.map(row => (
                <div
                  key={`${row.question}`}
                  className="faq-question-holder"
                >
                  <FaqQuestion
                    question={row.question}
                    answer={row.answer}
                  />
                </div>
              ))}
              ;
            </>
          ) : (
            <>
              <h4>
                {resultCount}
                {' '}
                result(s) for
                {' \''}
                {searchTerm}
                {'\''}
              </h4>
              {searchResults.map(row => (
                <div
                  key={`${row.question}`}
                  className="faq-question-holder"
                >
                  <FaqQuestion
                    question={row.question}
                    answer={row.answer}
                  />
                </div>
              ))}
            </>
          )}
        </>
      </div>
    </div>
  );
};

export default Faq;
