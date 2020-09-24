import React, { useState, useRef } from 'react';
import PropTypes from 'proptypes';
import { FAQS } from '@components/common/FaqContent';
import Search from '@assets/faq/search-outline.svg';

const FaqHeader = ({
  updateSearch,
  updateCount,
  updateResults,
}) => {
  const [searchInput, updateSearchInput] = useState('');
  const faqSearchAutoComplete = FAQS.map(item => item.question.toLowerCase());
  const autocompleteDiv = useRef(null);
  const searchBox = useRef(null);

  const handleSubmit = e => {
    e.preventDefault();
    const updatedResults = FAQS.filter(row => {
      const question = row.question.toLowerCase();
      return question.match(`${searchInput}`);
    });
    updateSearch(searchInput);
    updateResults(updatedResults);
    updateCount(updatedResults.length);
    autocompleteDiv.current.innerHTML = ' ';
  };

  const autocompleteSelected = e => {
    searchBox.current.value = e.target.innerHTML;
    updateSearchInput(searchBox.current.value.toLowerCase());
    autocompleteDiv.current.innerHTML = '';
  };

  const handleChange = e => {
    const val = e.target.value.trim();
    if (val.length === 0) {
      updateSearchInput('');
      return false;
    }
    if (autocompleteDiv) {
      autocompleteDiv.current.innerHTML = ' ';
    }

    updateSearchInput(val.trim().toLowerCase());
    faqSearchAutoComplete.forEach(searchOption => {
      if (searchOption.match(`${searchInput}`)) {
        const autocompleteResult = document.createElement('p');
        autocompleteResult.innerHTML = searchOption;
        autocompleteResult.tabIndex = '0';
        autocompleteResult.addEventListener('click', autocompleteSelected);
        autocompleteResult.addEventListener('keypress', event => {
          const keyPress = event.which || event.keyCode;
          if (keyPress === 13 || keyPress === 32) {
            searchBox.current.value = event.target.innerHTML;
            updateSearchInput(searchBox.current.value.toLowerCase());
            autocompleteDiv.current.innerHTML = '';
            return true;
          }
          return false;
        });
        autocompleteDiv.current.appendChild(autocompleteResult);
      }
    });
    return true;
  };

  return (
    <div className="faq-header">
      <h1>What can we help you with? </h1>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <div className="autocomplete">
          <Search className="search-outline" />
          <input
            onChange={handleChange}
            id="autocompete-search"
            ref={searchBox}
            name="search"
            type="text"
            placeholder="Type your question here..."
          />
          <div
            id="autocomplete-list"
            className="autocomplete-items"
            ref={autocompleteDiv}
          >
            <p> </p>
          </div>
        </div>
        <input type="submit" value="Search" />
      </form>
    </div>
  );
};

export default FaqHeader;

FaqHeader.propTypes = {
  updateSearch: PropTypes.func.isRequired,
  updateCount: PropTypes.func.isRequired,
  updateResults: PropTypes.func.isRequired,
};
