import React, { useRef, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import config from "../config";
import { onError } from "../libs/errorLib";
import { s3Upload } from "../libs/awsLib";

import { TextField } from "@material-ui/core";
import LoaderButton from "../components/LoaderButton";
import CssBaseline from "@material-ui/core/CssBaseline";
import { FormControl } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Copyright from "../Copyright";

const useStyle = makeStyles((theme) => ({
  ...theme.formStyles,
  paper: {
    marginTop: "5px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  box: {
    marginTop: "20px",
    marginBottom: "20px",
  },
  submit: {
    margin: "16px 0px 16px",
  },
}));

export default function Notes() {
  const classes = useStyle();

  const file = useRef(null);
  const { id } = useParams();
  const history = useHistory();
  const [note, setNote] = useState(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    function loadNote() {
      return API.get("notes", `notes/${id}`);
    }
    async function onLoad() {
      try {
        const note = await loadNote();
        const { content, attachment } = note;
        if (attachment) {
          note.attachmentURL = await Storage.vault.get(attachment);
        }
        setContent(content);
        setNote(note);
      } catch (e) {
        onError(e);
      }
    }
    onLoad();
  }, [id]);

  function validateForm() {
    return content.length > 0;
  }

  function formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }

  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

  function saveNote(note) {
    return API.put("notes", `notes/${id}`, {
      body: note,
    });
  }

  async function handleSubmit(event) {
    let attachment;

    event.preventDefault();

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than
${config.MAX_ATTACHMENT_SIZE / 1000000} MB.`
      );
      return;
    }

    setIsLoading(true);

    try {
      if (file.current) {
        attachment = await s3Upload(file.current);
      }
      await saveNote({
        content,
        attachment: attachment || note.attachment,
      });
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function deleteNote() {
    return API.del("notes", `notes/${id}`);
  }

  async function handleDelete(event) {
    event.preventDefault();
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );
    if (!confirmed) {
      return;
    }
    setIsDeleting(true);
    try {
      await deleteNote();
      history.push("/");
    } catch (e) {
      onError(e);
      setIsDeleting(false);
    }
  }

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <div className="Notes">
        <div className={classes.paper}>
          {note && (
            <form className={classes.form} noValidate onSubmit={handleSubmit}>
              <TextField
                multiline
                aria-label="notes textarea"
                rowsmin={3}
                rows={9}
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
              {note.attachment && (
                <Box className={classes.box}>
                  <Typography>
                    <b>Attachment</b>
                  </Typography>
                  <a
                    label="Attachment"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={note.attachmentURL}
                  >
                    {formatFilename(note.attachment)}
                  </a>
                </Box>
              )}
              <FormControl>
                {!note.attachment && (
                  <Typography htmlFor="attachment">Attachment</Typography>
                )}
                <TextField
                  variant="outlined"
                  id="component-simple"
                  type="file"
                  onChange={handleFileChange}
                />
              </FormControl>
              {/* <TextField
                  id="file"
                  onChange={handleFileChange}
                  type="file"
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  color="secondary"
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
                Save
              </LoaderButton>
              <LoaderButton
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                isLoading={isDeleting}
                onClick={handleDelete}
                className={classes.submit}
              >
                Delete
              </LoaderButton>
            </form>
          )}
        </div>
      </div>
      <Box mt={1}>
        <Copyright />
      </Box>
    </Container>
  );
}
