import * as functions from 'firebase-functions';

// The Firebase Admin SDK to access Firestore.
import * as admin from 'firebase-admin';
import axios from 'axios';

admin.initializeApp({
  serviceAccountId: functions.config().fb.service_account,
});

export const loginWithDiscord = functions.https.onCall(async (data: any) => {
  const { code, redirectUrl } = data;
  const clientId = functions.config().discord.id;
  const clientSecret = functions.config().discord.secret;
  const params = `client_id=${clientId}&client_secret=${clientSecret}&grant_type=authorization_code&code=${code}&redirect_uri=${redirectUrl}&scope=identify email`;
  const baseUrl = 'https://discord.com/api';
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  let user;

  try {
    // Get discord auth token
    const response = await axios.post(
      `${baseUrl}/oauth2/token`,
      encodeURI(params),
      {
        headers: headers,
      },
    );

    // Get user with auth token
    const newResponse = await axios.get(`${baseUrl}/users/@me`, {
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
    const userRecord = await admin.auth().getUserByEmail(user.email);
    await admin
      .firestore()
      .collection('user_profiles')
      .doc(userRecord.uid)
      .set(userProfile);
    return await admin.auth().createCustomToken(userRecord.uid);
  } catch (err) {
    const userRecord = await admin.auth().createUser({ email: user.email });
    await admin
      .firestore()
      .collection('user_profiles')
      .doc(userRecord.uid)
      .set(userProfile);
    return await admin.auth().createCustomToken(userRecord.uid);
  }
});

export const getTwitchStreams = functions.https.onCall(async (data: any) => {
  const client_id = functions.config().twitch.id;
  const client_secret = functions.config().twitch.secret;
  const authUrl = `https://id.twitch.tv/oauth2/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=client_credentials`;

  try {
    const res = await axios.post(authUrl);
    const { access_token } = res.data;
    let usersQuery = '';
    let streamsQuery = '';

    // Build user query
    for (let i = 0; i < data.length; i++) {
      usersQuery += `login=${data[i]}`;
      if (i < data.length - 1) {
        usersQuery += '&';
      }

      streamsQuery += `user_login=${data[i]}`;
      if (i < data.length - 1) {
        streamsQuery += '&';
      }
    }

    // Get users
    const userRes = await axios.get(
      `https://api.twitch.tv/helix/users?${usersQuery}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Client-Id': client_id,
        },
      },
    );

    //  Get streams
    const streamRes = await axios.get(
      `https://api.twitch.tv/helix/streams?${streamsQuery}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Client-Id': client_id,
        },
      },
    );

    const users = userRes.data;
    const streams = streamRes.data;

    return {
      users,
      streams,
    };
  } catch (err) {
    return err;
  }
});
