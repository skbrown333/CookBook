import React, { FunctionComponent, useContext } from 'react';

import { EuiPanel, EuiAvatar, EuiListGroup, EuiHealth } from '@elastic/eui';

/* Styles */
import './_twitch-sidebar.scss';

/* Store */
import { Context } from '../../store/Store';

export interface TwitchSidebarProps {
  className: string;
}
export const TwitchSidebar: FunctionComponent<TwitchSidebarProps> = (props) => {
  const { twitch } = useContext(Context)[0];

  const handleClick = (url) => {
    window.open(url, '_blank');
  };
  const buildStreams = () => {
    if (!twitch) return;
    const { streams, users } = twitch;
    let online = [];
    let offline = [];
    online = streams.data.map((stream, index) => {
      const { user_name, game_name, viewer_count } = stream;
      let img;
      users.data.forEach((user: any) => {
        if (user.id === stream.user_id) {
          img = user.profile_image_url;
        }
      });
      return (
        <div
          className="stream"
          onClick={() => handleClick('https://www.twitch.tv/' + user_name)}
          key={`online-${index}`}
        >
          <EuiAvatar imageUrl={img} size="l" name="avatar" />
          <div className="stream-info">
            <div className="stream-info__title">
              {user_name}
              <EuiHealth color="danger" className="viewer-count">
                {viewer_count}
              </EuiHealth>
            </div>
            <div className="stream-info__game">{game_name}</div>
          </div>
        </div>
      );
    });

    offline = users.data.map((user, index) => {
      const { profile_image_url, display_name, login } = user;
      for (let i = 0; i < streams.data.length; i++) {
        const stream = streams.data[i];
        if (stream.user_id === user.id) {
          return;
        }
      }
      return (
        <div
          className="stream"
          onClick={() => handleClick('https://www.twitch.tv/' + login)}
          key={`offline-${index}`}
        >
          <EuiAvatar
            imageUrl={profile_image_url}
            size="l"
            name="avatar"
            className="offline"
          />
          <div className="stream-info">
            <div className="stream-info__title">{display_name}</div>
            <div className="stream-info__game">Offline</div>
          </div>
        </div>
      );
    });
    return [...online, ...offline];
  };

  return (
    <div className={props.className}>
      <EuiPanel
        paddingSize="m"
        hasShadow={false}
        hasBorder
        className="twitch-sidebar"
      >
        <div className="twitch-sidebar__header">Twitch</div>
        <div className="twitch-sidebar__streams">
          <EuiListGroup gutterSize="none">{buildStreams()}</EuiListGroup>
        </div>
      </EuiPanel>
    </div>
  );
};
