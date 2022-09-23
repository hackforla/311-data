import React from 'react';
import ReactMarkdown from 'react-markdown';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
// import { makeStyles } from '@material-ui/core';
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

// const useStyles = makeStyles({
//   root: {
//     color: 'black',
//     backgroundColor: 'white',
//     padding: '2em',
//     '& h1': {
//       fontSize: '2.5em',
//     },
//     '& img': {
//       maxWidth: '100%',
//       height: 'auto',
//       display: 'block',
//       marginLeft: 'auto',
//       marginRight: 'auto',
//     },
//   },
// });

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
          <Grid container className={classes.contentIntroBody}>
            <Grid item>
              <Typography variant="h1">
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
