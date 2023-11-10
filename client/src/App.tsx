import type { Component } from 'solid-js';
import { Routes, Route } from "@solidjs/router";

import Home from "./pages/Home";
import Post from './pages/Post';

const App: Component = () => {
  // console.log("test this", import.meta.env.DEV)
  return (
    <div class="w-screen h-screen bg-black">
      <Routes>
        <Route path="/" component={Home} />
        <Route path="/posts" component={Post} />
      </Routes>
    </div>
  );
};

export default App;
