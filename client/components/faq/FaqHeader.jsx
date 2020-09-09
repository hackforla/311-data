import React, {useState} from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';

const FaqHeader = ({
updateSearch
}) => {
  const [searchInput, updateSearchInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSearch(searchInput);
  }

  const handleChange = (e) => {
    e.preventDefault();
    updateSearchInput(e.target.value);
    console.log(searchInput)
  }

  return (
    <div className="faq-header">
      <h1>What can we help you with? </h1>
      <form onSubmit={handleSubmit}>
        <input onChange={handleChange} name="search" type="text" placeholder="Type your question here..."/>
        <input type="submit" />
      </form>
    </div>
  )

}

export default FaqHeader;