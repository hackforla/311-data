import React, { useState } from 'react';
import PropTypes from 'proptypes';
import Arrow from '@assets/faq/faq-arrow.svg';

const FaqQuestion = ({
  question,
  answer,
}) => {
  const [showAnswer, updateshowAnswer] = useState('close');
  const toggleAnswer = () => {
    if (showAnswer === 'open') {
      return updateshowAnswer('close');
    }
    return updateshowAnswer('open');
  };

  return (
    <>
      <div className={`${showAnswer}-faq-question faq-question`}>
        <h4>{question}</h4>
        <Arrow
          className="expand-arrow"
          onClick={toggleAnswer}
          onKeyPress={e => {
            const keyPress = e.which || e.keyCode;
            if (keyPress === 13 || keyPress === 32) {
              return toggleAnswer();
            }
            return false;
          }}
          alt="expand-arrow"
          aria-label="Toggle Answer"
          tabIndex="0"
          role="button"
        />
      </div>
      <div className="faq-answer">
        {Object.entries(answer).map(item => {
          if (item[0].match(/p/g)) {
            return (
              <p key={item[1]}>
                {' '}
                {item[1]}
                {' '}
              </p>
            );
          }
          if (item[0].match(/img/g)) {
            return (
              <img
                key={item[1]}
                className={`img-size-${item[1][1]}`}
                src={item[1][0]}
                alt="faq-img"
              />
            );
          }
          if (item[0].match(/h4/g)) {
            return <h4 key={item[1]}>{item[1]}</h4>;
          }
          return false;
        })}
      </div>
    </>
  );
};

export default FaqQuestion;

FaqQuestion.propTypes = {
  question: PropTypes.string.isRequired,
  answer: PropTypes.shape({}).isRequired,
};
