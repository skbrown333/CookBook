import React, { useEffect, useMemo, useRef, useState } from 'react';

import { EuiAspectRatio, EuiHideFor } from '@elastic/eui';
import { ENV } from '../constants/constants';
import axios from 'axios';

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
      const urlObject = { thumbnail: url, giant: url, gif: url };
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
        urlObject.gif = urlObject.gif.replace(mp4, size);
      } else if (url.includes(mobile)) {
        urlObject.giant = urlObject.giant.replace(mobile, mp4);
        urlObject.gif = urlObject.gif.replace(mobile, size);
      }

      if (url.includes(giant)) {
        urlObject.thumbnail = url.replace(giant, thumb);
        urlObject.gif = urlObject.gif.replace(giant, thumb);
      }

      return urlObject;
    };

    const imgurTransform = (url) => {
      const urlObject = { thumbnail: url, gif: url };
      const [mp4, gif] = ['.mp4', '.gif'];
      if (url.includes(mp4)) {
        urlObject.gif = url.replace(mp4, gif);
      } else if (url.includes(gif)) {
        urlObject.thumbnail = url.replace(gif, mp4);
      } else {
        urlObject.thumbnail = url + mp4;
        urlObject.gif = url + gif;
      }
      return urlObject;
    };

    urls = urls.map((url) => {
      if (url.includes('gfy')) return gfyTransform(url);
      if (url.includes('imgur')) return imgurTransform(url);
      return url;
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
  function useOnScreen(ref) {
    const [isIntersecting, setIntersecting] = useState(false);

    const observer = useMemo(
      () =>
        new IntersectionObserver(([entry]) =>
          setIntersecting(entry.isIntersecting),
        ),
      [ref],
    );

    useEffect(() => {
      observer.observe(ref.current);
      // Remove the observer as soon as the component is unmounted
      return () => {
        observer.disconnect();
      };
    }, []);

    return isIntersecting;
  }
  const [urls, setUrls] = useState<any>(null);
  const ref: any = useRef();
  const isVisible = useOnScreen(ref);

  const gfyTransform = (url) => {
    const urlObject = { thumbnail: url, giant: url, gif: url };
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
      urlObject.gif = urlObject.gif.replace(mp4, size);
    } else if (url.includes(mobile)) {
      urlObject.giant = urlObject.giant.replace(mobile, mp4);
      urlObject.gif = urlObject.gif.replace(mobile, size);
    }

    if (url.includes(giant)) {
      urlObject.thumbnail = url.replace(giant, thumb);
      urlObject.gif = urlObject.gif.replace(giant, thumb);
    }

    return urlObject;
  };

  useEffect(() => {
    const init = async () => {
      const newUrls: any = [];
      for (let i = 0; i < gif.urls.length; i++) {
        const url = gif.urls[i];
        if (
          url.gif &&
          url.gif.includes('gfy') &&
          !url.gif.includes('.mp4') &&
          !url.gif.includes('.gif')
        ) {
          const res = await axios.post(`${ENV.base_url}/gfycat`, {
            url: url.gif,
          });

          newUrls.push(gfyTransform(res.data));
          continue;
        }
        newUrls.push(url);
      }
      setUrls([...newUrls]);
    };
    init();
  }, []);

  return (
    <div className="markdown__gifs" ref={ref}>
      {isVisible && urls != null ? (
        urls.map((url) => (
          <div>
            <EuiAspectRatio width={16} height={9} className="gif-container">
              {url.thumbnail ? (
                <>
                  <EuiHideFor sizes={['xs', 's']}>
                    <video
                      className="markdown__gifs__gif"
                      autoPlay
                      loop
                      muted
                      disableRemotePlayback
                    >
                      <source src={url.thumbnail} type="video/mp4"></source>
                    </video>
                  </EuiHideFor>
                  <EuiHideFor sizes={['m', 'l', 'xl']}>
                    <img className="markdown__gifs__gif" src={url.gif}></img>
                  </EuiHideFor>
                </>
              ) : (
                <img className="markdown__gifs__gif" src={url}></img>
              )}
            </EuiAspectRatio>
          </div>
        ))
      ) : (
        <EuiAspectRatio width={16} height={9} />
      )}
    </div>
  );
};

export const gifPlug = {
  name: 'gifPlugin',
  render: GifMarkdownRenderer,
  parse: GifMarkdownParser,
  // ui: GifPlugin,
};
