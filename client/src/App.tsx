import type { Component } from 'solid-js';
import { Routes, Route, useLocation } from "@solidjs/router";

import Home from "./pages/Home";
import Post from './pages/Post';
import SignIn from './pages/SignIn';
import ErrorPage from './components/ErrorPage';
import MainHeader from './pages/MainHeader';
import { errorPageUrl } from './utils/constants';
import authStore from "./utils/createAuthStore";
import Account from './pages/Account';
import RouteGuard from './components/RouteGuard';

const App: Component = () => {
  const location = useLocation();

  // storeTokenFromUrl(location);
  const { mutateToken } = authStore;
  mutateToken(location);
  return (
    <div class="min-h-screen bg-black">
      <MainHeader />
      <Routes>
        <Route path="/" component={Home} />
        <Route path="/" component={RouteGuard}>
          <Route path="/account" component={Account} />
        </Route>
        <Route path="/posts/:postId" component={Post} />
        <Route path="/signin" component={SignIn} />
        <Route path={`/${errorPageUrl}`} component={ErrorPage} />
        {/* <Route path="/account" component={Account}/> */}
        {/* <ProtectedRoute path="/account" component={Account} /> */}
      </Routes>
    </div>
  );
};

export default App;
