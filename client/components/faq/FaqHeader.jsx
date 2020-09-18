import React, {useState} from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { FAQS } from '@components/common/FaqContent.js';

const FaqHeader = ({
updateSearch
}) => {
  const [searchInput, updateSearchInput] = useState("");
  const faqSearchAutoComplete = FAQS.map((item) => {return item.question});

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSearch(searchInput.toLowerCase().trim());
  }

  const handleChange = (e) => {
    let val = e.target.value;
    updateSearchInput(val);

    if(val.length == 0) {
      return false;
    }
    document.querySelector('.autocomplete-items').style.display = 'none';

    for (let searchOption of faqSearchAutoComplete) {
      if (searchOption.toLowerCase().match(/`${val.toLowerCase()}`/)) {
        let b = document.createElement("div");
        b.innerHTML = "<strong>" + searchOption.substr(0, val.length) + "</strong>";
        b.innerHTML += searchOption.substr(val.length); 

        b.innerHTML += "<input type='hidden' value='"+ searchOption +"'>";
        b.addEventListener("click", function(e) {
          val = this.getElementsByTagName("input")[0].value;
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
    
  }

  return (
    <div className="faq-header">
      <h1>What can we help you with? </h1>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <div className="autocomplete">
          <input onChange={handleChange} name="search" type="text" placeholder="Type your question here..." />
          <div id="autocomplete-list" className="autocomplete-items"></div>
        </div>
        <input type="submit" value="Search"/>
      </form>
    </div>
  )

}

export default FaqHeader;