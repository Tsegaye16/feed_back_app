import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./../form.css";
import { signup } from "../../../redux/action/auth";

const initialState = {
  name: "",
  email: "",
  password: "",
};

function Registration() {
  const [formData, setFormData] = useState(initialState);
  const [errorMessage, setErrorMessage] = useState(""); // For displaying error messages
  const [successMessage, setSuccessMessage] = useState(""); // For displaying success messages
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(""); // Clear error before making a new request
    setSuccessMessage(""); // Clear success message

    const response = await dispatch(signup(formData, navigate) as any);

    if (response?.error) {
      // Backend sent an error
      // setErrorMessage(response.error); // Set error message from backend
      // console.log("Error to display:", response.error);
      toast.error(`${response.error}`);
    } else if (response?.payload?.message) {
      // Backend sent a success message
      //setSuccessMessage(response.payload.message); // Set success message from backend
      // console.log("Success to display:", response.message);
      toast.success(`${response?.payload?.message}`);
    }
  };

  const handleChange = (event: any) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  return (
    <div className="App">
      <div className="container" id="container">
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>

            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="name"
                    type="text"
                    fullWidth
                    placeholder="Full Name"
                    onChange={handleChange}
                    value={formData.name}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="email"
                    label="E-mail"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    value={formData.email}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    placeholder="Password"
                    onChange={handleChange}
                    value={formData.password}
                  />
                </Grid>
              </Grid>

              {/* Display Success or Error Messages */}
              {/* {errorMessage && (
                <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                  {errorMessage}
                </Typography>
              )}
              {successMessage && (
                <Typography variant="body2" color="success.main" sx={{ mt: 2 }}>
                  {successMessage}
                </Typography>
              )} */}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>

              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/login" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </div>
    </div>
  );
}

export default Registration;
