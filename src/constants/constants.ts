/**
 * ENV
 */
const NODE_ENV = process.env.NODE_ENV;

let isLocal = NODE_ENV === "development";
let env: any = {};
env.base_url = isLocal ? "http://localhost:3000" : "http://localhost:3000";
env.isLocal = isLocal;

export const ENV = env;

export const initial_tags = [
  {
    _id: "tag1",
    value: "falcon",
    label: "falcon",
  },

  {
    _id: "tag2",
    value: "marth",
    label: "marth",
  },
  {
    _id: "tag3",
    value: "throw",
    label: "throw",
  },
  {
    _id: "tag4",
    value: "falco",
    label: "falco",
  },
  {
    _id: "tag5",
    value: "sheik",
    label: "sheik",
  },
  {
    _id: "tag6",
    value: "fox",
    label: "fox",
  },
  {
    _id: "tag7",
    value: "peach",
    label: "peach",
  },
  {
    _id: "tag8",
    value: "puff",
    label: "puff",
  },
  {
    _id: "tag9",
    value: "ics",
    label: "ics",
  },
];
