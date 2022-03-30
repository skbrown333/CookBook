import React, {
  FunctionComponent,
  useContext,
  useState,
  useEffect,
} from 'react';

import {
  EuiAvatar,
  EuiListGroup,
  EuiHealth,
  EuiFieldText,
  EuiButtonIcon,
} from '@elastic/eui';

/* Constants */
import { canManage } from '../../constants/constants';

/* Styles */
import './_twitch-sidebar.scss';

/* Store */
import { updateTwitch } from '../../store/actions';

/* Context */
import { Firebase, FirebaseContext } from '../../firebase';
import { Context } from '../../store/Store';

/* Services */
import CookbookService from '../../services/CookbookService/CookbookService';
import { ToastService } from '../../services/ToastService';

export interface TwitchSidebarProps {
  className: string;
}
export const TwitchSidebar: FunctionComponent<TwitchSidebarProps> = (props) => {
  const { twitch } = useContext(Context)[0];
  const [streamInput, setStreamInput] = useState('');
  const [state, dispatch] = useContext(Context);
  const { cookbook, user } = state;
  const cookbookService = new CookbookService();
  const firebase = useContext<Firebase | null>(FirebaseContext);
  const toast = new ToastService();

  useEffect(() => {
    async function init() {
      if (firebase && cookbook.streams.length) {
        try {
          dispatch(
            updateTwitch(await firebase.getTwitchStreams(cookbook.streams)),
          );
        } catch (err: any) {
          toast.errorToast('Error Getting Streams', err.message);
        }
      }
    }
    init();
  }, []);

  const handleClick = (login) => {
    window.open('https://www.twitch.tv/' + login, '_blank');
  };

  const updateStreams = async (streams) => {
    await cookbookService.update(cookbook._id, user, { streams: streams });
    if (firebase) {
      dispatch(updateTwitch(await firebase.getTwitchStreams(streams)));
    }
  };

  const currentStreams = () => {
    let streams, users;
    if (twitch) {
      streams = twitch.streams.data;
      users = twitch.users.data;
    } else {
      streams = users = [];
    }

    const cookStreams = streams
      .map((entry) => entry.user_login)
      .concat(users.map((entry) => entry.login));
    return cookStreams;
  };

  const removeStream = (e, stream) => {
    e.stopPropagation();
    const cookStreams = currentStreams().filter((entry) => entry !== stream);
    updateStreams(cookStreams);
    toast.successToast('Removed ' + stream);
  };

  const addStream = async (e) => {
    if (e.keyCode === 13) {
      const cookStreams = currentStreams();
      if (!cookStreams.includes(streamInput.toLowerCase())) {
        const newStreams = cookStreams.concat(streamInput);
        updateStreams(newStreams);
        toast.successToast('Added ' + streamInput);
      }
      setStreamInput('');
    }
  };

  const buildStreams = () => {
    if (!twitch) return;
    const { streams, users } = twitch;
    let online = [];
    let offline = [];

    const deleteElem = (user_name) => {
      return canManage(user, cookbook) ? (
        <EuiButtonIcon
          className="stream__delete"
          aria-label={`Remove ${user_name}`}
          iconType="minusInCircle"
          size="m"
          color="danger"
          onClick={(e) => removeStream(e, user_name)}
        />
      ) : (
        <></>
      );
    };

    online = streams.data.map((stream, index) => {
      const { user_name, game_name, viewer_count, user_login } = stream;
      let img;
      users.data.forEach((user: any) => {
        if (user.id === stream.user_id) {
          img = user.profile_image_url;
        }
      });
      return (
        <div
          className="stream"
          onClick={() => handleClick(user_login)}
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
          {deleteElem(user_login)}
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
          onClick={() => handleClick(login)}
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
          {deleteElem(login)}
        </div>
      );
    });
    return [...online, ...offline];
  };

  return (
    <div className={props.className}>
      <div className="twitch-sidebar">
        <div className="twitch-sidebar__header">Twitch</div>
        <div className="twitch-sidebar__streams">
          <EuiListGroup gutterSize="none">{buildStreams()}</EuiListGroup>
          {canManage(user, cookbook) && (
            <EuiFieldText
              className="twitch-sidebar__input"
              placeholder="new stream username"
              value={streamInput}
              onChange={(e) => setStreamInput(e.target.value)}
              onKeyDown={addStream}
            />
          )}
        </div>
      </div>
    </div>
  );
};
