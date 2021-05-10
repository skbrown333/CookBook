import React, {
  FunctionComponent,
  useEffect,
  useState,
  useContext,
} from "react";

import { Link } from "react-router-dom";

/* Components */
import {
  EuiHeader,
  EuiHeaderLink,
  EuiHeaderLinks,
  EuiHeaderLogo,
  EuiHeaderSectionItem,
  EuiHeaderSectionItemButton,
  EuiButton,
} from "@elastic/eui";
import { EuiIcon, EuiAvatar } from "@elastic/eui";
import { Firebase, FirebaseContext } from "../../firebase";
import { DISCORD } from "../../constants/constants";

export interface HeaderBarProps {}

export const HeaderBar: FunctionComponent<HeaderBarProps> = () => {
  const [user, setUser] = useState<any>(null);
  const context = useContext<Firebase | null>(FirebaseContext);

  useEffect(() => {
    init();
    async function init() {
      if (!context) return;
      try {
        const user = await context.getCurrentUser();
        setUser(user);
      } catch (err) {
        console.log(err);
      }
    }
  }, []);

  return (
    <EuiHeader
      theme="default"
      position="fixed"
      sections={[
        {
          items: [
            <Link to="/">
              <EuiHeaderLogo iconType="https://ssb.wiki.gallery/images/5/5f/CaptainFalconHeadSSBM.png">
                cookbook.gg
              </EuiHeaderLogo>
            </Link>,
          ],
          borders: "right",
        },
        {
          items: [
            <EuiHeaderLinks
              aria-label="App navigation dark theme example"
              popoverBreakpoints="none"
            >
              <Link to="/recipes">
                <EuiHeaderLink iconType="discoverApp" color="success">
                  Guides
                </EuiHeaderLink>
              </Link>
            </EuiHeaderLinks>,
            ...(user
              ? [
                  <EuiHeaderSectionItemButton aria-label="Account menu">
                    <EuiAvatar
                      imageUrl={DISCORD.getAvatarUrl(user.id, user.avatar)}
                      name={`${user.username}#${user.discriminator}`}
                      size="m"
                    />
                  </EuiHeaderSectionItemButton>,
                  <EuiHeaderLinks
                    aria-label="App navigation dark theme example"
                    popoverBreakpoints="all"
                  >
                    <Link to="/settings">
                      <EuiHeaderLink iconType="managementApp">
                        Settings
                      </EuiHeaderLink>
                    </Link>
                  </EuiHeaderLinks>,
                ]
              : []),
            ,
          ],
          borders: "left",
        },
      ]}
    />
  );
};
