import React from 'react';
import ReactMarkdown from 'react-markdown';
import {
  makeStyles,
  Container,
} from '@material-ui/core';
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

const useStyles = makeStyles({
  root: {
    color: 'black',
    backgroundColor: 'white',
    padding: '2em',
    '& h1': {
      fontSize: '2.5em',
    },
    '& img': {
      maxWidth: '100%',
      height: 'auto',
    },
  },
});

const Privacy = () => {
  const { data, errors } = useContentful(query);
  const classes = useStyles();

  React.useEffect(() => {
    if (errors) console.log(errors);
  }, [errors]);

  return (
    <>
      { data
        && (
          <Container className={classes.root} maxWidth="md">
            <h1>{data.simplePageCollection.items[0].title}</h1>
            <ReactMarkdown>{data.simplePageCollection.items[0].body}</ReactMarkdown>
          </Container>
        )}
    </>
  );
};

export default Privacy;
