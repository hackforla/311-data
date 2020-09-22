import React, {useState} from 'react';
import PropTypes from "proptypes";
import { FAQS } from '@components/common/FaqContent.js';
import Search from '@assets/faq/search-outline.svg';

const FaqHeader = ({
updateSearch,
updateCount,
updateResults,
}) => {
  const [searchInput, updateSearchInput] = useState("");
  const faqSearchAutoComplete = FAQS.map((item) => {return item.question.toLowerCase()});
  let autocompleteDiv = document.querySelector(".autocomplete-items");
  let searchBox = document.querySelector("#autocompete-search");

  const handleSubmit = (e) => {
    e.preventDefault();
    let updatedResults = FAQS.filter((row) => {
        const question = row.question.toLowerCase();
        return question.match(`${searchInput}`);
    });
    updateSearch(searchInput);
    updateResults(updatedResults);
    updateCount(updatedResults.length);
  };

  const autocompleteSelected = (e) => {
    searchBox.value = e.target.innerHTML;
    updateSearchInput(searchBox.value.toLowerCase());
    autocompleteDiv.innerHTML = " ";
  };

  const handleChange = (e) => {
    let val = e.target.value.trim();
    if(val.length === 0) {
      updateSearchInput("");
      return false;
    };

    updateSearchInput(val.trim().toLowerCase());
    autocompleteDiv.innerHTML = "";

    for (let searchOption of faqSearchAutoComplete) {
      if (searchOption.match(`${searchInput}`)) {
        let autocompleteResult = document.createElement('p');
        autocompleteResult.innerHTML = searchOption;
        autocompleteResult.tabIndex = "0";
        autocompleteResult.addEventListener('click', autocompleteSelected);
        autocompleteResult.addEventListener('keypress', (e) => {
          (e.key === 13) & autocompleteSelected(e);
        });
        autocompleteDiv.appendChild(autocompleteResult);
      };
    };
  };

  return (
      <div className="faq-header">
          <h1>What can we help you with? </h1>
          <form autoComplete="off" onSubmit={handleSubmit}>
              <div className="autocomplete">
                <Search className="search-outline"/>                    
                  <input
                        onChange={handleChange}
                        id="autocompete-search"
                        name="search"
                        type="text"
                        placeholder="Type your question here..."
                    />
                  <div
                      id="autocomplete-list"
                      className="autocomplete-items"
                  ></div>
              </div>
              <input type="submit" value="Search" />
          </form>
      </div>
  );
};

export default FaqHeader;

FaqHeader.propTypes = {
    updateSearch: PropTypes.func,
    updateCount: PropTypes.func,
    updateResults: PropTypes.func,
};