/**
 * ENV
 */
const NODE_ENV = process.env.NODE_ENV;

let isLocal = NODE_ENV === "development";
let env: any = {};
env.base_url = isLocal ? "http://localhost:3000" : "http://localhost:3000";
env.isLocal = isLocal;

export const ENV = env;
