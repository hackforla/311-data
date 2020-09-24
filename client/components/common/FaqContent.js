import FaqExploreCouncils from '@assets/faq/311-explore-council-data.png';
import FaqMapSelection from '@assets/faq/311-data-maps.png';
import FaqRequestTypes from '@assets/faq/311-explain-request-types.png';
import FaqCompareCouncils from '@assets/faq/311-compare-councils.png';

export const FAQS = [
  {
    question: 'What are Neighborhood Councils?',
    answer: {
      p1: `LA’s 99 Neighborhood Councils together form the grassroots level of the Los Angeles City government. 
      The system was created to connect LA’s diverse communities to City Hall, and was established in 1999 by an amendment to the City Charter. 
      While Neighborhood Council board members are volunteers, they are public officials elected to office by the members of their community.`,
    },
    possibleSearchTerms: ['What are Neighborhood Councils?', 'Neighborhood Councils', 'When were Neighborhood Councils Created?', 'Who Serves on Neighborhood Councils?'],
  },
  {
    question: 'What do Neighborhood Councils do?',
    answer: {
      p1: `Since Neighborhood Councils hold their meetings in the communities they serve, they are an important avenue for public participation 
      in the City of Los Angeles, and give the members of a community the chance to have input on decisions that affect their quality of life, 
      and the services they receive from the City.`,
    },
    possibleSearchTerms: ['What do Neighborhood Councils do?', 'Purpose of Neighborhood Councils', 'Why do we have Neighborhood Councils?', 'Why are Neighborhood Councils Important?'],
  },
  {
    question: 'How are Neighborhood Councils funded?',
    answer: {
      p1: `Neighborhood Councils receive public funds of about $42,000 each year to support their activities. Each member takes state-mandated 
      training on the ethical management of public funds, and the funds must be allocated by board consensus. The funds may be used to create 
      events and programs that respond to community needs, or spent to advocate for issues that the board cares about such as crime prevention, 
      better roads and streets, safe spaces for children, help for the homeless, arts, or local economic development`,
    },
    possibleSearchTerms: ['How are Neighborhood Councils funded?', 'How are NC\'s Funded?', 'Funding', 'NC Funding', 'Neighborhood Council Funds'],
  },
  {
    question: 'How do I search for 311 requests in my Neighborhood Council?',
    answer: {
      h41: 'Step 1',
      p1: 'Click on "Explore My 311 Data" on top menu bar',
      img1: [FaqExploreCouncils, 30],
      h42: 'Step 2',
      p2: 'Click on "Map: on the secondary menu bar on left.',
      p3: 'Then select Data Range, Location(s), and Request Type filter options.',
      img2: [FaqMapSelection, 50],
      h43: 'Step 3',
      p4: `Results updated on the map on the right side panel. You can toggle between 'Map' or 'Data' modes. 
          'Data' mode provides bars & charts of the data. You can also export charts from this view, by clicking on 'Export'.`,
    },
    possibleSearchTerms: ['How Do I Search for 311 Requests in my Neighborhood Council', 'Search for NC', 'Search for Neighborhood Council', 'Search 311 Request', '311 Requests in My Neighborhood Council'],
  },
  {
    question: 'What do each of the 311 Request Types mean?',
    answer: {
      img1: [FaqRequestTypes, 100],
    },
    possibleSearchTerms: ['What Do Each of the 311 Request Types mean?', 'Request Types', '311 Request Types'],
  },
  {
    question: 'How do I compare 311 performances of two NCs?',
    answer: {
      h41: 'Step 1',
      p1: 'Click on "Compare Councils" on top menu bar',
      img1: [FaqCompareCouncils, 30],
      h42: 'Step 2',
      p2: `Click on 'Chart' on the secondary menu bar on left. Then select Data Range, District, Chart, 
      and Request Type filter options.`,
      p3: `> On District Selection > Click on 'Add District' > Make your selection (you can type in the dropdown 
      and select from suggestions)`,
      p4: '> Select the Chart Type you need in "Chart Selection" section',
      p5: '> Select the Chart Type you need in "Chart" section',
      p6: '> Select "Request Type"',
    },
    possibleSearchTerms: ['Compare Councils', 'Compare 311 Performance', 'Compare Two NCs', 'How Do I Compare 311 Performances of Two NCs?'],
  },
];

export default FAQS;
