import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Auth } from "aws-amplify";
import { useAppContext } from "../libs/contextLib";
import { useFormFields } from "../libs/hooksLib";
import { onError } from "../libs/errorLib";
import Copyright from "../Copyright";

import LoaderButton from "../components/LoaderButton";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import { Link as Links } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles((theme) => ({
  ...theme.formStyles,
}));

function LogIn() {
  const classes = useStyles();
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const { userHasAuthenticated } = useAppContext();

  function validateForm() {
    return fields.email.length > 0 && fields.password.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    try {
      await Auth.signIn(fields.email, fields.password);
      userHasAuthenticated(true);
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            color="secondary"
            value={fields.email}
            onChange={handleFieldChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            color="secondary"
            value={fields.password}
            onChange={handleFieldChange}
          />
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          <LoaderButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            isLoading={isLoading}
            className={classes.submit}
            disabled={!validateForm()}
          >
            LogIn
          </LoaderButton>
          <Grid container>
            {/* <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid> */}
            <Grid item>
              <Links
                component={Link}
                to="/signup"
                variant="body2"
                color="secondary"
              >
                {"Don't have an account? Sign Up"}
              </Links>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}

export default LogIn;
