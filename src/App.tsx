import React, {
  useEffect,
  useContext,
  useState,
  FunctionComponent,
} from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

/* Components */
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";
import { HeaderBar } from "./components/Header/Header";
import { GuideDetailView } from "./components/GuideDetailView/GuideDetailView";
import { GuideListView } from "./components/GuideListView/GuideListView";
import { EuiLoadingSpinner, EuiGlobalToastList } from "@elastic/eui";

/* Services */
import { TwitchService } from "./services/TwitchService";

/* Constants */
import { DISCORD } from "./constants/constants";

/* Store */
import { Firebase, FirebaseContext } from "./firebase";
import { Context } from "./store/Store";
import { updateUser, updateStreams, updateToasts } from "./store/actions";

/* Styles */
import "@elastic/eui/dist/eui_theme_amsterdam_dark.css";
import "./App.scss";

const firebaseInstance = new Firebase();

export const App: FunctionComponent = () => {
  const [state, dispatch] = useContext(Context);
  const { toasts } = state;
  const twitch = new TwitchService();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const user = await firebaseInstance.getCurrentUser();
        dispatch(updateUser(user));
        dispatch(updateStreams(await twitch.getStreams()));
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  const removeToast = (removedToast) => {
    dispatch(
      updateToasts(toasts.filter((toast) => toast.id !== removedToast.id))
    );
  };

  return (
    <FirebaseContext.Provider value={firebaseInstance}>
      <Router>
        <div id="cb-app">
          <Route path="/" component={HeaderBar} />
          <Switch>
            <ProtectedRoute
              path="/admin/create"
              component={null}
            ></ProtectedRoute>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/logout">
              <Logout />
            </Route>
            <Route path="/recipes/:recipe">
              <GuideDetailView />
            </Route>
            <Route path="/recipes">
              <GuideListView />
            </Route>
            <Route path="/"></Route>
          </Switch>
          <EuiGlobalToastList
            toasts={toasts}
            toastLifeTimeMs={6000}
            dismissToast={removeToast}
          />
        </div>
      </Router>
    </FirebaseContext.Provider>
  );
};

export const Login: FunctionComponent = () => {
  let search = window.location.search;
  let params = new URLSearchParams(search);
  let code = params.get("code");
  let baseUrl = window.location.origin;
  async function login() {
    if (!code) return;
    try {
      const res = await firebaseInstance.loginWithDiscord(
        code,
        `${baseUrl}/login`
      );
      await firebaseInstance.signInWithCustomToken(res.result);
      window.location.href = baseUrl;
    } catch (err) {
      console.log("err: ", err);
      window.location.href = baseUrl;
    }
  }

  useEffect(() => {
    if (!code) {
      window.location.href = DISCORD.authUrl;
    } else {
      login();
    }
  }, []);

  return (
    <div className="login">
      <EuiLoadingSpinner size="xl" />
    </div>
  );
};

export const Logout: FunctionComponent = () => {
  const dispatch = useContext(Context)[1];

  useEffect(() => {
    async function init() {
      await firebaseInstance.signOut();
      dispatch(updateUser(null));
      window.location.href = window.location.origin;
    }
    init();
  }, []);

  return null;
};
