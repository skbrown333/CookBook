import { Post } from "../models/Post";
import { Tag } from "../models/Tag";

/**
 * ENV
 */
const NODE_ENV = process.env.NODE_ENV;

let isLocal = NODE_ENV === "development";
let env: any = {};
env.base_url = isLocal ? "http://localhost:3000" : "https://cookbook.gg";
env.isLocal = isLocal;

export const ENV = env;

export const cookbook_id = "T4zKc3d28ITpz31iiRY3";

/**
 * FUNCTIONS
 */
export const FUNCTIONS = {
  loginWithDiscord: `https://us-central1-${process.env.REACT_APP_FIREBASE_PROJECT_ID}.cloudfunctions.net/loginWithDiscord`,
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

const sampleBody = `
 ## gfycat template 
    must start with 'thumbs' and end with '-size_restricted.gif'
    ![](https://thumbs.gfycat.com/FlakyExaltedHairstreak-size_restricted.gif) 
 ## gif template 
    ![](https://media.giphy.com/media/ZpLzabCMomHUQPbcvg/giphy.gif) 
 `;

export const newSection: Post = {
  _id: "mock_post_id",
  title: "**replace with title",
  body: sampleBody,
  tags: Array<Tag>(),
};
