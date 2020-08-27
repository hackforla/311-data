import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';

const FaqQuestion = ({
  question,
  answer,
}) => {

return (
  <React.Fragment>
    <div className="311-faq-question">
      <h4>{question}</h4>
    </div>
    <div className="311-faq-answer">
      {
        Object.entries(answer).map((item) => {
            if(item[0].match(/p/g)){
              return <p> {item[1]} </p>
            } else if(item[0].match(/img/g)){
              return <img src={item[1]} alt="faq-img" />
            }
        })
      }
    </div>
  </React.Fragment>
)

}

export default FaqQuestion;

FaqQuestion.propTypes = {
  question: PropTypes.string,
  answer: PropTypes.object,
}