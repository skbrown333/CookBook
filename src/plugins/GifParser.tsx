/* Components */
import {
  getDefaultEuiMarkdownParsingPlugins,
  getDefaultEuiMarkdownProcessingPlugins,
  getDefaultEuiMarkdownUiPlugins,
} from "@elastic/eui";

const GifPlugin = {
  name: "GifPlugin",
  button: {
    label: "gif",
    iconType: "visMetric",
  },
  editor: function GifAdder({ onSave }) {
    onSave(`gif:`, {
      block: true,
    });
    return null;
  },
};

function GifMarkdownParser() {
  // @ts-ignore
  const Parser = this.Parser;
  const tokenizers = Parser.prototype.inlineTokenizers;
  const methods = Parser.prototype.inlineMethods;

  function tokenizeGif(eat, value, silent) {
    const tokenMatch = value.match(/^gif:(.*)/);

    if (!tokenMatch) return false; // no match
    const [, url] = tokenMatch;

    const gfyTransform = (url) => {
      const [thumb, size] = ["thumbs.", "-size_restricted.gif"];
      if (url.includes(thumb) && url.includes(size)) return url;
      let splitUrl = url.split("/");
      let [, , gfy, path] = splitUrl;
      splitUrl[3] = path + size;
      splitUrl[2] = thumb + gfy;
      return splitUrl.join("/");
    };
    const fixedUrl = url.includes("gfy") ? gfyTransform(url) : url;

    if (silent) {
      return true;
    }

    return eat(tokenMatch.input)({
      type: "gifPlugin",
      gif: { fixedUrl },
    });
  }

  tokenizeGif.locator = (value, fromIndex) => {
    return value.indexOf("gif", fromIndex);
  };

  tokenizers.giffer = tokenizeGif;
  methods.unshift("giffer");
}

const GifMarkdownRenderer = ({ gif }) => {
  return <img src={gif.fixedUrl} />;
};

export const processingList = getDefaultEuiMarkdownProcessingPlugins();
export const UiList = getDefaultEuiMarkdownUiPlugins();
export const parsingList = getDefaultEuiMarkdownParsingPlugins();

processingList[1][1].components.gifPlugin = GifMarkdownRenderer;
parsingList.push(GifMarkdownParser);
UiList.push(GifPlugin);
