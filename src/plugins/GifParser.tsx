/* Components */
import {
  getDefaultEuiMarkdownParsingPlugins,
  getDefaultEuiMarkdownProcessingPlugins,
} from "@elastic/eui";

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
      let splitUrl = url.split("/");
      let [, , gfy, path] = splitUrl;
      splitUrl[3] = path + "-size_restricted.gif";
      splitUrl[2] = "thumbs." + gfy;
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

export const parsingList = getDefaultEuiMarkdownParsingPlugins();
parsingList.push(GifMarkdownParser);

const GifMarkdownRenderer = ({ gif }) => {
  return <img src={gif.fixedUrl} />;
};

export const processingList = getDefaultEuiMarkdownProcessingPlugins();
processingList[1][1].components.gifPlugin = GifMarkdownRenderer;
