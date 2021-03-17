import React from 'react'
import ReactMarkdown from 'react-markdown'
import useContentful from '../../hooks/useContentful'
import { 
  makeStyles,
  Container,
  Box,
  Typography,
  Grid,
  List,
  ListItem
} from '@material-ui/core';

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
`

const useStyles = makeStyles({
  root: {
    color: 'black', 
    backgroundColor: 'white', 
    padding: '2em',
    '& h1': {
      fontSize: '2.5em'
    },
    '& img': {
      maxWidth: '100%',
      height: 'auto',
    },
  }
});

const Blog = () => {
  let { data, errors } = useContentful(query)
  const classes = useStyles();

  React.useEffect(() => {
    if (errors)
      console.log(errors)
  }, [errors])

  return (
    <>
      { data &&
        <Container className={classes.root} maxWidth='md'>
          <Grid container spacing={2}>
            <Grid item xs={9}>
              { data.blogPostCollection.items.map(item => {
                return (
                  <Box key={item.sys.id} style={{marginBottom:'3em'}}>
                    <h1 id={`#${item.slug}`}>{item.title}</h1>
                    <h5>Posted {new Date(item.publishDate).toLocaleDateString()}</h5>
                    <ReactMarkdown>{item.body}</ReactMarkdown>
                  </Box>
                )
              })}
            </Grid>
            <Grid item xs={3}>
              <List dense>
                { data.blogPostCollection.items.map(item => {
                  return (
                    <ListItem key={item.sys.id} component='a' href={`#${item.slug}`}>{item.title}</ListItem>
                    )
                  })}
              </List> 
            </Grid>
          </Grid>
        </Container>
      }
    </>
  )
}

export default Blog;