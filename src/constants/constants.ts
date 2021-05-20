import { Post } from '../models/Post';
import { Tag } from '../models/Tag';
import { CHARACTERS as characterIcons } from './CharacterIcons';

/**
 * ENV
 */
const NODE_ENV = process.env.NODE_ENV;

const isLocal = NODE_ENV === 'development';
const env: any = {};
env.base_url = isLocal ? 'http://localhost:3000' : 'https://cookbook.gg';
env.isLocal = isLocal;
env.twitch_parent = isLocal ? 'localhost' : 'cookbook.gg';

export const ENV = env;

/**
 * FUNCTIONS
 */
export const FUNCTIONS = {
  loginWithDiscord: `https://us-central1-${process.env.REACT_APP_FIREBASE_PROJECT_ID}.cloudfunctions.net/loginWithDiscord`,
  getTwitchStreams: `https://us-central1-${process.env.REACT_APP_FIREBASE_PROJECT_ID}.cloudfunctions.net/getTwitchStreams`,
};

/**
 * DISCORD
 */
export const DISCORD = {
  authUrl: encodeURI(
    `https://discord.com/api/oauth2/authorize?client_id=${process.env.REACT_APP_DISCORD_ID}&redirect_uri=${window.location.origin}/login&response_type=code&scope=identify email`,
  ),
  getAvatarUrl: function (id, avatar) {
    return `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`;
  },
};

/**
 * Characters
 */

export const CHARACTERS = characterIcons;

/**
 * Firestore
 */

export const FIRESTORE = {
  collections: {
    guides: 'guides',
    tags: 'tags',
    posts: 'posts',
    cookbooks: 'cookbooks',
  },
};

const sampleBody = `
  place both on their own lines with a full line of space on top and bottom
 ## gif template
    gif:gifUrl
 ## video template 
    vid:youtube/clipUrl
 `;

export const newSection: Post = {
  id: '',
  title: '**replace with title',
  body: sampleBody,
  tags: Array<Tag>(),
  cre_date: new Date(),
  doc_ref: '',
};
