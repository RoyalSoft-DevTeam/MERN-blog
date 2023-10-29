import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import NoPageFound from "./pages/NoPageFound";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './store/store';
import { Provider } from 'react-redux';

function App() {
  interface IPost {
    _id: string;
    title: string;
    body: string;
    author: {
      [key: string]: any;
    };
    date: Date;
    published: boolean;
    imageUrl: string;
  }

  const [user, setUser] = useState<any>();
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    // make sure user is still logged in
    if (localStorage.getItem("user")) {
      setUser(localStorage.getItem("user"));
    }

    axios
      .get("/api/posts")
      .then((res) => {
        setPosts(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <GoogleOAuthProvider clientId="736115768308-77jadpfo2mp1qp7uq8fee01i14k6o8mp.apps.googleusercontent.com">
            <BrowserRouter>
              <header>
                <Nav user={user} setUser={setUser} />
              </header>
              <Routes>
                {/* Pages  */}
                <Route path="/" element={<Home user={user} posts={posts} />} />
                <Route path="/login" element={<Login setUser={setUser} />} />
                <Route path="/signup" element={<SignUp />} />
                <Route
                  path="/dashboard"
                  element={<Dashboard posts={posts} setPosts={setPosts} />}
                />
                {/* No page found */}
                <Route path="*" element={<NoPageFound />} />
              </Routes>
            </BrowserRouter>
          </GoogleOAuthProvider>
        </PersistGate>
      </Provider>
    </React.StrictMode>
  );
}

export default App;
