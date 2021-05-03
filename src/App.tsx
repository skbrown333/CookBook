import React, {
  useEffect,
  useContext,
  useState,
  FunctionComponent,
} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

/* Components */
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";
import { HeaderBar } from "./components/Header/Header";
import { GuideDetailView } from "./components/GuideDetailView/GuideDetailView";
import { GuideListView } from "./components/GuideListView/GuideListView";

/* Services */
import { TwitchService } from "./services/TwitchService";

/* Store */
import { Firebase, FirebaseContext } from "./firebase";
import { Context } from "./store/Store";
import { updateUser, updateStreams } from "./store/actions";

/* Styles */
import "@elastic/eui/dist/eui_theme_amsterdam_dark.css";
import "./App.scss";

const firebaseInstance = new Firebase();

export const App: FunctionComponent = () => {
  const dispatch = useContext(Context)[1];
  const twitch = new TwitchService;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        // const user = await firebaseInstance.getCurrentUser();
        dispatch(updateUser(null));
        dispatch(updateStreams(await twitch.getStreams()))
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  return (
    <FirebaseContext.Provider value={firebaseInstance}>
      <div id="cb-app">
        <Router>
          <Route path="/" component={HeaderBar} />
          <Switch>
            <ProtectedRoute
              path="/admin/create"
              component={null}
            ></ProtectedRoute>
            <Route path="/recipes/:recipe">
              <GuideDetailView />
            </Route>
            <Route path="/recipes">
              <GuideListView />
            </Route>
            <Route path="/"></Route>
          </Switch>
        </Router>
      </div>
    </FirebaseContext.Provider>
  );
};

export const Logout: FunctionComponent = () => {
  const dispatch = useContext(Context)[1];
  useEffect(() => {
    async function init() {
      //  await firebaseInstance.signOut();
      dispatch(updateUser(null));
    }
    init();
  }, []);

  return <Redirect to="/" />;
};
