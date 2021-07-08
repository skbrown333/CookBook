import React, { FunctionComponent, useContext, useState } from 'react';

import { Link } from 'react-router-dom';

/* Components */
import {
  EuiButtonIcon,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutHeader,
  EuiHeader,
  EuiHeaderLink,
  EuiHeaderLinks,
  EuiHeaderSectionItemButton,
  EuiHideFor,
  EuiIcon,
} from '@elastic/eui';
import { EuiAvatar } from '@elastic/eui';

/* Context */
import { Context } from '../../store/Store';

/* Constants */
import { DISCORD, ROLES } from '../../constants/constants';

/* Styles */
import './_header.scss';

/* Services */
import { HeaderSwitcher } from './HeaderSwitcher/HeaderSwitcher';

export interface HeaderBarProps {}

export const HeaderBar: FunctionComponent<HeaderBarProps> = () => {
  const [state] = useContext(Context);
  const { game, user, cookbook } = state;
  const [flyoutVis, setFlyoutVis] = useState(false);

  const toggleFlyout = () => {
    setFlyoutVis(!flyoutVis);
  };

  const navItems = () => {
    return (
      <>
        <div className="nav-item">
          <Link to={`/${cookbook.name}`} onClick={toggleFlyout}>
            <EuiHeaderLink color="success" iconType="home">
              <span className="link-text">Home</span>
            </EuiHeaderLink>
          </Link>
        </div>
        <div className="nav-item">
          <Link to={`/${cookbook.name}/recipes`} onClick={toggleFlyout}>
            <EuiHeaderLink iconType="discoverApp" color="success">
              <span className="link-text">Guides</span>
            </EuiHeaderLink>
          </Link>
        </div>
        <div className="nav-item">
          <Link to="/about" onClick={toggleFlyout}>
            <EuiHeaderLink iconType="questionInCircle" color="success">
              <span className="link-text">About</span>
            </EuiHeaderLink>
          </Link>
        </div>
      </>
    );
  };

  const flyout = () => {
    return (
      <EuiFlyout ownFocus side="left" onClose={toggleFlyout}>
        <EuiFlyoutHeader></EuiFlyoutHeader>
        <EuiFlyoutBody>{navItems()}</EuiFlyoutBody>
      </EuiFlyout>
    );
  };

  return (
    <>
      {game && cookbook && (
        <EuiHeader
          id="header"
          theme="default"
          position="fixed"
          sections={[
            {
              items: [
                <EuiHideFor sizes={['s', 'm', 'l', 'xl']}>
                  <EuiButtonIcon
                    onClick={toggleFlyout}
                    aria-label="menu-flyout"
                    iconType="menuRight"
                    iconSize="l"
                    color="success"
                  />
                </EuiHideFor>,
                <HeaderSwitcher />,
                <EuiHideFor sizes={['xs']}>
                  <EuiHeaderLinks
                    aria-label="App navigation dark theme example"
                    popoverBreakpoints="none"
                  >
                    <Link to={`/${cookbook.name}`}>
                      <EuiHeaderLink color="success">
                        <span className="link-text">Home</span>
                      </EuiHeaderLink>
                    </Link>
                    <Link to={`/${cookbook.name}/recipes`}>
                      <EuiHeaderLink color="success">
                        <span className="link-text">Guides</span>
                      </EuiHeaderLink>
                    </Link>
                    <Link to="/about">
                      <EuiHeaderLink color="success">
                        <span className="link-text">About</span>
                      </EuiHeaderLink>
                    </Link>
                  </EuiHeaderLinks>
                </EuiHideFor>,
              ],
              borders: 'right',
            },
            {
              items: [
                ...(user
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
                    ]
                  : [<></>]),
                ...(user && ROLES.admin.includes(cookbook.roles[user.uid])
                  ? [
                      <EuiHeaderSectionItemButton aria-label="Account menu">
                        <Link to={`/${cookbook.name}/settings`}>
                          <EuiIcon type="gear" size="m" color="ghost" />
                        </Link>
                      </EuiHeaderSectionItemButton>,
                    ]
                  : [<></>]),
              ],
              borders: 'left',
            },
          ]}
        />
      )}
      {flyoutVis && flyout()}
    </>
  );
};
