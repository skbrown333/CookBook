/* Plugins */
import { gifPlug } from './GifPlugin';
import { vidPlug } from './iFramePlugin';
import { loopPlug } from './loopedPlugin';
import { tweetPlug } from './TwitterPlugin';

/* Defaults */
import {
  getDefaultEuiMarkdownParsingPlugins,
  getDefaultEuiMarkdownProcessingPlugins,
  getDefaultEuiMarkdownUiPlugins,
} from '@elastic/eui';

const plugs = [gifPlug, vidPlug, loopPlug, tweetPlug];

export const processingList = getDefaultEuiMarkdownProcessingPlugins();
export const parsingList = getDefaultEuiMarkdownParsingPlugins();
export const uiList = getDefaultEuiMarkdownUiPlugins();

plugs.forEach((plug) => {
  const { name, render, parse } = plug;
  processingList[1][1].components[name] = render;
  parsingList.push(parse);
  // uiList.push(ui);
});
