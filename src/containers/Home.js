import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API } from "aws-amplify";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import Copyright from "../Copyright";
import "./Home.css";

import { Typography } from "@material-ui/core";
import { Box } from "@material-ui/core";
import { List, ListItem, ListItemText } from "@material-ui/core";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }
      try {
        const notes = await loadNotes();
        setNotes(notes);
      } catch (e) {
        onError(e);
      }
      setIsLoading(false);
    }
    onLoad();
  }, [isAuthenticated]);

  function loadNotes() {
    return API.get("notes", "notes");
  }

  function renderNotesList(notes) {
    return [{}].concat(notes).map((note, i) =>
      i !== 0 ? (
        <ListItemLink
          component={Link}
          key={note.noteId}
          to={`/notes/${note.noteId}`}
        >
          <ListItem>
            <ListItemText
              primary={
                <>
                  <Typography variant="h5">
                    {note.content.trim().split("\n")[0]}
                  </Typography>
                </>
              }
              secondary={
                "Created: " + new Date(note.createdAt).toLocaleString()
              }
            />
          </ListItem>
        </ListItemLink>
      ) : (
        <ListItemLink component={Link} key="new" to="/notes/new">
          <ListItem>
            <h4>
              <b>{"\uFF0B"}</b> Create a new note
            </h4>
          </ListItem>
        </ListItemLink>
      )
    );
  }
  function renderLander() {
    return (
      <div className="lander">
        <h1>Scratch</h1>
        <p>A simple note taking app</p>
      </div>
    );
  }
  function renderNotes() {
    return (
      <div className="notes">
        <Typography variant="h4" gutterBottom>
          Your Notes
        </Typography>
        <List>{!isLoading && renderNotesList(notes)}</List>
      </div>
    );
  }

  function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderNotes() : renderLander()}
      <Box mt={1}>
        <Copyright />
      </Box>
    </div>
  );
}
