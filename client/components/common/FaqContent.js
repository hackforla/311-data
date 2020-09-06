export default {}

//images
import FaqExploreNavBar from '@assets/faq-navbar-explore.png';
import FaqMapSelection from '@assets/faq-map-selection.png';
import FaqMenuFilter from '@assets/faq-menu-filter.png';
import FaqResults from '@assets/faq-menu-results.png';
import FaqResults2 from '@assets/faq-menu-results2.png';
import FaqComparisonMenu from '@assets/faq-comparison-menu.png';
import FaqExport from '@assets/faq-export.png';

export const FAQS = [
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
      img4: FaqResults,
      img5: FaqResults2,
    }
  },
  {
    question: `What do each of the 311 'Request Type' mean?`,
    answer: {
      p1: `Dead Animal [DAN] - Report a dead animal located on City of Los Angeles streets or outside of residences within the City of Los Angeles.`,
      p2: `Homeless Encampment [HLE] - Report a new homeless encampment`,
      p3: `Single Streetlight [SSL] - For poles knocked down or to report a streetlight outage on a wooden power pole or for malfunctioning traffic signals.`,
      p4: `Multiple Streetlight [MSL] - For poles knocked down or to report a streetlight outage on a wooden power pole or for malfunctioning traffic signals.`,
      p5: `Feedback [FBK] - Provide feedback to City`,
      p6: `Bulky Items [BLK] - Request removal of bulky items`,
      p7: `E-Waste [EWT] - Request eWaste pick up`,
      p8: `Metal/Household Appliances [MHA] - Request Metal/Household Appliances pick up`,
      p9: `Graffiti [GFT] - Request graffiti removal`,
      p10: `Illegal Dumping [ILD] - Report illegal dumping`,
      p11: `Other [OTH] - Other Issue`,
    }
  },
  {
    question: `How do I compare 311 performances of two NCs?`,
    answer: {
      p1: `Step 1 - On the Top Menu Bar > Click on 'Compare'`,
      img1: FaqExploreNavBar,
      p2: `Step 2 - On the 'Comparison Filters' Slideout > 'Select Date Range' dropdown`,
      p3: `On District Selection > Click on 'Add District' & Make your selection (You select 
      either 'NC District' or 'City Council District'. You can type in the dropdown & select from suggestions)`,
      p4: `> Select the Chart Type you need in 'Chart Selection' section`,
      p5: `> Select  'Request Type Selection' > 'Submit'`,
      img2: FaqComparisonMenu,
      p6: `Step 3 - Results updated on the chart visualizations on the right side panel. 
      You can also export charts from this view, by clicking on 'Export'.`,
      img3: FaqExport,
    }
  }
];