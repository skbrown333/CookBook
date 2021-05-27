import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import axios from 'axios';

/* Constants */
import { FUNCTIONS } from '../constants/constants';
import UserService from '../services/UserService/UserService';

export class Firebase {
  auth;
  firestore;
  functions;
  googleProvider;

  constructor() {
    const config = {
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
      storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.REACT_APP_FIREBASE_APP_ID,
    };

    app.initializeApp(config);
    this.firestore = app.firestore();
    this.auth = app.auth();
    this.googleProvider = new app.auth.GoogleAuthProvider();
  }

  /**
   * Gets a user and token from a discord login code
   *
   * @param code {String} - autho code needed to get user
   */

  getTwitchStreams = async (streams) => {
    const res = await axios.post(FUNCTIONS.getTwitchStreams, {
      data: streams,
    });
    return res.data.result;
  };

  /**
   * Gets a user and token from a discord login code
   *
   * @param code {String} - autho code needed to get user
   */

  loginWithDiscord = async (code: string, url: string) => {
    const res = await axios.post(FUNCTIONS.loginWithDiscord, {
      data: {
        code,
        redirectUrl: url,
      },
    });
    return res.data;
  };

  /**
   * Signs a user in with a custom auth token
   *
   * @param token {String} - sign in token
   */
  signInWithCustomToken = async (token: string) => {
    await this.auth.signInWithCustomToken(token);
  };

  /**
   * Gets the current user
   */
  getCurrentUser = async () => {
    const user = this.auth.currentUser;
    const userService = new UserService();
    return new Promise((resolve, reject) => {
      this.auth.onAuthStateChanged(async function (user) {
        if (user) {
          try {
            const users = await userService.get({ uid: user.uid });
            resolve({ ...users[0], ...{ user } });
          } catch (err) {
            resolve(user);
          }
        }
      });
    });
  };

  /**
   * Signs the user out
   */
  signOut = async () => {
    await this.auth.signOut();
  };
}
