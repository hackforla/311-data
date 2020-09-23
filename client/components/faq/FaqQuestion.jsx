import React, { useState } from 'react';
import PropTypes from 'proptypes';
import Arrow from '@assets/faq/faq-arrow.svg';

const FaqQuestion = ({
  question,
  answer,
}) => {
  const [showAnswer, updateshowAnswer] = useState('close');
  const toggleAnswer = () => {
    (showAnswer === 'open') ? updateshowAnswer('close') : updateshowAnswer('open');
    return;
  };
    return (
        <>
            <div className={`${showAnswer}-faq-question faq-question`}>
                <h4>{question}</h4>
                <Arrow
                    className="expand-arrow"
                    onClick={toggleAnswer}
                    onKeyPress={e => { e.key === 13 & toggleAnswer(); }}
                    alt="expand-arrow"
                    aria-label="Toggle Answer"
                    tabIndex="0"
                    role="button"
                />
            </div>
            <div className="faq-answer">
                {Object.entries(answer).map((item, index) => {
                    if (item[0].match(/p/g)) {
                        return <p key={index, '-key'}> {item[1]} </p>;
                    } 
                    if (item[0].match(/img/g)) {
                        return (
                            <img
                                key={index, '-key'}
                                className={`img-size-${item[1][1]}`}
                                src={item[1][0]}
                                alt="faq-img"
                            />
                        );
                    } 
                    if (item[0].match(/h4/g)) {
                        return <h4 key={index, '-key'}>{item[1]}</h4>;
                    }
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
