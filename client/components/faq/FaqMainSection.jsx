import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import FaqQuestion from './FaqQuestion';
import FaqExploreNavBar from '@assets/faq-navbar-explore.png';
import FaqMapSelection from '@assets/faq-map-selection.png';
import FaqMenuFilter from '@assets/faq-menu-filter.png';
const FaqMainSection = ({

}) => {
  const faqs = [ 
    {
      question: "What are Neighborhood Councils?",
      answer: {
        p1: `LA’s 99 Neighborhood Councils together form the grassroots level of the Los Angeles 
        City government. The system was created to connect LA’s diverse communities to City Hall,
        and was established in 1999 by an amendment to the City Charter. While Neighborhood Council
        board members are volunteers, they are public officials elected toffice by the members of their community.`,
        p2: "Please read more about NCs on https://empowerla.org/about-neighborhood-councils/",
      },
    },
    {
      question: `What do Neighborhood Councils do, and how are they funded?`,
      answer: {
        p1: `Since Neighborhood Councils hold their meetings in the communities they serve, they are an 
        important avenue for public participation in the City of Los Angeles, and give the members of a community the 
        chance to have input on decisions that affect their quality of life, and the services they receive from the City.`,
        p2: `Neighborhood Councils receive public funds of about $42,000 each year to support their activities. 
        Each member takes state-mandated training on the ethical management of public funds, and the funds must be allocated by 
        board consensus. The funds may be used to create events and programs that respond to community needs, or spent to advocate 
        for issues that the board cares about such as crime prevention, better roads and streets, safe spaces for children, help 
        for the homeless, arts, or local economic development.`,
      }
    },
    {
      question: `How do I search for 311 requests in my Neighborhood Council?`,
      answer: {
        p1: `Step 1 - On the Top Menu Bar > Click on 'Explore'`,
        img1: FaqExploreNavBar,
        p2: `Step 2 - On the Secondary Menu Bar on Left > Click on 'Map'`,
        img2: FaqMapSelection,
        p3: `Step 3 - On the 'Filters' Slideout > 'Select Date Range' dropdown > Select 'Neighborhood 
        Council (NC) Selection'  (You can type in the dropdown & select from suggestions) > Select 'Request Type Selection' > 
        'Submit'`,
        img3: FaqMenuFilter,
        p4: `Step 4 - Results updated on the map on the right side panel. You can toggle between 'Map' or 'Data Visualization' modes. 
        'Data Visualization' mode - provides bars & charts of the data. You can also export charts from this view, by clicking 
        on 'Export'.`,
      }
    },
  ]

  return (
    <div className="faq-main-section">
      <h4>Frequently Asked Questions (FAQ)</h4>
      <React.Fragment>
        {faqs.map((row, i) => {
            return <div key={i} className="faq-question-holder">
              <FaqQuestion question={row.question} answer={row.answer} />
            </div>
        })}
      </React.Fragment>
    </div>

  );

}

export default FaqMainSection;