import * as functions from 'firebase-functions';

import axios from 'axios';

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
