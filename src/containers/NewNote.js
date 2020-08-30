import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { API } from "aws-amplify";
import { s3Upload } from "../libs/awsLib";
import { onError } from "../libs/errorLib";

import { TextField } from "@material-ui/core";
import LoaderButton from "../components/LoaderButton";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Copyright from "../Copyright";
import config from "../config";
import "./NewNote.css";

const useStyles = makeStyles((theme) => ({
  ...theme.formStyles,
  paper: {
    marginTop: "5px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

export default function NewNote() {
  const classes = useStyles();
  const file = useRef(null);
  const history = useHistory();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return content.length > 0;
  }

  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }
    setIsLoading(true);
    try {
      const attachment = file.current ? await s3Upload(file.current) : null;
      await createNote({ content, attachment });
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function createNote(note) {
    return API.post("notes", "notes", {
      body: note,
    });
  }

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <div className="NewNote">
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Create note
          </Typography>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <TextField
              multiline
              aria-label="notes textarea"
              rowsmin={3}
              rows={4}
              placeholder="Let's do something..."
              id="content"
              variant="outlined"
              margin="normal"
              type="textarea"
              required
              fullWidth
              autoFocus
              color="secondary"
              value={content}
              componentclass="textarea"
              onChange={(e) => setContent(e.target.value)}
            />
            <TextField
              aria-label="Attachment"
              placeholder="Attachment"
              id="file"
              onChange={handleFileChange}
              type="file"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              color="secondary"
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
              Create
            </LoaderButton>
          </form>
        </div>
      </div>
      <Box mt={1}>
        <Copyright />
      </Box>
    </Container>
  );
}
