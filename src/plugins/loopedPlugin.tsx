import React from 'react';

import { EuiAspectRatio } from '@elastic/eui';

function formattedUrl(url) {
  let urlEnd = url.split('/').pop();
  urlEnd = urlEnd.includes('?') ? urlEnd.split('?')[0] : urlEnd;
  if (url.includes('youtube')) {
    const ytbReg = /watch\?v=(\w*)/;
    return `https://www.youtube.com/embed/${
      url.match(ytbReg)[1]
    }?autoplay=1&loop=1&controls=0&mute=1&modestbranding=1&playlist=${urlEnd}&playsinline=1&rel=0&disablekb=1`;
  }
  if (url.includes('youtu.be')) {
    return `https://www.youtube.com/embed/${urlEnd}?autoplay=1&loop=1&controls=0&mute=1&modestbranding=1&playlist=${urlEnd}&playsinline=1&rel=0&disablekb=1`;
  }
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
      <iframe
        className="markdown__video"
        frameBorder="0"
        allowFullScreen={true}
        scrolling="no"
        src={fixedUrl}
      />
    </EuiAspectRatio>
  );
};

export const loopPlug = {
  name: 'LoopedPlugin',
  render: loopedPluginRenderer,
  parse: loopedParser,
  // ui: IFramePlugin,
};
