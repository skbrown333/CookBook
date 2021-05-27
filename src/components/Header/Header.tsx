import React, { FunctionComponent, useContext } from 'react';

import { Link } from 'react-router-dom';

/* Components */
import {
  EuiHeader,
  EuiHeaderLink,
  EuiHeaderLinks,
  EuiHeaderLogo,
  EuiHeaderSectionItemButton,
} from '@elastic/eui';
import { EuiAvatar } from '@elastic/eui';

/* Context */
import { Context } from '../../store/Store';

/* Constants */
import { DISCORD } from '../../constants/constants';
import { CHARACTERS } from '../../constants/CharacterIcons';

/* Styles */
import './_header.scss';

export interface HeaderBarProps {}

export const HeaderBar: FunctionComponent<HeaderBarProps> = () => {
  const [state] = useContext(Context);
  const { cookbook, user } = state;
  const { name } = cookbook;
  return (
    <EuiHeader
      id="header"
      theme="default"
      position="fixed"
      sections={[
        {
          items: [
            <Link to="/">
              <EuiHeaderLogo iconType={CHARACTERS[name]}>
                cookbook.gg
              </EuiHeaderLogo>
            </Link>,
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
          ],
          borders: 'right',
        },
        {
          items: [
            ...(user && cookbook.roles[user.uid] === 'admin'
              ? [
                  <EuiHeaderSectionItemButton aria-label="Account menu">
                    <EuiAvatar
                      imageUrl={DISCORD.getAvatarUrl(
                        user.discord_id,
                        user.avatar,
                      )}
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
              : [<></>]),
            ,
          ],
          borders: 'left',
        },
      ]}
    />
  );
};
