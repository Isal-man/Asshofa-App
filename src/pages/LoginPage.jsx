import {
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Link
} from "@mui/material";
import { LoadingButton } from "@mui/lab"
import { useState } from "react";
import { APP_BACKEND } from "../config/constant";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";

export const LoginPage = () => {
  const {handleToken} = useAuth()
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

	const handleClick = async (e) => {
    e.preventDefault()
		setLoading(true)

    const request = await fetch(APP_BACKEND + "/auth/sign-in", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    })

    const response = await request.json()

    handleToken(response)
    setLoading(false)
    navigate("/santri", {
      replace: true
    })
	}

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className="flex w-screen h-screen justify-center items-center">
      <div className="flex bg-green-500 w-screen h-screen justify-center items-center">
        <img
          className="w-4/5 h-1/5"
          src="https://asshofa.org/wp-content/uploads/2024/03/LOGO-ASSHOFA-ARAB-1536x436.png"
          alt="Asshofa"
        />
      </div>
      <div className="flex w-screen h-screen justify-center items-center">
        <div className="flex flex-col justify-between items-center h-3/5 w-3/5 rounded-xl box-shadow">
          <div className="text-center">
            <h1 className="text-4xl font-bold p-20">LOGIN</h1>
          </div>
          <div className="flex flex-col justify-center items-center h-full w-full gap-4">
            <TextField
              id="outlined-basic"
              label="Username"
              variant="outlined"
              className="w-4/5"
              onChange={(e) => setUsername(e.target.value)}
            />
            <FormControl className={"w-4/5"} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <FontAwesomeIcon icon={faEye} /> :  <FontAwesomeIcon icon={faEyeSlash} />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <LoadingButton
              size="large"
              endIcon={<FontAwesomeIcon icon={faRightToBracket} />}
              onClick={handleClick}
              loading={loading}
              loadingPosition="end"
              variant="contained"
              className="w-4/5"
            >
              <span>LOGIN</span>
            </LoadingButton>
            <Link href="/register">Don't have an account yet?</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
