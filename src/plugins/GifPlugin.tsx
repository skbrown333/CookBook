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
      const [thumb, size] = ['thumbs.', '-size_restricted.gif'];
      if (url.includes(thumb) && url.includes(size)) return url;
      const splitUrl = url.split('/');
      const [, , gfy, path] = splitUrl;
      splitUrl[3] = path + size;
      splitUrl[2] = thumb + gfy;
      return splitUrl.join('/');
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
    return (
      <EuiAspectRatio width={16} height={9} maxWidth={800}>
        <img className="markdown__gif markdown__media" src={url} />
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
