import React, { useEffect, useContext, FunctionComponent } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

/* Components */
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { HeaderBar } from './components/Header/Header';
import { GuideDetailView } from './components/GuideDetailView/GuideDetailView';
import { GuideListView } from './components/GuideListView/GuideListView';
import { PostListView } from './components/PostListView/PostListView';
import { EuiLoadingSpinner, EuiGlobalToastList } from '@elastic/eui';

/* Services */
import { ToastService } from './services/ToastService';

/* Constants */
import { DISCORD } from './constants/constants';

/* Store */
import { Firebase, FirebaseContext } from './firebase';
import { Context } from './store/Store';
import { updateUser, updateToasts, updateCookbook } from './store/actions';

/* Styles */
import '@elastic/eui/dist/eui_theme_amsterdam_dark.css';
import './App.scss';

const firebaseInstance = new Firebase();

export const App: FunctionComponent = () => {
  const [state, dispatch] = useContext(Context);
  const { toasts } = state;
  const toast = new ToastService();
  const { cookbook } = state;

  useEffect(() => {
    async function init() {
      try {
        const domains = window.location.host.split('.');
        const subdomain =
          domains.length === 3 && domains[0] !== 'dev' ? domains[0] : 'falcon';
        const cookbooks = await firebaseInstance.getCookbookInfo(subdomain);
        dispatch(updateCookbook(cookbooks[0]));
      } catch (err) {
        toast.errorToast('Error', err.message);
      }

      const user = await firebaseInstance.getCurrentUser();
      dispatch(updateUser(user));
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
          {cookbook && (
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
                <Route path="/recipes/:recipe">
                  <GuideDetailView />
                </Route>
                <Route path="/recipes">
                  <GuideListView />
                </Route>
                <Route path="/">
                  <PostListView />
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

export const Login: FunctionComponent = () => {
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const code = params.get('code');
  const baseUrl = window.location.origin;
  const toast = new ToastService();

  async function login() {
    if (!code) return;
    try {
      const res = await firebaseInstance.loginWithDiscord(
        code,
        `${baseUrl}/login`,
      );
      await firebaseInstance.signInWithCustomToken(res.result);
    } catch (err) {
      toast.errorToast('Error creating guide', err.message);
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
