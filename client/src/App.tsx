import type { Component } from 'solid-js';
import { Routes, Route } from "@solidjs/router";

import Home from "./pages/Home";
import Post from './pages/Post';
import ErrorPage from './components/ErrorPage';
import { errorPageUrl } from './utils/constants';

const App: Component = () => {
  return (
    <div class="w-screen min-h-screen bg-black">
      <Routes>
        <Route path="/" component={Home} />
        <Route path="/posts/:postId" component={Post} />
        <Route path={`/${errorPageUrl}`} component={ErrorPage} />
      </Routes>
    </div>
  );
};

export default App;
