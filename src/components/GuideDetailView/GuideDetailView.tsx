import React, {
  FunctionComponent,
  useState,
  ReactElement,
  useContext,
} from "react";

/* Components */
import {
  EuiPanel,
  EuiMarkdownEditor,
  EuiMarkdownFormat,
  EuiSideNav,
  EuiButton,
  EuiFieldText,
  EuiAvatar,
  EuiButtonIcon,
  EuiDragDropContext,
  EuiDroppable,
  EuiDraggable,
  euiDragDropReorder,
  EuiButtonEmpty,
} from "@elastic/eui";
import { TwitchSidebar } from "../TwitchSidebar/TwitchSidebar";
import { TagSection } from "../TagSection/TagSection";

/* Styles */
import "./_guide-detail-view.scss";

/* Types */
import { Guide } from "../../models/Guide";

/* Store */
// import { Context } from "../../store/Store";

export interface GuideDetailViewProps {}

export const GuideDetailView: FunctionComponent<GuideDetailViewProps> = (): ReactElement => {
  // const tag_store = useContext(Context)[0].tags;

  const mockGuide = {
    _id: "mock_id",
    title: "falco",
    sections: [
      {
        _id: "mock_post_id",
        title: "basics",
        body: `The first key to understanding how to fight falco is that both of his primary walling options (bair and utilt) have virtually the exact same range. Meaning, if you're spacing for one you're simultaneously spacing for the other. This makes it far simpler to smother him/punish him
\n![](https://media.giphy.com/media/ZpLzabCMomHUQPbcvg/giphy.gif) ![](https://media.giphy.com/media/ZpLzabCMomHUQPbcvg/giphy.gif) ![](https://media.giphy.com/media/ZpLzabCMomHUQPbcvg/giphy.gif)`,
        tags: [],
      },
      {
        _id: "mock_post_id",
        title: "percents",
        body: `## \`No DI\`\n
* \`40%\` Uthrow regrab
* \`72%\` Uthrow fsmash
* \`85%\` Uthrow knee
        
## \`DI down and away\` 
*(rough %s as it depends on notch position)*
* \`~65%\` Uthrow regrab
* \`~65%\` Uthrow dash SH uair
* \`~105%\` Uthrow dash SH knee`,
        tags: [],
      },
      {
        _id: "mock_post_id",
        title: "defense-and-recovery",
        body: `![](https://media.giphy.com/media/ZpLzabCMomHUQPbcvg/giphy.gif) ![](https://media.giphy.com/media/ZpLzabCMomHUQPbcvg/giphy.gif) ![](https://media.giphy.com/media/ZpLzabCMomHUQPbcvg/giphy.gif)`,
        tags: [],
      },
    ],
    tags: [],
  };
  const [editing, setEditing] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<Array<boolean>>([]);
  const [sections, setSections] = useState<any>(mockGuide.sections);
  const [guide, setGuide] = useState<Guide | null>(mockGuide);

  const buildSideNaveItems = () => {
    if (!guide) return;
    return sections.map((section, index) => {
      const { title } = section;
      return {
        name: title,
        id: index,
        onClick: () => {
          let div = document.getElementById(title);
          if (div && document) {
            let topPos = div.offsetTop - 200;
            let sectionsDiv = document.getElementById("sections");
            if (sectionsDiv) sectionsDiv.scrollTop = topPos;
          }
        },
      };
    });
  };

  const updateSection = (key, value, index) => {
    if (!guide) return;
    const { sections } = guide;
    sections[index][key] = value;
    setGuide({ ...guide });
  };

  const handleCancel = () => {
    setSections([...mockGuide.sections]);
    setGuide({ ...mockGuide });
    setCollapsed([]);
    setEditing(false);
  };

  const handleSave = () => {
    setCollapsed([]);
    setEditing(false);
  };

  const handleCollapse = (index) => {
    collapsed[index] = collapsed[index] ? !collapsed[index] : true;
    setCollapsed([...collapsed]);
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (source && destination) {
      const items = euiDragDropReorder(
        sections,
        source.index,
        destination.index
      );
      setCollapsed([
        ...euiDragDropReorder(collapsed, source.index, destination.index),
      ]);
      setSections([...items]);
    }
  };

  const buildSections = () => {
    if (!guide) return [<></>];

    return sections.map((section, index) => {
      const { title, body, tags } = section;
      const isCollapsed = collapsed[index] && collapsed[index] === true;

      const sectionPanel = (
        <EuiPanel
          id={section.title}
          hasShadow={false}
          hasBorder
          className="guide-section"
          key={index}
        >
          <div className="guide-section__title">
            {editing ? (
              <EuiFieldText
                placeholder="title"
                value={title}
                onChange={(e) => updateSection("title", e.target.value, index)}
              />
            ) : (
              <div>{title}</div>
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
            <div className="guide-section__body">
              {editing ? (
                <EuiMarkdownEditor
                  aria-label="Body markdown editor"
                  value={body}
                  onChange={(value) => updateSection("body", value, index)}
                  height={400}
                />
              ) : (
                <>
                  <EuiMarkdownFormat>{body}</EuiMarkdownFormat>
                  <div className="tag-holder guide-section__tags">
                    {tags.map((tag) => (
                      <EuiButtonEmpty className="tag" size="s" color="text">
                        #{tag.label}
                      </EuiButtonEmpty>
                    ))}
                  </div>
                </>
              )}
              <TagSection
                className="guide-section__tags"
                intial_tags={tags}
                editing={editing}
              ></TagSection>
            </div>
          )}
        </EuiPanel>
      );

      return editing ? (
        <EuiDraggable
          spacing="m"
          key={index}
          index={index}
          draggableId={index.toString()}
          isDragDisabled={!editing}
        >
          {sectionPanel}
        </EuiDraggable>
      ) : (
        sectionPanel
      );
    });
  };

  return (
    <div id="guide-detail" className="guide-detail">
      {guide && (
        <>
          <div
            className="guide-detail__controls"
            style={editing ? { paddingRight: 8 } : {}}
          >
            {editing ? (
              <>
                <EuiButton
                  className="guide-controls__button"
                  fill
                  iconType="trash"
                  color="danger"
                  onClick={handleCancel}
                >
                  Cancel
                </EuiButton>
                <EuiButton
                  className="guide-controls__button"
                  fill
                  iconType="save"
                  color="secondary"
                  onClick={handleSave}
                >
                  Save
                </EuiButton>
              </>
            ) : (
              <EuiButton
                className="guide-controls__button"
                fill
                iconType="pencil"
                onClick={() => setEditing(!editing)}
              >
                Edit Page
              </EuiButton>
            )}
          </div>
          <div className="guide-detail__content">
            <EuiPanel
              className="guide-content__side-nav"
              style={editing ? { marginTop: 8 } : {}}
              hasShadow={false}
              hasBorder
            >
              <EuiAvatar
                size="xl"
                name={mockGuide.title}
                imageUrl={
                  "https://www.textures-resource.com/resources/sheet_icons/4/3300.png"
                }
              ></EuiAvatar>
              <EuiSideNav
                className="guide-content__side-nav__items"
                aria-label="Basic example"
                style={{ width: 192 }}
                items={[
                  {
                    name: mockGuide.title,
                    id: 0,
                    items: buildSideNaveItems(),
                  },
                ]}
              />
            </EuiPanel>
            <div id="sections" className="guide-content__sections">
              {editing ? (
                <EuiDragDropContext onDragEnd={handleDragEnd}>
                  <EuiDroppable
                    droppableId="DROPPABLE_AREA"
                    spacing="m"
                    className="guide-content__droppable"
                  >
                    {buildSections()}
                  </EuiDroppable>
                </EuiDragDropContext>
              ) : (
                buildSections()
              )}
            </div>
            <TwitchSidebar className="matchup-content__right" />
          </div>
        </>
      )}
    </div>
  );
};
