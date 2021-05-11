/* Plugins */
import { gifPlug } from "./GifPlugin";
import { vidPlug } from "./iFramePlugin";

/* Defaults */
import {
  getDefaultEuiMarkdownParsingPlugins,
  getDefaultEuiMarkdownProcessingPlugins,
  getDefaultEuiMarkdownUiPlugins,
} from "@elastic/eui";

const plugs = [gifPlug, vidPlug];

export const processingList = getDefaultEuiMarkdownProcessingPlugins();
export const parsingList = getDefaultEuiMarkdownParsingPlugins();
export const uiList = getDefaultEuiMarkdownUiPlugins();

plugs.forEach((plug) => {
  const { name, render, parse, ui } = plug;
  processingList[1][1].components[name] = render;
  parsingList.push(parse);
  uiList.push(ui);
});
