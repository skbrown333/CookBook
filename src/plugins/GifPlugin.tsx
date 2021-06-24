import React from 'react';

import { EuiAspectRatio } from '@elastic/eui';

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

function GifMarkdownParser() {
  // @ts-ignore
  const Parser = this.Parser;
  const tokenizers = Parser.prototype.inlineTokenizers;
  const methods = Parser.prototype.inlineMethods;

  function tokenizeGif(eat, value, silent) {
    const tokenMatch = value.match(/gif:(.*)\s*/);

    if (!tokenMatch) return false; // no match
    let [, urls] = tokenMatch;
    if (urls.includes(',')) {
      urls = urls.split(',');
    } else {
      urls = [urls];
    }

    const gfyTransform = (url) => {
      const urlObject = { thumbnail: url, giant: url };
      const [thumb, size, mobile, mp4, giant] = [
        'thumbs.',
        '-size_restricted.gif',
        '-mobile.mp4',
        '.mp4',
        'giant.',
      ];

      if (url.includes(thumb)) {
        urlObject.giant = url.replace(thumb, giant);
      }

      if (url.includes(size)) {
        urlObject.thumbnail = urlObject.thumbnail.replace(size, mobile);
        urlObject.giant = urlObject.giant.replace(size, mp4);
      }

      if (url.includes(mp4) && !url.includes(mobile)) {
        urlObject.thumbnail = urlObject.thumbnail.replace(mp4, mobile);
      }

      if (url.includes(mobile)) {
        urlObject.giant = urlObject.giant.replace(mobile, mp4);
      }

      if (url.includes(giant)) {
        urlObject.thumbnail = url.replace(giant, thumb);
      }

      return urlObject;
    };

    urls = urls.map((url) => {
      return url.includes('gfy') ? gfyTransform(url) : url;
    });

    if (silent) {
      return true;
    }

    return eat(tokenMatch.input)({
      type: 'gifPlugin',
      gif: { urls },
    });
  }

  tokenizeGif.locator = (value, fromIndex) => {
    return value.indexOf('gif', fromIndex);
  };

  tokenizers.giffer = tokenizeGif;
  methods.unshift('giffer');
}

const GifMarkdownRenderer = ({ gif }) => {
  const gifs = gif.urls.map((url) => (
    <EuiAspectRatio width={16} height={9} maxWidth={800}>
      <video className="guide-section__markdown__gifs__gif" autoPlay loop muted>
        <source src={url.giant} type="video/mp4"></source>
        <source src={url.thumbnail} type="video/mp4"></source>
      </video>
    </EuiAspectRatio>
  ));
  return <div className="guide-section__markdown_gifs">{gifs}</div>;
};

export const gifPlug = {
  name: 'gifPlugin',
  render: GifMarkdownRenderer,
  parse: GifMarkdownParser,
  // ui: GifPlugin,
};
