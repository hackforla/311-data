import React, {useState} from 'react';
import PropTypes from 'proptypes';
import Arrow from '@assets/faq/faq-arrow.svg';

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
        <div className={showAnswer + "-faq-question faq-question"}>
            <h4>{question}</h4>
            <Arrow
                className="expand-arrow"
                onClick={toggleAnswer}
                onKeyPress={(e)=>{ e.key === 13 & toggleAnswer() }}
                alt="expand-arrow"
                aria-label="Toggle Answer"
                tabIndex="0"
                role="button"
            />
        </div>
        <div className="faq-answer">
            {Object.entries(answer).map((item, index) => {
                if (item[0].match(/p/g)) {
                    return <p key={index}> {item[1]} </p>;
                } else if (item[0].match(/img/g)) {
                    return (
                        <img
                            key={index}
                            className={"img-size-" + item[1][1]}
                            src={item[1][0]}
                            alt="faq-img"
                        />
                    );
                } else if (item[0].match(/h4/g)) {
                    return <h4 key={index}>{item[1]}</h4>;
                }
            })}
        </div>
    </React.Fragment>
);

}

export default FaqQuestion;

FaqQuestion.propTypes = {
  question: PropTypes.string,
  answer: PropTypes.object,
}