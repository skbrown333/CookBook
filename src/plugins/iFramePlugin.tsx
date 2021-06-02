import React from 'react';

import { EuiAspectRatio } from '@elastic/eui';

import { ENV } from '../constants/constants';

function formattedUrl(url) {
  let urlEnd = url.split('/').pop();
  urlEnd = urlEnd.includes('?') ? urlEnd.split('?')[0] : urlEnd;
  if (url.includes('twitch')) {
    if (url.includes('clips.') || url.includes('/clip/')) {
      return `https://clips.twitch.tv/embed?clip=${urlEnd}&parent=${ENV.twitch_parent}`;
    } else if (url.includes('/videos/')) {
      return `https://player.twitch.tv/?video=${urlEnd}&parent=${ENV.twitch_parent}&autoplay=false`;
    }
  }
  if (url.includes('youtube')) {
    const ytbReg = /watch\?v=(\w*)/;
    return `https://www.youtube.com/embed/${url.match(ytbReg)[1]}`;
  }
  if (url.includes('youtu.be')) {
    return `https://www.youtube.com/embed/${urlEnd}`;
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

function iFrameParser() {
  // @ts-ignore
  const Parser = this.Parser;
  const tokenizers = Parser.prototype.inlineTokenizers;
  const methods = Parser.prototype.inlineMethods;

  function tokenizeIframe(eat, value, silent) {
    const tokenMatch = value.match(/vid:(.*)\s*/);

    if (!tokenMatch) return false; // no match
    const [, url] = tokenMatch;
    const fixedUrl = formattedUrl(url);

    if (silent) {
      return true;
    }

    return eat(tokenMatch.input)({
      type: 'IFramePlugin',
      fixedUrl,
    });
  }

  tokenizeIframe.locator = (value, fromIndex) => {
    return value.indexOf('vid:', fromIndex);
  };

  tokenizers.iframe = tokenizeIframe;
  methods.unshift('iframe');
}

const iFramePluginRenderer = ({ fixedUrl }) => {
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

export const vidPlug = {
  name: 'IFramePlugin',
  render: iFramePluginRenderer,
  parse: iFrameParser,
  // ui: IFramePlugin,
};
