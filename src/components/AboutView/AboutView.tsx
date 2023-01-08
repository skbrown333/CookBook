import React, { FunctionComponent, useEffect, useState } from 'react';

/* Component */
import { EuiAvatar, EuiButton, EuiHorizontalRule, EuiIcon } from '@elastic/eui';
import {
  RiTwitterLine,
  RiPatreonLine,
  RiYoutubeLine,
  RiTwitchLine,
  RiDiscordLine,
  RiGithubLine,
} from 'react-icons/ri';

import { SiKoFi } from 'react-icons/si';

/* Models */
import { User } from '../../models/User';

/* Services */
import UserService from '../../services/UserService/UserService';

/* Constants */
import { DISCORD } from '../../constants/constants';

/* Styles */
import './_about-view.scss';
import { useSwipeable } from 'react-swipeable';

export interface AboutViewProps {}

export const AboutView: FunctionComponent<AboutViewProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const userService = new UserService();

  const handlers = useSwipeable({
    onSwipedLeft: () => setIsOpen(false),
    onSwipedRight: () => setIsOpen(true),
    delta: 1,
  });

  useEffect(() => {
    async function init() {
      setUsers(await userService.get({ super_admin: true }));
    }
    init();
  }, []);

  const buildLinks = (user) => {
    const { links } = user;
    const linkElements: any = [];

    if (!links) return;

    if (links.twitter) {
      linkElements.push(
        <RiTwitterLine
          className="icon"
          onClick={() => window.open(links.twitter, '_blank')}
        />,
      );
    }

    if (links.twitch) {
      linkElements.push(
        <RiTwitchLine
          className="icon"
          onClick={() => window.open(links.twitch, '_blank')}
        />,
      );
    }

    if (links.discord) {
      linkElements.push(
        <RiDiscordLine
          className="icon"
          onClick={() => window.open(links.discord, '_blank')}
        />,
      );
    }

    if (links.youtube) {
      linkElements.push(
        <RiYoutubeLine
          className="icon"
          onClick={() => window.open(links.youtube, '_blank')}
        />,
      );
    }

    if (links.patreon) {
      linkElements.push(
        <RiPatreonLine
          className="icon"
          onClick={() => window.open(links.patreon, '_blank')}
        />,
      );
    }

    return linkElements;
  };

  const buildDevTeam = () => {
    if (!users.length) return;
    return users.map((user, index) => {
      const { username, avatar, discord_id, links } = user;
      const hasValidLinks =
        links &&
        ['twitter', 'twitch', 'youtube', 'patreon'].some((l) =>
          Object.keys(links).includes(l),
        );
      return (
        <div
          className="dev"
          onClick={() => {}}
          key={`${index}`}
          style={
            hasValidLinks
              ? { alignItems: 'flex-start' }
              : { alignItems: 'center' }
          }
        >
          <EuiAvatar
            imageUrl={DISCORD.getAvatarUrl(discord_id, avatar)}
            size="l"
            name="avatar"
          />
          <div className="dev-info">
            <div className="dev-info__username">@{username}</div>
            {buildLinks(user)}
          </div>
        </div>
      );
    });
  };

  return (
    <div id="about-view" style={{ marginLeft: isOpen ? 332 : 0 }} {...handlers}>
      <div className="about-view">
        <div className="about-view__header"></div>
        <div className="about-view__content">
          <div className="about-view__bio">
            <h1>
              <EuiIcon
                type={isOpen ? 'menuLeft' : 'menuRight'}
                className="menu-icon"
                onClick={() => setIsOpen(!isOpen)}
                size="xl"
                color="success"
              />
              Cookbook.gg
            </h1>
            <EuiHorizontalRule />
            <div>
              Cookbook.gg is trying to consolidate character specific content
              created by top players into one central spot.
            </div>
            <div>
              This began as the site for the&nbsp;
              <a
                href="https://discord.gg/KUJ6XZU"
                target="_blank"
                rel="noreferrer"
              >
                Cookbook Discord <RiDiscordLine />
              </a>
              , but it has become a much broader application available to any
              character/game.
            </div>
            <div>
              We are currently still building the site and looking for more
              people to contribute content.
            </div>
          </div>
          <div className="about-view__contribute">
            <h1>Contribute</h1>
            <EuiHorizontalRule />
            Cookbook.gg was built by a community and we are continually looking
            for people to join in on the process! If you would like to become a
            chef or if you want to be a part of our dev team come vist our&nbsp;
            <a
              href="https://discord.gg/JYbF6uY5cW"
              target="_blank"
              rel="noreferrer"
            >
              Discord <RiDiscordLine />
            </a>
            &nbsp;or check out our&nbsp;
            <a
              href="https://github.com/skbrown333/CookBook"
              target="_blank"
              rel="noreferrer"
            >
              Github <RiGithubLine />
            </a>
          </div>
          <div className="about-view__donate">
            <h1>Donate</h1>
            <EuiHorizontalRule />
            Our goal is to keep this site 100% free with no ads and in order to
            do that we are relying on voluntary support from the community. If
            you enjoy using the site please consider donating, thank you!!!
            <EuiButton
              fill
              color="secondary"
              onClick={() => {
                window.open('https://ko-fi.com/cookbookgg', '_blank');
              }}
            >
              <SiKoFi />
              &nbsp;Donate
            </EuiButton>
          </div>
          <div className="about-view__developers">
            <h1>Dev Team</h1>
            <EuiHorizontalRule />
            {buildDevTeam()}
          </div>
        </div>
        <div className="about-view__footer"></div>
      </div>
    </div>
  );
};
