import React, {useState} from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import Arrow from '@assets/faq-arrow.svg';

const FaqQuestion = ({
  question,
  answer,
}) => {
const [showAnswer, updateshowAnswer] = useState("close");

const toggleAnswer = () => {
  (showAnswer === "open") ? updateshowAnswer("close") : updateshowAnswer("open");
}

return (
  <React.Fragment>
    <div className={showAnswer + '-faq-question faq-question'}>
      <h4>{question}</h4>
      <Arrow onClick={toggleAnswer} className="expand-arrow" alt="expand-arrow" />
    </div>
    <div className="faq-answer">
      {
        Object.entries(answer).map((item, index) => {
            if(item[0].match(/p/g)){
              return <p key={index}> {item[1]} </p>
            } else if(item[0].match(/img/g)){
              return <img key={index} src={item[1]} alt="faq-img" />
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