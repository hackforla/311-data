import React from 'react'
import ReactMarkdown from 'react-markdown'
import useContentful from '../../hooks/useContentful'
import { 
  makeStyles,
  Container,
  Box,
  Typography,
  List,
  ListItem
} from '@material-ui/core';

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

const Faqs = () => {
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
          <h1>Frequently Asked Questions</h1>
          <List dense>
            { data.faqCollection.items.map(item => {
              return (
                <ListItem key={item.sys.id} component='a' href={`#${item.question}`}>{item.question}</ListItem>
              )
            })}
          </List>
          { data.faqCollection.items.map(item => {
            return (
              <Box key={item.sys.id} style={{marginTop:'3em'}}>
                <h2 id={item.question}>{item.question}</h2>
                <ReactMarkdown>{item.answer}</ReactMarkdown>
              </Box>
            )
          })}
        </Container>
      }
    </>
  )
}

export default Faqs;