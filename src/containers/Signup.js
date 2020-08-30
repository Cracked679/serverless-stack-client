import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Auth } from "aws-amplify";

import LoaderButton from "../components/LoaderButton";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import { Link as Links } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import FormHelperText from "@material-ui/core/FormHelperText";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useAppContext } from "../libs/contextLib";
import { useFormFields } from "../libs/hooksLib";
import { onError } from "../libs/errorLib";
import Copyright from "../Copyright";
import "./Signup.css";

const useStyles = makeStyles((theme) => ({
  ...theme.formStyles,
}));

export default function Signup() {
  const classes = useStyles();
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
    confirmPassword: "",
    confirmationCode: "",
  });
  const history = useHistory();
  const [newUser, setNewUser] = useState(null);
  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  function validateForm() {
    return (
      fields.email.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    );
  }
  function validateConfirmationForm() {
    return fields.confirmationCode.length > 0;
  }
  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    try {
      const newUser = await Auth.signUp({
        username: fields.email,
        password: fields.password,
      });
      setIsLoading(false);
      setNewUser(newUser);
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }
  async function handleConfirmationSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    try {
      await Auth.confirmSignUp(fields.email, fields.confirmationCode);
      await Auth.signIn(fields.email, fields.password);
      userHasAuthenticated(true);
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }
  function renderConfirmationForm() {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Confirm Email Address
          </Typography>
          <form
            className={classes.form}
            noValidate
            onSubmit={handleConfirmationSubmit}
          >
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="confirmationCode"
              label="Confirmation Code"
              name="confirmationCode"
              autoComplete="email"
              autoFocus
              color="secondary"
              onChange={handleFieldChange}
              value={fields.confirmationCode}
            />
            <FormHelperText>
              Please check your email for the code.
            </FormHelperText>
            <LoaderButton
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              isLoading={isLoading}
              disabled={!validateConfirmationForm()}
            >
              Verify
            </LoaderButton>
          </form>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    );
  }
  function renderForm() {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Signup
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
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="current-password"
              color="secondary"
              value={fields.confirmPassword}
              onChange={handleFieldChange}
            />
            <LoaderButton
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              isLoading={isLoading}
              className={classes.submit}
              disabled={!validateForm()}
            >
              Signup
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
                  to="/login"
                  variant="body2"
                  color="secondary"
                >
                  {"Already have an account? LogIn"}
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

  return (
    <div className="Signup">
      {newUser === null ? renderForm() : renderConfirmationForm()}
    </div>
  );
}
