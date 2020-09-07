import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';

const FaqHeader = ({

}) => {

return (
  <div className="faq-header">
    <h1>What can we help you with? </h1>
    <form>
      <input type="text" placeholder="Type your question here..."/>
      <input type="submit" />
    </form>
  </div>
)

}

export default FaqHeader;