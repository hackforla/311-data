import { makeStyles, createStyles } from '@material-ui/core/styles';

export default makeStyles(theme => createStyles({
  // Content pages: Vertical margin just below the TextHeading.
  contentMarginTop: {
    margin: theme.spacing(5, 0, 1, 0),
  },
  // Content pages: Vertical margin added to separate content body.
  contentIntroBody: {
    margin: theme.spacing(1, 0),
  },
}));
