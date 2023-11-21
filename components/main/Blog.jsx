import React from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Container,
  Box,
  Grid,
  List,
  ListItem,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import useContentful from '../../hooks/useContentful';

const query = `
  query {
    blogPostCollection(order: publishDate_DESC) {
      items {
        sys { id }
        slug
        title
        body
        publishDate
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
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
});

function Blog() {
  const { data, errors } = useContentful(query);
  const classes = useStyles();

  React.useEffect(() => {
    if (errors) console.log(errors);
  }, [errors]);

  if (!data) {
    return null;
  }
  return (
    <Container className={classes.root} maxWidth="md">
      <Grid container spacing={2}>
        <Grid item xs={9}>
          { data.blogPostCollection.items.map(item => (
            <Box key={item.sys.id} style={{ marginBottom: '3em' }}>
              <h1 id={`${item.slug}`}>{item.title}</h1>
              <h4>
                {new Date(item.publishDate).toLocaleDateString()}
              </h4>
              <ReactMarkdown>{item.body}</ReactMarkdown>
            </Box>
          ))}
        </Grid>
        <Grid item xs={3}>
          <List dense>
            { data.blogPostCollection.items.map(item => (
              <ListItem key={item.sys.id} component="a" href={`#${item.slug}`}>
                {item.title}
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Blog;
