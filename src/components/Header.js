import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Header.css";
// import avatarImg from "../../public/avatar.png"
const Header = ({ children, hasHiddenAuthButtons }) => {
  const history = useHistory();
  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      {children}
      <Stack direction="row" spacing={2}>
        {hasHiddenAuthButtons && (
          <Button
            className="explore-button"
            startIcon={<ArrowBackIcon />}
            variant="text"
            onClick={() => {
              history.push("/");
            }}
          >
            Back to explore
          </Button>
        )}
        {!hasHiddenAuthButtons && !localStorage.getItem("username") && (
          <>
            <Button
              className="login-button"
              variant="outlined"
              onClick={() => {
                history.push("/login");
              }}
            >
              Login
            </Button>
            <Button
              className="register-button"
              variant="contained"
              onClick={() => {
                history.push("/register");
              }}
            >
              Register
            </Button>
          </>
        )}
        {localStorage.getItem("username") && (
          <>
          <Button
              className="register-button"
              variant="text"
              startIcon={<Avatar><img src="avatar.png" alt={localStorage.getItem("username")}/></Avatar>}
             
            >
              {localStorage.getItem("username")}
            </Button>
            <Button
              className="login-button"
              variant="outlined"
              onClick={() => {
                localStorage.removeItem("username");
                localStorage.removeItem("token");
                localStorage.removeItem("balance");
                
                history.push("/");
                window.location.reload()
              }}
            >
              Logout
            </Button>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default Header;
