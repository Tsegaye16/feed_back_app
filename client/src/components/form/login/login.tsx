import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signin } from "../../../redux/action/auth";
import "./../form.css";
import { toast } from "react-toastify";

const initialState = {
  email: "",
  password: "",
};

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await dispatch(signin(formData, navigate) as any);

    console.log("Response from signin action:", response);

    if (response?.error) {
      toast.error(`${response.error}`);
    } else if (response?.payload?.message) {
      toast.success(`${response?.payload?.message}`);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="App">
      <div className="container" id="container">
        <Container component="main" maxWidth="xs">
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
              Sign in
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                onChange={handleChange}
                value={formData.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Grid item xs={12} sm={6} sx={{ textAlign: "left" }}>
                <Link href="#" variant="body2" sx={{ textAlign: "right" }}>
                  Forgot password?
                </Link>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                className="login"
              >
                Sign In
              </Button>

              {/* Updated link section */}
              <Grid
                container
                spacing={2}
                alignItems="center"
                justifyContent="center"
              >
                <Grid item xs={12} sm={12}>
                  <Link href="/register" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </div>
    </div>
  );
};

export default Login;
