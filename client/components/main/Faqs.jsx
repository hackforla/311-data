import React from 'react';
import ReactMarkdown from 'react-markdown';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import sharedLayout from '@theme/layout';
import TextHeading from '@components/common/TextHeading';
import ContentBody from '@components/common/ContentBody';
import useContentful from '../../hooks/useContentful';

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
  const classes = sharedLayout();

  React.useEffect(() => {
    if (errors) console.log(errors);
  }, [errors]);

  return (
    <>
      <TextHeading>
        What can we help you with?
      </TextHeading>
      <ContentBody maxWidth="md">
        { data
          && (
            <Grid container>
              <Grid item>
                <Typography variant="h2" align="center">
                  Frequently Asked Questions
                </Typography>

                <div className={classes.marginTop5}>
                  { data.faqCollection.items.map(item => (
                    <Box key={item.sys.id} style={{ marginBottom: '3em' }}>
                      <Typography variant="h2" id={item.question}>
                        {item.question}
                      </Typography>
                      <ReactMarkdown>
                        {item.answer}
                      </ReactMarkdown>
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
