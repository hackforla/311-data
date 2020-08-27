import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import FaqQuestion from './FaqQuestion';
const FaqMainSection = ({

}) => {
  const faqs = [ 
    {
      question: "What are Neighborhood Councils",
      answer: {
        p1: `LA’s 99 Neighborhood Councils together form the grassroots level of the Los Angeles 
        City government. The system was created to connect LA’s diverse communities to City Hall,
        and was established in 1999 by an amendment to the City Charter. While Neighborhood Council
        board members are volunteers, they are public officials elected toffice by the members of their community.`, 
        p2: "Please read more about NCs on https://empowerla.org/about-neighborhood-councils/",
      },
    },
  ]

  return (
    <div className="faq-main-section">
      <h4>Frequently Asked Questions (FAQ)</h4>
      <React.Fragment>
        {faqs.map((row, i) => {
            return <div key={i} className="faq-question-holder">
              <FaqQuestion question={row.question} answer={row.answer} />
            </div>
        })}
      </React.Fragment>
    </div>

  );

}

export default FaqMainSection;