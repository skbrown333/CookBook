import React, { FunctionComponent, useState } from "react";

/* Components */
import {
  EuiPanel,
  EuiMarkdownEditor,
  EuiMarkdownFormat,
  EuiSideNav,
  EuiButton,
  EuiFieldText,
  EuiAvatar,
} from "@elastic/eui";

/* Styles */
import "./_matchup-detail-view.scss";

/* Types */
import { Matchup } from "../../models/Matchup";
import { Character } from "../../models/Character";

export interface MatchupDetailViewProps {}

export const MatchupDetailView: FunctionComponent<MatchupDetailViewProps> = () => {
  const [editing, setEditing] = useState<boolean>(false);
  const [character, setCharacter] = useState<Character>({
    _id: "mock_id",
    name: "falco",
  });

  const mockMatchup = {
    _id: "mock_id",
    character: "falco",
    sections: [
      {
        title: "basics",
        body: `The first key to understanding how to fight falco is that both of his primary walling options (bair and utilt) have virtually the exact same range. Meaning, if you're spacing for one you're simultaneously spacing for the other. This makes it far simpler to smother him/punish him
\n![](https://media.giphy.com/media/ZpLzabCMomHUQPbcvg/giphy.gif) ![](https://media.giphy.com/media/ZpLzabCMomHUQPbcvg/giphy.gif) ![](https://media.giphy.com/media/ZpLzabCMomHUQPbcvg/giphy.gif)`,
      },
      {
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
      },
      {
        title: "defense-and-recovery",
        body: `![](https://media.giphy.com/media/ZpLzabCMomHUQPbcvg/giphy.gif) ![](https://media.giphy.com/media/ZpLzabCMomHUQPbcvg/giphy.gif) ![](https://media.giphy.com/media/ZpLzabCMomHUQPbcvg/giphy.gif)`,
      },
    ],
  };

  const [matchup, setMatchup] = useState<Matchup | null>(mockMatchup);

  const buildSideNaveItems = () => {
    if (!matchup) return;
    return matchup.sections.map((section, index) => {
      const { title } = section;
      return {
        name: title,
        id: index,
        onClick: () => {
          let div = document.getElementById(section.title);
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
    if (!matchup) return;
    const { sections } = matchup;
    sections[index][key] = value;
    setMatchup({ ...matchup });
  };

  const handleCancel = () => {
    setMatchup({ ...mockMatchup });
    setEditing(false);
  };

  const handleSave = () => {
    setEditing(false);
  };

  const buildSections = () => {
    if (!matchup) return;

    return matchup.sections.map((section, index) => {
      const { title, body } = section;

      return (
        <EuiPanel
          id={section.title}
          hasShadow={false}
          hasBorder
          className="matchup-section"
        >
          {editing ? (
            <>
              <EuiFieldText
                className="matchup-section__title-input"
                placeholder="title"
                value={title}
                onChange={(e) => updateSection("title", e.target.value, index)}
              />
              <EuiMarkdownEditor
                className="matchup-section__body-input"
                aria-label="Body markdown editor"
                value={body}
                onChange={(value) => updateSection("body", value, index)}
                height={400}
              />
            </>
          ) : (
            <>
              <div className="matchup-section__title">
                <EuiMarkdownFormat>{`# **\#** **${title}** \n---`}</EuiMarkdownFormat>
              </div>
              <div className="matchup-section__body">
                <EuiMarkdownFormat>{body}</EuiMarkdownFormat>
              </div>
            </>
          )}
        </EuiPanel>
      );
    });
  };

  return (
    <div id="matchup-detail" className="matchup-detail">
      {matchup && (
        <>
          <div className="matchup-detail__controls">
            {editing ? (
              <>
                <EuiButton
                  className="matchup-controls__button"
                  fill
                  iconType="pencil"
                  color="danger"
                  onClick={handleCancel}
                >
                  Cancel
                </EuiButton>
                <EuiButton
                  className="matchup-controls__button"
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
                className="matchup-controls__button"
                fill
                iconType="pencil"
                onClick={() => setEditing(!editing)}
              >
                Edit Page
              </EuiButton>
            )}
          </div>
          <div className="matchup-detail__content">
            <EuiPanel
              className="matchup-content__side-nav"
              hasShadow={false}
              hasBorder
            >
              <EuiAvatar
                size="xl"
                name={character.name}
                imageUrl={
                  "https://www.textures-resource.com/resources/sheet_icons/4/3300.png"
                }
              ></EuiAvatar>
              <EuiSideNav
                className="matchup-content__side-nav__items"
                aria-label="Basic example"
                style={{ width: 192 }}
                items={[
                  {
                    name: character.name,
                    id: 0,
                    items: buildSideNaveItems(),
                  },
                ]}
              />
            </EuiPanel>
            <div id="sections" className="matchup-content__sections">
              {buildSections()}
            </div>
            <div className="matchup-content__right"></div>
          </div>
        </>
      )}
    </div>
  );
};
