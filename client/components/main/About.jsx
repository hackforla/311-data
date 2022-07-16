import React from 'react';
import ReactMarkdown from 'react-markdown';
import {
  makeStyles,
  Container,
  Grid,
} from '@material-ui/core';
import useContentful from '../../hooks/useContentful';

const query = `
  query {
    simplePageCollection(where: {slug: "about"}) {
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2em',
    '& h1': {
      fontSize: '2.5em',
    },
    '& img': {
      maxWidth: '100%',
      height: 'auto',
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
});

const About = () => {
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
            <Grid container>
              <Grid item xs={9} md={6}>
                <h1>{data.simplePageCollection.items[0].title}</h1>
                <ReactMarkdown>{data.simplePageCollection.items[0].body}</ReactMarkdown>
              </Grid>
            </Grid>
          </Container>
        )}
    </>
  );
};

export default About;
