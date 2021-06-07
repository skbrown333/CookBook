import React, {
  FunctionComponent,
  useContext,
  useState,
  useEffect,
} from 'react';

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
  EuiHeaderLogo,
  EuiHeaderSectionItemButton,
  EuiHideFor,
  EuiSuperSelect,
} from '@elastic/eui';
import { EuiAvatar } from '@elastic/eui';

/* Context */
import { Context } from '../../store/Store';

/* Constants */
import { DISCORD } from '../../constants/constants';
import { CHARACTERS } from '../../constants/CharacterIcons';

/* Styles */
import './_header.scss';
import CookbookService from '../../services/CookbookService/CookbookService';
import { ToastService } from '../../services/ToastService';

export interface HeaderBarProps {}

export const HeaderBar: FunctionComponent<HeaderBarProps> = () => {
  const [state] = useContext(Context);
  const { cookbook, user } = state;
  const [cookbooks, setCookbooks] = useState<any[]>([]);
  const [flyoutVis, setFlyoutVis] = useState(false);
  const cookbookService = new CookbookService();
  const toast = new ToastService();

  useEffect(() => {
    async function init() {
      try {
        const data = await cookbookService.get();
        const options = data.map((d) => {
          return {
            value: d.subdomain,
            inputDisplay: (
              <span className="character-select__character">
                <img src={CHARACTERS[d.name]} /> {`${d.subdomain}.cookbook.gg`}
              </span>
            ),
          };
        });
        if (user && user.super_admin) {
          options.push({
            value: 'dev',
            inputDisplay: (
              <span className="character-select__character">
                <img src={CHARACTERS['falcon']} /> {`dev.cookbook.gg`}
              </span>
            ),
          });
          options.push({
            value: 'localhost',
            inputDisplay: (
              <span className="character-select__character">
                <img src={CHARACTERS['falcon']} /> {`localhost`}
              </span>
            ),
          });
        }

        setCookbooks(options);
      } catch (err) {
        toast.errorToast('Error getting cookbooks', err.message);
      }
    }
    init();
  }, [user]);

  const handleOnChange = (value) => {
    if (value === 'localhost') {
      window.location.replace(`http://localhost:3001`);
      return;
    }
    window.location.replace(`https://${value}.cookbook.gg`);
  };

  const toggleFlyout = () => {
    setFlyoutVis(!flyoutVis);
  };

  const navItems = () => {
    return (
      <>
        <div className="nav-item">
          <Link to="/" onClick={toggleFlyout}>
            <EuiHeaderLink color="success" iconType="home">
              <span className="link-text">Home</span>
            </EuiHeaderLink>
          </Link>
        </div>
        <div className="nav-item">
          <Link to="/recipes" onClick={toggleFlyout}>
            <EuiHeaderLink iconType="discoverApp" color="success">
              <span className="link-text">Guides</span>
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
      {cookbooks.length > 0 && (
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
                <EuiSuperSelect
                  options={cookbooks}
                  valueOfSelected={cookbook.name}
                  onChange={handleOnChange}
                />,
                <EuiHideFor sizes={['xs']}>
                  <EuiHeaderLinks
                    aria-label="App navigation dark theme example"
                    popoverBreakpoints="none"
                  >
                    <Link to="/">
                      <EuiHeaderLink color="success" iconType="home">
                        <span className="link-text">Home</span>
                      </EuiHeaderLink>
                    </Link>
                    <Link to="/recipes">
                      <EuiHeaderLink iconType="discoverApp" color="success">
                        <span className="link-text">Guides</span>
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
