import React from 'react';
import ReactMarkdown from 'react-markdown';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { NavLink } from 'react-router-dom';
import ContentBody from '@components/common/ContentBody';
import TextHeadingFAQ from '@components/common/TextHeading/TextHeadingFAQ';
import sharedLayout from '@theme/layout';
import colors from '@theme/colors';
import useContentful from '../../hooks/useContentful';

const useStyles = makeStyles(theme => ({
  flexContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    borderTop: `1px solid ${colors.textPrimaryLightWithOpacity}`,
  },
  lastQuestion: {
    borderBottom: `1px solid ${colors.textPrimaryLightWithOpacity}`,
  },
  textHeading: {
    fontWeight: theme.typography.fontWeightBold,
  },
  contentTitle: {
    fontWeight: theme.typography.fontWeightMedium,
  },
  contentQuestion: {
    fontWeight: theme.typography.fontWeightMedium,
    minWidth: '770px',
    cursor: 'pointer',
    paddingTop: '20px',
    paddingBottom: '20px',
  },
  expand: {
    cursor: 'pointer',
  },
  link: {
    color: colors.textPrimaryLight,
    textDecoration: 'underline',
  },
  flexContainerRight: {
    display: 'flex',
    justifyContent: 'flex-end',
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

  const [expanded, setExpanded] = React.useState({});

  const handleExpand = id => {
    setExpanded(prevState => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  return (
    <>
      <TextHeadingFAQ>
        <Typography variant="h3" className={classes.textHeading}>
          <div>Frequently Asked</div>
          <div>Questions</div>
        </Typography>
      </TextHeadingFAQ>
      <ContentBody maxWidth="md">
        {data
          && (
            <Grid container>
              <Grid item>
                <div className={classes.marginTop5}>
                  {data.faqCollection.items.map((item, index) => (
                    <Box key={item.sys.id} style={{ width: 770 }} className={`${index === data.faqCollection.items.length - 1 ? classes.lastQuestion : ''}`}>
                      <Typography variant="h6" className={`${classes.contentQuestion} ${classes.flexContainer}`} onClick={() => handleExpand(item.sys.id)}>
                        {item.question}
                        {expanded[item.sys.id] && (<i className="fa-solid fa-minus" />) }
                        {!expanded[item.sys.id] && (<i className="fa-solid fa-plus" />)}
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
        <Box>
          <Typography variant="h6" className={`${classes.contentQuestion} ${classes.flexContainerRight}`}>
            <div>
              Have additional questions?&nbsp;
              <NavLink to="/contact" className={classes.link}>
                Contact us.
              </NavLink>
            </div>
          </Typography>
        </Box>
      </ContentBody>
    </>
  );
};

export default Faqs;
