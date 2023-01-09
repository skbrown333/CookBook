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
import ReactGA from 'react-ga';

/* Components */
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { GuideDetailView } from './components/GuideDetailView/GuideDetailView';
import { HomePageView } from './components/HomePageView/HomePageView';
import { AboutView } from './components/AboutView/AboutView';
import { SettingsView } from './components/SettingsView/SettingsView';
import { EuiLoadingSpinner, EuiGlobalToastList } from '@elastic/eui';

/* Services */
import { ToastService } from './services/ToastService';

/* Constants */
import { DISCORD, ENV, GA_ID } from './constants/constants';

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
import GameService from './services/GameService/GameService';
import { Sidebar } from './components/Sidebar/Sidebar';
import GuideService from './services/GuideService/GuideService';
import { useLogin, useSignedInUser } from './services/AuthHooks';

export const App: FunctionComponent = () => {
  const [state, dispatch] = useContext(Context);
  const [loading, setLoading] = useState(true);
  const [cookbooks, setCookbooks] = useState<any>([]);
  const { toasts, game } = state;
  const toast = new ToastService();
  const cookbookService = new CookbookService();
  const gameService = new GameService();
  const fetchSignedInUser = useSignedInUser();

  const fetchGamesAndCookbooks = async () => {
    try {
      const games = await gameService.getBySubdomain();
      setCookbooks(await cookbookService.getByGame(games[0]._id));
      dispatch(updateGame(games[0]));
    } catch (err: any) {
      console.log('err ', err.message);
    }
  };

  useEffect(() => {
    async function init() {
      ReactGA.initialize(GA_ID);
      await fetchGamesAndCookbooks();
      await fetchSignedInUser();
      setLoading(false);
    }
    init();
  }, []);

  const removeToast = (removedToast) => {
    dispatch(
      updateToasts(toasts.filter((toast) => toast.id !== removedToast.id)),
    );
  };

  return (
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
          const _cookbook = await cookbookService.getByName(
            game._id,
            cookbookSlug,
          );
          dispatch(updateCookbook(_cookbook));
          const guideService = new GuideService(_cookbook._id);
          const guides = await guideService.getByCookbook(_cookbook._id);
          dispatch(updateGuides([...guides], _cookbook));
        } catch (err: any) {
          console.log('err ', err.message);
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
  const login = useLogin();

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
  const firebase = useContext(FirebaseContext);
  const baseUrl = window.location.origin;
  const toast = new ToastService();

  useEffect(() => {
    async function init() {
      try {
        await firebase?.signOut();
        dispatch(updateUser(null));
      } catch (err: any) {
        toast.errorToast('Error logging out', err.message);
      } finally {
        window.location.replace(baseUrl);
      }
    }
    init();
  }, []);

  return null;
};
