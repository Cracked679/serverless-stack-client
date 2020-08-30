import React, { useState } from "react";
import { CardElement, injectStripe } from "react-stripe-elements";
import LoaderButton from "./LoaderButton";
import { useFormFields } from "../libs/hooksLib";
import "./BillingForm.css";
import Copyright from "../Copyright";

import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles((theme) => ({
  ...theme.formStyles,
  paper: {
    marginTop: "8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

function BillingForm({ isLoading, onSubmit, ...props }) {
  const classes = useStyles();

  const [fields, handleFieldChange] = useFormFields({
    name: "",
    storage: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCardComplete, setIsCardComplete] = useState(false);

  isLoading = isProcessing || isLoading;

  function validateForm() {
    return fields.name !== "" && fields.storage !== "" && isCardComplete;
  }

  async function handleSubmitClick(event) {
    event.preventDefault();

    setIsProcessing(true);

    const { token, error } = await props.stripe.createToken({
      name: fields.name,
    });

    setIsProcessing(false);

    onSubmit(fields.storage, { token, error });
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography
          component="h1"
          variant="h5"
          style={{ marginBottom: "24px" }}
        >
          It's worth to invest in your progress!!!
        </Typography>
        <form className="BillingForm" onSubmit={handleSubmitClick} noValidate>
          <TextField
            inputProps={{ min: "0" }}
            type="number"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="storage"
            label="Storage"
            name="storage"
            autoComplete="storage"
            autoFocus
            color="secondary"
            value={fields.storage}
            onChange={handleFieldChange}
            placeholder="Number of notes to store"
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="name"
            label="Cardholder's name"
            id="name"
            autoComplete="name"
            color="secondary"
            type="text"
            value={fields.name}
            onChange={handleFieldChange}
            placeholder="Name on the card"
          />

          <Box mt={2}>
            <CardElement
              label="Credit Card Info"
              className="card-field"
              onChange={(e) => setIsCardComplete(e.complete)}
              style={{
                base: {
                  fontSize: "18px",
                  fontFamily: '"Open Sans", sans-serif',
                },
              }}
            />
          </Box>

          <LoaderButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            Purchase
          </LoaderButton>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
export default injectStripe(BillingForm);
