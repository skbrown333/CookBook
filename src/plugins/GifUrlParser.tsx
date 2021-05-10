import { getDefaultEuiMarkdownUiPlugins } from "@elastic/eui";
import React, { useCallback, useState } from "react";

import {
  getDefaultEuiMarkdownParsingPlugins,
  getDefaultEuiMarkdownProcessingPlugins,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiFieldText,
  EuiModalBody,
} from "@elastic/eui";
import { mockGuide } from "../constants/constants";

export const gifUrlPlugin = {
  name: "gifUrlPlugin",
  button: {
    label: "Gif",
    iconType: "heart",
  },
  editor: function GifInput({ url }) {
    const [gifUrl, setUrl] = useState("");
    return (
      <>
        <EuiModalHeader>
          <EuiModalHeaderTitle>Add gif url</EuiModalHeaderTitle>
        </EuiModalHeader>
        <EuiModalBody>
          <EuiFieldText
            placeholder="displayed text"
            value={gifUrl}
            onChange={(e) => console.log(e)}
            aria-label="displayed text aria"
          />
          <EuiFieldText
            placeholder="paste gif url"
            value={gifUrl}
            onChange={(e) => console.log(e)}
            aria-label="paste gif aria label"
          />
        </EuiModalBody>
      </>
    );
  },
};

function GifParser() {
  function tokenizeGif(eat, value) {
    if (value.includes("gfy") === false || value.includes("giphy") === false)
      return false;

    const gifUrl = (url, text): string => {
      if (/gfy/g.test(url)) {
        const ext = url.split(/\.com\//)[1];
        return `[${text}](https://thumbs.gfycat.com/${ext}-size_restricted.gif)`;
      }
      return `[${text}](${url})`;
    };
    return gifUrl(value.url, value.text);
  }
}
