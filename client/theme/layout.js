import { makeStyles, createStyles } from '@material-ui/core/styles';

const sharedLayout = makeStyles(theme => createStyles({
  // Content pages: Vertical margin just below the TextHeading.
  topMargin5: {
    marginTop: theme.spacing(5),
  },
  topMargin2: {
    marginTop: theme.spacing(2),
  },
  topMargin1: {
    marginTop: theme.spacing(1),
  },
  // Content pages: Vertical margin added to separate content body.
  contentIntroBody: {
    margin: theme.spacing(1, 0),
  },
}));

export default sharedLayout;
