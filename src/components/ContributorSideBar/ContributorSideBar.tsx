import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';

/* Store */
import { Context } from '../../store/Store';

/* Components */
import { EuiAvatar, EuiListGroup, EuiButton } from '@elastic/eui';

/* Models */
import { User } from '../../models/User';

/* Services */
import UserService from '../../services/UserService/UserService';

/* Constants */
import { DISCORD } from '../../constants/constants';

/* Styles */
import './_contributor-side-bar.scss';

export interface ContributorSideBar {}

export const ContributorSideBar: FunctionComponent<ContributorSideBar> = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [state] = useContext(Context);
  const { cookbook } = state;
  const userService = new UserService();

  useEffect(() => {
    async function init() {
      if (!cookbook) return;
      const roles = Object.keys(cookbook.roles).filter((uid) => {
        if (cookbook.roles[uid] === 'chef') {
          return uid;
        }
      });
      const users = await userService.get({ in: roles });
      setUsers(users);
    }
    init();
  }, []);

  const hanldeDonateClick = () => {
    window.open(cookbook.donation_link, '_blank');
  };

  const buildChefs = () => {
    if (!users.length) return;
    return users.map((user, index) => {
      const { username, avatar, discord_id } = user;
      return (
        <div className="chef" onClick={() => {}} key={`${index}`}>
          <EuiAvatar
            imageUrl={DISCORD.getAvatarUrl(discord_id, avatar)}
            size="l"
            name="avatar"
          />
          <div className="chef-info">
            <div className="chef-info__username">@{username}</div>
          </div>
        </div>
      );
    });
  };

  return (
    <div id="contributor-sidebar">
      <div className="contributor-sidebar">
        <div className="contributor-sidebar__header">
          Chefs
          {cookbook.donation_link && (
            <EuiButton
              color="secondary"
              fill
              className="donate"
              onClick={hanldeDonateClick}
            >
              $ Donate
            </EuiButton>
          )}
        </div>
        <div className="contributor-sidebar__chefs">
          <EuiListGroup gutterSize="none">{buildChefs()}</EuiListGroup>
        </div>
      </div>
    </div>
  );
};
