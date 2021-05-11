/*EXPERIMENT*/
import React, { FunctionComponent } from "react";

/* Components */
import {
  getDefaultEuiMarkdownParsingPlugins,
  getDefaultEuiMarkdownProcessingPlugins,
  getDefaultEuiMarkdownUiPlugins,
  EuiButtonIcon,
  EuiFieldText,
  EuiMarkdownEditor,
  EuiMarkdownFormat,
  EuiPanel,
  EuiSpacer,
  EuiBadge,
} from "@elastic/eui";
import { TagSection } from "../../TagSection/TagSection";

/* Styles */
import "./_guide-detail-section.scss";

/*Models*/
import { Tag } from "../../../models/Tag";

export interface GuideDetailSectionProps {
  title: string;
  editing: boolean;
  index: number;
  isCollapsed: boolean;
  body: string;
  tags: Array<Tag>;
  updateSection: (key: string, value: string, index: number) => void;
  handleCollapse: (index: number) => void;
  handleDelete: (index: number) => void;
}

export const GuideDetailSection: FunctionComponent<GuideDetailSectionProps> = ({
  title,
  editing,
  index,
  isCollapsed,
  body,
  tags,
  updateSection,
  handleCollapse,
  handleDelete,
}) => {
  // example plugin parser
  function GifMarkdownParser() {
    // @ts-ignore
    const Parser = this.Parser;
    const tokenizers = Parser.prototype.inlineTokenizers;
    const methods = Parser.prototype.inlineMethods;

    // function to parse a matching string
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

      // must consume the exact & entire match string
      return eat(tokenMatch.input)({
        type: "gifPlugin",
        gif: { fixedUrl }, // configuration is passed to the renderer
      });
    }

    // function to detect where the next emoji match might be found
    tokenizeGif.locator = (value, fromIndex) => {
      return value.indexOf("gfy", fromIndex);
    };

    // define the emoji plugin and inject it just before the existing text plugin
    tokenizers.giffer = tokenizeGif;
    methods.unshift("giffer");
  }

  // add the parser for `emojiPlugin`
  const parsingList = getDefaultEuiMarkdownParsingPlugins();
  parsingList.push(GifMarkdownParser);
  // example plugin processor

  // receives the configuration from the parser and renders
  const GifMarkdownRenderer = ({ gif }) => {
    return <img src={gif.fixedUrl} />;
  };

  // add the renderer for `emojiPlugin`
  const processingList = getDefaultEuiMarkdownProcessingPlugins();
  processingList[1][1].components.gifPlugin = GifMarkdownRenderer;

  // const exampleUiPlugins = getDefaultEuiMarkdownUiPlugins();
  // exampleUiPlugins.push(myPluginUI);
  return (
    <EuiPanel
      id={`section-${index}`}
      hasShadow={false}
      hasBorder
      className="guide-section"
      key={index}
    >
      <div className="guide-section__title">
        {editing ? (
          <>
            <EuiFieldText
              placeholder="title"
              value={title}
              onChange={(e) => updateSection("title", e.target.value, index)}
            />
            <EuiButtonIcon
              aria-label="delete-icon"
              title="delete section"
              iconType="trash"
              iconSize="l"
              size="m"
              color="danger"
              className="guide-section__title--delete"
              onClick={() => {
                handleDelete(index);
              }}
            />
          </>
        ) : (
          <div className="guide-section__title--text">{title}</div>
        )}
        <EuiButtonIcon
          aria-label="collapse-icon"
          iconType={isCollapsed ? "arrowDown" : "arrowUp"}
          iconSize="l"
          size="m"
          className="guide-section__title--collapse"
          onClick={() => {
            handleCollapse(index);
          }}
        ></EuiButtonIcon>
      </div>
      {!isCollapsed && (
        <div className={`guide-section__body${editing ? " editing" : ""}`}>
          {editing ? (
            <>
              <EuiMarkdownEditor
                aria-label="Body markdown editor"
                value={body}
                onChange={(value) => updateSection("body", value, index)}
                height={400}
                // uiPlugins={exampleUiPlugins}
                parsingPluginList={parsingList}
                processingPluginList={processingList}
              />
              <TagSection
                className="guide-section__tags"
                initial_tags={tags}
                TagUpdate={(tags) => updateSection("tags", tags, index)}
              ></TagSection>
            </>
          ) : (
            <>
              <EuiMarkdownFormat
                parsingPluginList={parsingList}
                processingPluginList={processingList}
              >
                {body}
              </EuiMarkdownFormat>
              <EuiSpacer size="s" />
              <div className="tag-holder guide-section__tags">
                {tags.map((tag) => (
                  <EuiBadge className="tag" color="hollow">
                    #{tag.label}
                  </EuiBadge>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </EuiPanel>
  );
};
