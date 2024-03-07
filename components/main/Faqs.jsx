import React from 'react';
import ReactMarkdown from 'react-markdown';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import sharedLayout from '@theme/layout';
import TextHeadingFAQ from '@components/common/TextHeading/TextHeadingFAQ';
import ContentBody from '@components/common/ContentBody';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import useContentful from '../../hooks/useContentful';

const useStyles = makeStyles(theme => ({
  flexContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  textHeading: {
    fontWeight: theme.typography.fontWeightBold,
  },
  contentTitle: {
    fontWeight: theme.typography.fontWeightMedium,
  },
  contentQuestion: {
    fontWeight: theme.typography.fontWeightMedium,
    minWidth: '920px',
    cursor: 'pointer',
  },
  searchBar: {
    display: 'flex',
    width: '150%',
    transform: 'translate(-15%, 40%)',
  },
  textField: {
    width: '100%',
  },
  textFieldInput: {
    color: theme.palette.grey,
    fontSize: '18px',
    fontWeight: theme.typography.fontWeightRegular,
    background: 'white',
  },
  searchButton: {
    width: '30%',
    marginLeft: '5%',
    borderRadius: '5px',
    fontSize: '18px',
    fontWeight: theme.typography.fontWeightBold,
  },
  expand: {
    cursor: 'pointer',
  },
}));

const query = `
  query {
    faqCollection(order: priority_ASC) {
      items {
        sys { id }
        question
        answer
      }
    }
  }
`;

const Faqs = () => {
  const { data, errors } = useContentful(query);
  const classes = { ...useStyles(), ...sharedLayout() };

  React.useEffect(() => {
    if (errors) console.log(errors);
  }, [errors]);

  const [searchFormState, setSearchFormState] = React.useState('');
  const [expanded, setExpanded] = React.useState({});
  const [allExpanded, setAllExpanded] = React.useState(false);

  const handleExpand = id => {
    setExpanded(prevState => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleExpandAll = () => {
    setAllExpanded(prevAllExpanded => !prevAllExpanded);
    setExpanded(
      data.faqCollection.items.reduce(
        (prevExpanded, item) => ({
          ...prevExpanded,
          [item.sys.id]: !allExpanded,
        }),
        {},
      ),
    );
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log(searchFormState);
    if (searchFormState) {
      alert(`Searching: ${searchFormState}`);
    }
  };

  const handleSearchFieldOnChange = e => {
    setSearchFormState(e.target.value);
  };

  return (
    <>
      <TextHeadingFAQ>
        <Typography variant="h4" className={classes.textHeading}>
          What can we help you with?
        </Typography>
        <form className={classes.searchBar} onSubmit={handleSubmit}>
          <TextField
            placeholder="Type your question here..."
            id="faq-search"
            name="search"
            type="search"
            variant="outlined"
            required
            className={classes.textField}
            value={searchFormState}
            onChange={handleSearchFieldOnChange}
            InputProps={{
              className: classes.textFieldInput,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            className={classes.searchButton}
            variant="contained"
            color="secondary"
            type="search"
          >
            Search
          </Button>
        </form>
      </TextHeadingFAQ>
      <ContentBody maxWidth="md">
        {data
          && (
            <Grid container>
              <Grid item>
                <div className={classes.marginBottomLarge}>
                  <Typography variant="h6" className={classes.contentTitle} align="center">
                    Frequently Asked Questions
                  </Typography>
                </div>
                <div
                  className={classes.marginBottomLarge}
                  onClick={handleExpandAll}
                  onKeyDown={event => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      handleExpandAll();
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <Typography variant="h6" className={`${classes.contentTitle} ${classes.expand}`}>
                    {allExpanded ? 'Collapse All' : 'Expand All'}
                  </Typography>
                </div>
                <div className={classes.marginTop5}>
                  {data.faqCollection.items.map(item => (
                    <Box key={item.sys.id} style={{ marginBottom: '3em' }}>
                      <Typography variant="h6" className={`${classes.contentQuestion} ${classes.flexContainer}`} onClick={() => handleExpand(item.sys.id)}>
                        {item.question}
                        {expanded[item.sys.id] && (<i className="fa-solid fa-angle-up" />)}
                        {!expanded[item.sys.id] && (<i className="fa-solid fa-angle-down" />)}
                      </Typography>
                      {expanded[item.sys.id] && (
                        <ReactMarkdown>
                          {item.answer}
                        </ReactMarkdown>
                      )}
                    </Box>
                  ))}
                </div>
              </Grid>
            </Grid>
          )}
      </ContentBody>
    </>
  );
};

export default Faqs;
