/**
 * ENV
 */
const NODE_ENV = process.env.NODE_ENV;

let isLocal = NODE_ENV === "development";
let env: any = {};
env.base_url = isLocal ? "http://localhost:3000" : "https://cookbook.gg";
env.isLocal = isLocal;

export const ENV = env;

/**
 * FUNCTIONS
 */
export const FUNCTIONS = {
  loginWithDiscord: isLocal
    ? "http://localhost:5001/cookbook-1d93f/us-central1/loginWithDiscord"
    : "https://us-central1-cookbook-1d93f.cloudfunctions.net/loginWithDiscord",
};

/**
 * DISCORD
 */
export const DISCORD = {
  authUrl: encodeURI(
    `https://discord.com/api/oauth2/authorize?client_id=${process.env.REACT_APP_DISCORD_ID}&redirect_uri=${env.base_url}/login&response_type=code&scope=identify email`
  ),
  getAvatarUrl: function (id, avatar) {
    return `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`;
  },
};
