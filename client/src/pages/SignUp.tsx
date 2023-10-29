import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { login } from "../api/GoogleAuth";
import { useDispatch } from "react-redux";

function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    axios
      .post("/api/users/signup", {
        firstName,
        lastName,
        email,
        company,
        password,
        confirmPassword,
        type: 'general'
      })
      .then((res) => {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: res.data()
        })
        navigate("/login");
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    document.title = "Sign up | MERN Blog";
  }, []);

  const googleSignup = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async codeResponse => {
      const tokens = await axios.post('http://localhost:3000/api/users/googleSignup', { code: codeResponse.code, type: 'google' })
      console.log("tokens", tokens)
      if (tokens.statusText) {
        navigate('/login')
      }
    },
    onError: errorResponse => console.log(errorResponse)
  })

  return (
    <div className="z-[-10] bg-black-500 w-4/5 md:w-1/2 mt-24 absolute left-1/2 -translate-x-1/2">
      <div className="border-2 p-10 shadow-xl rounded-md">
        <h1 className="text-purple-600 text-2xl md:text-3xl font-semibold pb-4">
          Sign Up
        </h1>
        <p className="py-2">
          Already have an account?
          <Link to="/login" className="text-blue-500 hover:underline">
            {" "}
            Log in
          </Link>
        </p>

        <form onSubmit={(e) => handleSubmit(e)}>
          <div>
            {/* first Name */}
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFirstName(e.target.value)
              }
              className="w-full mb-4 text-gray-900 text-base leading-5 h-8 rounded bg-gray-100 py-1 px-2 duration-100 border-2 shadow-sm outline-0 focus:border-purple-400"
              required
            />

            {/* last Name */}
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setLastName(e.target.value)
              }
              className="w-full mb-4 text-gray-900 text-base leading-5 h-8 rounded bg-gray-100 py-1 px-2 duration-100 border-2 shadow-sm outline-0 focus:border-purple-400"
              required
            />

            {/* email */}
            <label htmlFor="email">Email</label>
            <input
              type="text"
              name="email"
              placeholder="Email"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              className="w-full mb-4 text-gray-900 text-base leading-5 h-8 rounded bg-gray-100 py-1 px-2 duration-100 border-2 shadow-sm outline-0 focus:border-purple-400"
              required
            />

            {/* company name */}
            <label htmlFor="company">Company Name</label>
            <input
              type="text"
              name="company"
              placeholder="Company"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCompany(e.target.value)
              }
              className="w-full mb-4 text-gray-900 text-base leading-5 h-8 rounded bg-gray-100 py-1 px-2 duration-100 border-2 shadow-sm outline-0 focus:border-purple-400"
              required
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

            {/* confirm password */}
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setConfirmPassword(e.target.value)
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
              Sign up
            </button>
          </div>
        </form>
        <button className="px-8 py-1 mt-2 rounded border-2 border-purple-600 text-purple-600 duration-300 hover:text-white hover:bg-purple-600" onClick={() => googleSignup()}>
          Sign up with Google
        </button>
      </div>
    </div>
  );
}

export default SignUp;
