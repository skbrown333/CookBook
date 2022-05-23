import { Post } from '../models/Post';
import { Tag } from '../models/Tag';
import { CHARACTERS as characterIcons } from './CharacterIcons';

/**
 * ENV
 */
const NODE_ENV = process.env.NODE_ENV;

const isLocal = NODE_ENV === 'development';
const env: any = {};
env.base_url = process.env.REACT_APP_API_URL;
env.twitch_parent = isLocal ? 'localhost' : window.location.host;

export const ENV = env;

// cookbook.gg
// melee.cookbook.gg
// localhost:3001
// cook-book-cookbook-gg.vercel.app

class UrlUtils {
  domains: string[];
  isLocal: boolean;
  isVercel: boolean;

  constructor() {
    this.domains = window.location.host.split('.');
    this.isLocal = window.location.host.includes('localhost');
    this.isVercel = window.location.host.includes('.vercel.app');
  }

  get protocol() {
    return this.isLocal ? 'http' : 'https';
  }

  get subdomain() {
    if (this.isVercel) {
      return this.domains.length > 3 ? this.domains[0] : 'melee';
    }

    if (this.isLocal) {
      return this.domains.length > 1 ? this.domains[0] : 'melee';
    }

    return this.domains.length > 2 ? this.domains[0] : 'melee';
  }

  get domain() {
    if (this.isVercel) {
      return this.domains.length > 3
        ? `${this.domains[1]}.${this.domains[2]}.${this.domains[3]}`
        : `${this.domains[0]}.${this.domains[1]}.${this.domains[2]}`;
    }

    if (this.isLocal) {
      return this.domains.length > 1 ? this.domains[1] : this.domains[0];
    }

    return this.domains.length > 2
      ? `${this.domains[1]}.${this.domains[2]}`
      : `${this.domains[0]}.${this.domains[1]}`;
  }
}

export const URL_UTILS = new UrlUtils();

/**
 * FUNCTIONS
 */
export const FUNCTIONS = {
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
export const CHARACTER = {
  route: '/characters',
};

/**
 * Game
 */
export const GAME = {
  route: '/games',
};

/**
 * Roles
 */

export const ROLES = {
  admin: ['admin', 'chef'],
};

/**
 * Cookbook
 */

export const COOKBOOK = {
  route: '/cookbooks',
};

/**
 * Guide
 */

export const GUIDE = {
  route: '/guides',
};

/**
 * Post
 */

export const POST = {
  route: '/posts',
};

/**
 * Tag
 */

export const TAG = {
  route: '/tags',
};

/**
 * User
 */

export const USER = {
  route: '/users',
};

const sampleBody = `
  place both on their own lines with a full line of space on top and bottom
 ## gif template
    gif:gifUrl
 ## multiple gif template
    gif:gifUrl,gifUrl2
 ## video template 
    vid:youtube/clipUrl
 ## tweet template 
    tweet:link/tweet_id
 `;

export const newSection = {
  title: ``,
  body: sampleBody,
  tags: Array<Tag>(),
  cre_date: new Date(),
  doc_ref: '',
};

export const canManage = (user, cookbook) =>
  cookbook &&
  user &&
  ((cookbook.roles && ROLES.admin.includes(cookbook.roles[user.uid])) ||
    user.super_admin);

export const shallowCopy = (params) => {
  try {
    return JSON.parse(JSON.stringify(params));
  } catch (err) {
    console.log(err);
  }
};
