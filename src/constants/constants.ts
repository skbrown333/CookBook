/**
 * ENV
 */
const NODE_ENV = process.env.NODE_ENV;

let isLocal = NODE_ENV === "development";
let env: any = {};
env.base_url = isLocal ? "http://localhost:3000" : "http://localhost:3000";
env.isLocal = isLocal;

export const ENV = env;

import { Post } from "../models/Post";
import { Tag } from "../models/Tag";

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
