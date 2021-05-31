import React from 'react';
import { Tweet } from 'react-twitter-widgets';

// const GifPlugin = {
//   name: "GifPlugin",
//   button: {
//     label: "gif",
//     iconType: "visMetric",
//   },
//   editor: function GifAdder({ onSave }) {
//     onSave(`gif:`, {
//       block: false,
//     });
//     return null;
//   },
// };

function TweetMarkdownParser() {
  // @ts-ignore
  const Parser = this.Parser;
  const tokenizers = Parser.prototype.inlineTokenizers;
  const methods = Parser.prototype.inlineMethods;

  function tokenizeTweet(eat, value, silent) {
    const tokenMatch = value.match(/tweet:(.*)\s*/);

    if (!tokenMatch) return false; // no match
    const [, url] = tokenMatch;

    const tweetTransform = (url) => {
      const splitUrl = url.split('/');
      const id = splitUrl.pop();
      return id;
    };

    const id = url.includes('twitter.com') ? tweetTransform(url) : url;

    if (silent) {
      return true;
    }

    return eat(tokenMatch.input)({
      type: 'tweetPlugin',
      tweet: { id },
    });
  }

  tokenizeTweet.locator = (value, fromIndex) => {
    return value.indexOf('tweet', fromIndex);
  };

  tokenizers.tweeter = tokenizeTweet;
  methods.unshift('tweeter');
}

const GifMarkdownRenderer = ({ tweet }) => {
  return <Tweet tweetId={tweet.id} />;
};

export const tweetPlug = {
  name: 'tweetPlugin',
  render: GifMarkdownRenderer,
  parse: TweetMarkdownParser,
  // ui: GifPlugin,
};
