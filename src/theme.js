import { createMuiTheme } from "@material-ui/core";
import { lightBlue, grey } from "@material-ui/core/colors";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: grey[200],
    },
    secondary: lightBlue,
  },
  typography: {
    fontFamily: "PT Sans",
  },
  formStyles: {
    paper: {
      marginTop: "64px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: "8px",
    },
    submit: {
      margin: "24px 0px 16px",
    },
  },
  // overrides: {
  //     MuiButton: {
  //       raisedPrimary: {
  //         color: 'white',
  //       },
  //     },
  //   }
});

export default theme;
