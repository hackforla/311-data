import React from 'react';
import ReactMarkdown from 'react-markdown';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import sharedLayout from '@theme/layout';
import TextHeading from '@components/common/TextHeading';
import ContentBody from '@components/common/ContentBody';
import useContentful from '../../hooks/useContentful';

const query = `
  query {
    simplePageCollection(where: {slug: "privacy"}) {
      items {
        title
        body
      }
    }
  }
`;

const Privacy = () => {
  const { data, errors } = useContentful(query);
  const classes = sharedLayout();

  React.useEffect(() => {
    if (errors) console.log(errors);
  }, [errors]);

  return (
    <>
      <TextHeading>
        Privacy Policy
      </TextHeading>

      <ContentBody maxWidth="md">
        { data
        && (
          <Grid container className={classes.marginTopSmall}>
            <Grid item>
              <Typography variant="h6">
                {data.simplePageCollection.items[0].title}
              </Typography>
              <ReactMarkdown>
                {data.simplePageCollection.items[0].body}
              </ReactMarkdown>
            </Grid>
          </Grid>
        )}
      </ContentBody>
    </>
  );
};

export default Privacy;
