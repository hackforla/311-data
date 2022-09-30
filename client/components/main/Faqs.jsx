import React from 'react';
import ReactMarkdown from 'react-markdown';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import sharedLayout from '@theme/layout';
import TextHeading from '@components/common/TextHeading';
import ContentBody from '@components/common/ContentBody';
import useContentful from '../../hooks/useContentful';

const useStyles = makeStyles(theme => ({
  textHeading: {
    fontWeight: theme.typography.fontWeightBold,
  },
  contentTitle: {
    fontWeight: theme.typography.fontWeightMedium,
  },
  contentQuestion: {
    fontWeight: theme.typography.fontWeightMedium,
  },
  contentAnswer: {

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

  return (
    <>
      <TextHeading>
        <Typography variant="h4" className={classes.textHeading}>
          What can we help you with?
        </Typography>
      </TextHeading>
      <ContentBody maxWidth="md">
        { data
          && (
            <Grid container>
              <Grid item>
                <div className={classes.marginBottomLarge}>
                  <Typography variant="h6" className={classes.contentTitle} align="center">
                    Frequently Asked Questions
                  </Typography>
                </div>

                <div className={classes.marginTop5}>
                  { data.faqCollection.items.map(item => (
                    <Box key={item.sys.id} style={{ marginBottom: '3em' }}>
                      <Typography variant="h6" className={classes.contentQuestion}>
                        {item.question}
                      </Typography>
                      {/* <Typography variant="body1" className={classes.contentAnswer}> */}
                      <ReactMarkdown>
                        {item.answer}
                      </ReactMarkdown>
                      {/* </Typography> */}
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
