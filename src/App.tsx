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
  useParams,
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
import { DISCORD, ENV, URL_UTILS } from './constants/constants';

/* Store */
import { Firebase, FirebaseContext } from './firebase';
import { Context } from './store/Store';
import {
  updateUser,
  updateToasts,
  updateCookbook,
  updateGame,
  updateGuides,
} from './store/actions';

/* Styles */
import '@elastic/eui/dist/eui_theme_amsterdam_dark.css';
import './App.scss';
import CookbookService from './services/CookbookService/CookbookService';
import axios from './services/axios.instance';
import GameService from './services/GameService/GameService';
import { Sidebar } from './components/Sidebar/Sidebar';
import GuideService from './services/GuideService/GuideService';

const firebaseInstance = new Firebase();

export const App: FunctionComponent = () => {
  const [state, dispatch] = useContext(Context);
  const [loading, setLoading] = useState(true);
  const [cookbooks, setCookbooks] = useState<any>([]);
  const { toasts, cookbook } = state;
  const toast = new ToastService();
  const { game } = state;
  const cookbookService = new CookbookService();
  const gameService = new GameService();

  useEffect(() => {
    async function init() {
      try {
        const games = await gameService.get({ subdomain: URL_UTILS.subdomain });
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
        try {
          const res = await axios.get(`${ENV.base_url}/loginWithCookie`, {
            withCredentials: true,
          });
          await firebaseInstance.signInWithCustomToken(res.data);
          const user: any = await firebaseInstance.getCurrentUser();
          dispatch(updateUser(user));
        } catch (err) {
          // Dont handle
        } finally {
          setLoading(false);
        }
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
          {game && !loading && (
            <>
              <Route path="/:cookbook">
                <GuideDetailWrapper>
                  <Sidebar />
                </GuideDetailWrapper>
              </Route>
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
                <Route path="/:cookbook/recipes/:recipe/section/:section">
                  <GuideDetailWrapper>
                    <GuideDetailView />
                  </GuideDetailWrapper>
                </Route>
                <Route path="/:cookbook/recipes">
                  <HomePageView index={1} />
                </Route>
                <Route path="/:cookbook">
                  <HomePageView />
                </Route>
                <Route path="/">
                  {cookbooks && cookbooks.length > 0 && (
                    <Redirect to={`/${cookbooks[0].name}`} />
                  )}
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

const GuideDetailWrapper: FunctionComponent = ({ children }) => {
  const [state, dispatch] = useContext(Context);
  const { cookbook, game } = state;
  const cookbookService = new CookbookService();
  const cookbookSlug = useParams().cookbook;
  const toast = new ToastService();
  useEffect(() => {
    async function init() {
      if (cookbookSlug) {
        try {
          const cookbooks = await cookbookService.get({
            game: game._id,
            name: cookbookSlug,
          });
          dispatch(updateCookbook(cookbooks[0]));
          const guideMap = {};
          const guideService = new GuideService(cookbooks[0]._id);
          const guides = await guideService.get({ cookbook: cookbooks[0] });
          cookbooks[0].guides.forEach(
            (guide) =>
              (guideMap[guide] = guides.find((_g) => _g._id === guide)),
          );
          dispatch(updateGuides([...Object.values(guideMap)]));
        } catch (err) {
          toast.errorToast('Error Getting Cookbook', err.message);
        }
      }
    }
    init();
  }, []);

  return <>{cookbook && game ? children : null}</>;
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
