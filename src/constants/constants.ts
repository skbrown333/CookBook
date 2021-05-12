import { Guide } from "../models/Guide";
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
env.twitch_parent = isLocal ? "localhost" : "cookbook.gg";

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
    `https://discord.com/api/oauth2/authorize?client_id=${process.env.REACT_APP_DISCORD_ID}&redirect_uri=${window.location.origin}/login&response_type=code&scope=identify email`
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

export const mockGuide: Guide = {
  _id: "mock_id",
  title: "falco",
  sections: [
    {
      _id: "mock_post_id",
      title: "basics",
      body: `The first key to understanding how to fight falco is that both of his primary walling options (bair and utilt) have virtually the exact same range. Meaning, if you're spacing for one you're simultaneously spacing for the other. This makes it far simpler to smother him/punish him
\n![](https://media.giphy.com/media/ZpLzabCMomHUQPbcvg/giphy.gif) ![](https://media.giphy.com/media/ZpLzabCMomHUQPbcvg/giphy.gif) ![](https://media.giphy.com/media/ZpLzabCMomHUQPbcvg/giphy.gif)`,
      tags: Array<Tag>(),
    },
    {
      _id: "mock_post_id",
      title: "percents",
      body: `## \`No DI\`\n
* \`40%\` Uthrow regrab
* \`72%\` Uthrow fsmash
* \`85%\` Uthrow knee
      
## \`DI down and away\` 
*(rough %s as it depends on notch position)*
* \`~65%\` Uthrow regrab
* \`~65%\` Uthrow dash SH uair
* \`~105%\` Uthrow dash SH knee`,
      tags: Array<Tag>(),
    },
    {
      _id: "mock_post_id",
      title: "defense-and-recovery",
      body: `![](https://media.giphy.com/media/ZpLzabCMomHUQPbcvg/giphy.gif) ![](https://media.giphy.com/media/ZpLzabCMomHUQPbcvg/giphy.gif) ![](https://media.giphy.com/media/ZpLzabCMomHUQPbcvg/giphy.gif) `,
      tags: Array<Tag>(),
    },
  ],
  tags: Array<Tag>(),
};
