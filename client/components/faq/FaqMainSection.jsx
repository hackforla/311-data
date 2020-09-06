import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import FaqQuestion from './FaqQuestion';
import {FAQS} from '@components/common/FaqContent.js'
const FaqMainSection = ({

}) => {


  return (
    <div className="faq-main-section">
      <h4>Frequently Asked Questions (FAQ)</h4>
      <React.Fragment>
        {FAQS.map((row, i) => {
            return <div key={i} className="faq-question-holder">
              <FaqQuestion question={row.question} answer={row.answer} />
            </div>
        })}
      </React.Fragment>
    </div>

  );

}

export default FaqMainSection;