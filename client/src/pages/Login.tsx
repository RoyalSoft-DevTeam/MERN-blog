import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

interface IProps {
  setUser: React.Dispatch<any>;
}

function Login({ setUser }: IProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    axios
      .post("/api/users/login", {
        email,
        password,
        type: 'general'
      })
      .then((res) => {
        localStorage.setItem("user", JSON.stringify(res.data));
        setUser(res.data.user);
        navigate("/");
      })
      .catch((err) => {
        if (err.response.status === 401) {
          navigate("/login");
        } else {
          console.error(err);
        }
      });
  };

  useEffect(() => {
    document.title = "Login | MERN Blog";
  }, []);

  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async codeResponse => {
      const tokens = await axios.post('http://localhost:3000/api/users/googleLogin', { code: codeResponse.code, type: 'google' })
      console.log("tokens", tokens)
      if (tokens.statusText) {
        navigate('/')
        localStorage.setItem("user", JSON.stringify(tokens.data));
        setUser(tokens.data.user);
        navigate("/");
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            token: tokens.data.token,
            user: { email: tokens.data.user.email }
          }
        })
      }
    },
    onError: errorResponse => console.log(errorResponse)
  })

  return (
    <div className="z-[-10] bg-black-500 w-4/5 md:w-1/2 mt-24 absolute left-1/2 -translate-x-1/2">
      <div className="border-2 p-10 shadow-xl rounded-md">
        <h1 className="text-purple-600 text-2xl md:text-3xl font-semibold pb-4">
          Log in
        </h1>
        <p className="py-2">
          Don't have an account?
          <Link to="/signup" className="text-blue-500 hover:underline">
            {" "}
            Sign up
          </Link>
        </p>

        <form onSubmit={(e) => handleSubmit(e)}>
          <div>
            {/* username */}
            <label htmlFor="username">Email</label>
            <input
              type="text"
              name="email"
              placeholder="Email"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              required
              className="w-full mb-4 text-gray-900 text-base leading-5 h-8 rounded bg-gray-100 py-1 px-2 duration-100 border-2 shadow-sm outline-0 focus:border-purple-400"
            />

            {/* password */}
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              className="w-full mb-4 text-gray-900 text-base leading-5 h-8 rounded bg-gray-100 py-1 px-2 duration-100 border-2 shadow-sm outline-0 focus:border-purple-400"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="px-8 py-1 mt-2 rounded border-2 border-purple-600 text-purple-600 duration-300 hover:text-white hover:bg-purple-600"
            >
              Login
            </button>
          </div>
        </form>
        <button className="px-8 py-1 mt-2 rounded border-2 border-purple-600 text-purple-600 duration-300 hover:text-white hover:bg-purple-600" onClick={() => googleLogin()}>
          Login with Google
        </button>
      </div>
    </div>
  );
}

export default Login;
