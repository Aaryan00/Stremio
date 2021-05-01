import React, { Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import Auth from "../hoc/auth";
import "./Mid.css";
// pages for this product
import LandingPage from "./views/LandingPage/LandingPage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import RegisterPage from "./views/RegisterPage/RegisterPage.js";
import NavBar from "./views/NavBar/NavBar";
import Footer from "./views/Footer/Footer";
import UploadVideoPage from "./views/UploadVideoPage/UploadVideoPage";
import DetailVideoPage from "./views/DetailVideoPage/DetailVideoPage";
import ForgotPassword from "./views/ForgotPassword/ForgotPassword";
import SubscriptionPage from "./views/SubscriptionPage/SubscriptionPage";
import EnterOtp from "./views/ForgotPassword/Enterotp";
import ChangePassword from "./views/ForgotPassword/ChangePassword";
import UserProfile from "./views/UserProfile/UserProfile";
import PlayList from "./views/Playlist/Playlist";
import SearchPage from "./views/SearchedPage/SearchPage";
import EditVideoPage from "./views/EditVideoPage/EditVideoPage";
import NotFound from "./views/NotFound/NotFound";

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NavBar />
      <div className="mid-container">
        <Switch>
          <Route exact path="/" component={Auth(LandingPage, null)} />
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
          <Route
            exact
            path="/search/:query"
            component={Auth(SearchPage, null)}
          />
          <Route
            exact
            path="/video/upload"
            component={Auth(UploadVideoPage, true)}
          />
          <Route
            exact
            path="/users/video/edit/:videoId"
            component={Auth(EditVideoPage, true)}
          />
          <Route
            exact
            path="/video/:videoId"
            component={Auth(DetailVideoPage, null)}
          />
          <Route
            exact
            path="/users/:userId"
            component={Auth(UserProfile, true)}
          />
          <Route
            exact
            path="/subscription"
            component={Auth(SubscriptionPage, true)}
          />
          <Route
            exact
            path="/playlist/:playlistId"
            component={Auth(PlayList, true)}
          />
          <Route
            exact
            path="/reset_user"
            component={Auth(ForgotPassword, false)}
          />
          <Route exact path="/" component={Auth(ForgotPassword, false)} />
          <Route exact path="/EnterOtp" component={Auth(EnterOtp, false)} />
          <Route
            exact
            path="/ChangePassword"
            component={Auth(ChangePassword, false)}
          />{" "}
          <Route component={Auth(NotFound, true)} />
        </Switch>
      </div>
      {/* <Footer /> */}
    </Suspense>
  );
}

export default App;
