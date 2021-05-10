import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import axios from "axios";

/* Constants */
import { ENV, FUNCTIONS } from "../constants/constants";
import { cookbook_id } from "../constants/constants";

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
   * returns tag object for a cookbook
   *
   * @param book_id {String} - id of desired cookbook
   */
  tagsObject = async (book_id: string) =>
    await app.firestore().collection(`cookbooks/${book_id}/tags`);

  /**
   * Retrieves all tags in specified cookbook
   */
  getTags = async () => {
    return await (await this.tagsObject(cookbook_id)).get();
  };

  /**
   * Add tag to to specified cookbook
   *
   * @param tag {String} - tag value
   */
  addTag = async (tag: string) => {
    const upload = { value: tag };
    const tagsRef = await this.tagsObject(cookbook_id);
    tagsRef
      .add(upload)
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  };
  /**
   * Creates a new user with the provided email and password
   *
   * @param email {String} - email address
   * @param password {String} - password
   */
  createUserWithEmailAndPassword = async (email: string, password: string) => {
    await this.auth.createUserWithEmailAndPassword(email, password);
  };

  /**
   * Signs a user in with the provided email and password
   *
   * @param email {String} - email address
   * @param password {String} - password
   */
  signInWithEmailAndPassword = async (email: string, password: string) => {
    await this.auth.signInWithEmailAndPassword(email, password);
  };

  /**
   * Sings a user in with a Google account
   */
  signInWithGoogle = async () => {
    await this.auth.signInWithPopup(this.googleProvider);
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
    return new Promise((resolve, reject) => {
      this.auth.onAuthStateChanged(async (user) => {
        if (user) {
          const doc = await this.firestore
            .collection("user_profiles")
            .doc(user.uid)
            .get();

          resolve(doc.data());
        } else {
          reject(Error("Error fetching user"));
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
