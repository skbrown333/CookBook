import * as functions from "firebase-functions";

// The Firebase Admin SDK to access Firestore.
import * as admin from "firebase-admin";
import axios from "axios";

admin.initializeApp({
  serviceAccountId: functions.config().fb.service_account,
});

export const loginWithDiscord = functions.https.onCall(async (data) => {
  const { code, redirectUrl } = data;
  const clientId = functions.config().discord.id;
  const clientSecret = functions.config().discord.secret;
  const params = `client_id=${clientId}&client_secret=${clientSecret}&grant_type=authorization_code&code=${code}&redirect_uri=${redirectUrl}&scope=identify email`;
  const baseUrl = "https://discord.com/api";
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
  let user;

  try {
    // Get discord auth token
    let response = await axios.post(
      `${baseUrl}/oauth2/token`,
      encodeURI(params),
      {
        headers: headers,
      }
    );

    // Get user with auth token
    let newResponse = await axios.get(`${baseUrl}/users/@me`, {
      headers: {
        authorization: `${response.data.token_type} ${response.data.access_token}`,
      },
    });

    user = newResponse.data;
  } catch (err) {
    return err.message;
  }

  const userProfile = {
    username: user.username,
    discriminator: user.discriminator,
    avatar: user.avatar,
    email: user.email,
    id: user.id,
  };

  try {
    let userRecord = await admin.auth().getUserByEmail(user.email);
    await admin
      .firestore()
      .collection("user_profiles")
      .doc(userRecord.uid)
      .set(userProfile);
    return await admin.auth().createCustomToken(userRecord.uid);
  } catch (err) {
    let userRecord = await admin.auth().createUser({ email: user.email });
    await admin
      .firestore()
      .collection("user_profiles")
      .doc(userRecord.uid)
      .set(userProfile);
    return await admin.auth().createCustomToken(userRecord.uid);
  }
});
