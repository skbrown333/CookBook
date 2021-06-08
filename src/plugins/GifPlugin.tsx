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
      const urlEnd = url.split('/').pop();
      return `https://www.gfycat.com/ifr/${urlEnd}`;
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
  const gifs = gif.urls.map((url) => {
    const content = url.includes('gfycat') ? (
      <iframe
        className="markdown_gif"
        frameBorder="0"
        allowFullScreen={true}
        scrolling="no"
        src={url}
      />
    ) : (
      <img className="markdown_gif" src={url} />
    );
    return (
      <EuiAspectRatio width={16} height={9} maxWidth={800}>
        {content}
      </EuiAspectRatio>
    );
  });
  return <div className="markdown_gifs">{gifs}</div>;
};

export const gifPlug = {
  name: 'gifPlugin',
  render: GifMarkdownRenderer,
  parse: GifMarkdownParser,
  // ui: GifPlugin,
};
