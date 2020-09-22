import React, {useState} from 'react';
import FaqHeader from './FaqHeader';
import FaqQuestion from './FaqQuestion';
import { FAQS } from '@components/common/FaqContent.js';

const Faq = () => {
  const [searchTerm, updateSearch] = useState("");
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
              <React.Fragment>
                  {searchTerm.trim() === "" ? (
                      <React.Fragment>
                          <h4>Frequently Asked Questions (FAQ)</h4>
                          {FAQS.map((row, i) => {
                              return (
                                  <div key={i} className="faq-question-holder">
                                      <FaqQuestion
                                          question={row.question}
                                          answer={row.answer}
                                      />
                                  </div>
                              );
                          })}
                      </React.Fragment>
                  ) : (
                      <React.Fragment>
                          <h4>
                              {resultCount} result(s) for '{searchTerm}'
                          </h4>
                          {searchResults.map((row, i) => {
                              return (
                                  <div key={i} className="faq-question-holder">
                                      <FaqQuestion
                                          question={row.question}
                                          answer={row.answer}
                                      />
                                  </div>
                              );
                          })}
                      </React.Fragment>
                  )}
                  ;
              </React.Fragment>
          </div>
      </div>
  );
}

export default Faq;