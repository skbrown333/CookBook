import React, {
  useEffect,
  useContext,
  FunctionComponent,
  useState,
} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

/* Components */
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { HeaderBar } from './components/Header/Header';
import { GuideDetailView } from './components/GuideDetailView/GuideDetailView';
import { HomePageView } from './components/HomePageView/HomePageView';
import { AboutView } from './components/AboutView/AboutView';
import { SettingsView } from './components/SettingsView/SettingsView';
import { EuiLoadingSpinner, EuiGlobalToastList } from '@elastic/eui';

/* Services */
import { ToastService } from './services/ToastService';

/* Constants */
import { DISCORD, ENV } from './constants/constants';

/* Store */
import { Firebase, FirebaseContext } from './firebase';
import { Context } from './store/Store';
import {
  updateUser,
  updateToasts,
  updateCookbook,
  updateGame,
} from './store/actions';

/* Styles */
import '@elastic/eui/dist/eui_theme_amsterdam_dark.css';
import './App.scss';
import CookbookService from './services/CookbookService/CookbookService';
import axios from './services/axios.instance';
import GameService from './services/GameService/GameService';

const firebaseInstance = new Firebase();

export const App: FunctionComponent = () => {
  const [state, dispatch] = useContext(Context);
  const [loading, setLoading] = useState(true);
  const [cookbooks, setCookbooks] = useState<any>([]);
  const { toasts } = state;
  const toast = new ToastService();
  const { game } = state;
  const cookbookService = new CookbookService();
  const gameService = new GameService();

  useEffect(() => {
    async function init() {
      try {
        const domains = window.location.host.split('.');
        const subdomain =
          (domains.length >= 3 && domains[0] !== 'dev') ||
          window.location.host.includes('localhost')
            ? domains[0]
            : 'melee';
        const games = await gameService.get({ subdomain: subdomain });
        setCookbooks(
          await cookbookService.get({ game: games[0]._id, preview: false }),
        );

        dispatch(updateGame(games[0]));
      } catch (err) {
        toast.errorToast('Error', err);
      }

      try {
        const user = await firebaseInstance.getCurrentUser();
        dispatch(updateUser(user));
        setLoading(false);
      } catch (err) {
        const res = await axios.get(`${ENV.base_url}/loginWithCookie`, {
          withCredentials: true,
        });
        await firebaseInstance.signInWithCustomToken(res.data);
        const user: any = await firebaseInstance.getCurrentUser();
        dispatch(updateUser(user));
        setLoading(false);
      }
    }
    init();
  }, []);

  const removeToast = (removedToast) => {
    dispatch(
      updateToasts(toasts.filter((toast) => toast.id !== removedToast.id)),
    );
  };

  return (
    <FirebaseContext.Provider value={firebaseInstance}>
      <Router>
        <div id="cb-app">
          {game && cookbooks.length > 0 && !loading && (
            <>
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
                <Route path="/about">
                  <AboutView />
                </Route>
                <ProtectedRoute
                  path="/:cookbook/settings"
                  component={SettingsView}
                />
                <Route path="/:cookbook/recipes/:recipe">
                  <GuideDetailWrapper />
                </Route>
                <Route path="/:cookbook/recipes">
                  <HomePageView index={1} />
                </Route>
                <Route path="/:cookbook">
                  <HomePageView />
                </Route>
                <Route path="/">
                  <Redirect to={`/${cookbooks[0].name}`} />
                </Route>
              </Switch>
            </>
          )}

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

const GuideDetailWrapper: FunctionComponent = () => {
  const [state, dispatch] = useContext(Context);
  const { cookbook, game } = state;
  const cookbookService = new CookbookService();
  const toast = new ToastService();
  useEffect(() => {
    async function init() {
      if (!cookbook) {
        try {
          const cookbooks = await cookbookService.get({ game: game._id });
          dispatch(updateCookbook(cookbooks[0]));
        } catch (err) {
          toast.errorToast('Error Getting Cookbook', err.message);
        }
      }
    }
    init();
  }, []);

  return <>{cookbook && game && <GuideDetailView />}</>;
};

export const Login: FunctionComponent = () => {
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const code = params.get('code');
  const baseUrl = window.location.origin;
  const toast = new ToastService();

  async function login() {
    if (!code) return;
    try {
      const res: any = await axios.post(`${ENV.base_url}/login`, {
        code,
        redirectUrl: `${baseUrl}/login`,
      });
      await firebaseInstance.signInWithCustomToken(res.data);
      const user: any = await firebaseInstance.getCurrentUser();
      const token = await user.user.getIdToken();
      await axios.get(`${ENV.base_url}/session`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
    } catch (err) {
      toast.errorToast('Error loggin in', err.message);
    } finally {
      window.location.replace(baseUrl);
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
  const [, dispatch] = useContext(Context);
  const baseUrl = window.location.origin;
  const toast = new ToastService();

  useEffect(() => {
    async function init() {
      try {
        await firebaseInstance.signOut();
        dispatch(updateUser(null));
      } catch (err) {
        toast.errorToast('Error logging out', err.message);
      } finally {
        window.location.replace(baseUrl);
      }
    }
    init();
  }, []);

  return null;
};
