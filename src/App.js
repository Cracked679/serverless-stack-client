import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { AppContext } from "./libs/contextLib";
import { onError } from "./libs/errorLib";
import { Auth } from "aws-amplify";
import Routes from "./Routes";
//MUI Stuff
import { Box } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { AppBar } from "@material-ui/core/";
import { Toolbar } from "@material-ui/core";
import { Container } from "@material-ui/core";
import "./App.css";

function App() {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const history = useHistory();

  async function handleLogout() {
    await Auth.signOut();
    userHasAuthenticated(false);
    history.push("/login");
  }

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    } catch (e) {
      if (e !== "No current user") {
        onError(e);
      }
    }
    setIsAuthenticating(false);
  }

  return (
    !isAuthenticating && (
      <div className="App">
        <Container maxwidth="sm">
          <div>
            <AppBar position="static">
              <Toolbar>
                <Typography
                  variant="h6"
                  style={{ flex: 1, fontWeight: "bold" }}
                >
                  <Link
                    to="/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Scratch
                  </Link>
                </Typography>
                <Box>
                  {isAuthenticated ? (
                    <>
                      <Button component={Link} to="/settings">
                        Settings
                      </Button>
                      <Button onClick={handleLogout}>Logout</Button>
                    </>
                  ) : (
                    <>
                      <Button component={Link} to="/signup">
                        Signup
                      </Button>
                      <Button component={Link} to="/Login">
                        Login
                      </Button>
                    </>
                  )}
                </Box>
              </Toolbar>
            </AppBar>
          </div>
          <AppContext.Provider
            value={{ isAuthenticated, userHasAuthenticated }}
          >
            <Routes />
          </AppContext.Provider>
        </Container>
      </div>
    )
  );
}

export default App;
