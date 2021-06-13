import React from 'react';

/* Listeners */
import { MediaClickHandler } from '../constants/listeners';

import { EuiAspectRatio } from '@elastic/eui';

import { YoutubeEmbed } from '../components/YoutubeEmbed/YoutubeEmbed';

function formattedUrl(url) {
  let urlEnd = url.split('/').pop();
  urlEnd = urlEnd.includes('?v=') ? urlEnd.split('?v=')[1] : urlEnd;
  return urlEnd;
}

// const IFramePlugin = {
//   name: "IFramePlugin",
//   button: {
//     label: "iframe",
//     iconType: "play",
//   },
//   editor: function iFrameAdder({ onSave }) {
//     onSave(`vid:`, {
//       block: true,
//     });
//     return null;
//   },
// };

function loopedParser() {
  // @ts-ignore
  const Parser = this.Parser;
  const tokenizers = Parser.prototype.inlineTokenizers;
  const methods = Parser.prototype.inlineMethods;

  function tokenizeLooper(eat, value, silent) {
    const tokenMatch = value.match(/loop:(.*)\s*/);

    if (!tokenMatch) return false; // no match
    const [, url] = tokenMatch;
    const fixedUrl = formattedUrl(url);

    if (silent) {
      return true;
    }

    return eat(tokenMatch.input)({
      type: 'LoopedPlugin',
      fixedUrl,
    });
  }

  tokenizeLooper.locator = (value, fromIndex) => {
    return value.indexOf('loop:', fromIndex);
  };

  tokenizers.looper = tokenizeLooper;
  methods.unshift('looper');
}

const loopedPluginRenderer = ({ fixedUrl }) => {
  return (
    <EuiAspectRatio width={16} height={9}>
      <YoutubeEmbed id={fixedUrl} />
    </EuiAspectRatio>
  );
};

export const loopPlug = {
  name: 'LoopedPlugin',
  render: loopedPluginRenderer,
  parse: loopedParser,
  // ui: IFramePlugin,
};
