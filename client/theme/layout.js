import { makeStyles, createStyles } from '@material-ui/core/styles';

// Standard vertical spacing between content sections.
const sharedLayout = makeStyles(theme => createStyles({
  marginTopLarge: {
    marginTop: theme.spacing(5),
  },
  marginTopMedium: {
    marginTop: theme.spacing(3),
  },
  marginTopSmall: {
    marginTop: theme.spacing(1),
  },
}));

export default sharedLayout;
