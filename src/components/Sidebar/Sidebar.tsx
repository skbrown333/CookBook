import { EuiAvatar, EuiButton, EuiIcon } from '@elastic/eui';
import { Link } from 'react-router-dom';
import React, { FunctionComponent, useContext, useState } from 'react';
import { Context } from '../../store/Store';

import './_sidebar.scss';
import { HeaderSwitcher } from '../HeaderSwitcher/HeaderSwitcher';
import { DISCORD, canManage } from '../../constants/constants';
import { TreeNav } from '../TreeNav/TreeNav';
import { GuideModal } from '../GuideModal/GuideModal';

interface SidebarProps {}

export const Sidebar: FunctionComponent<SidebarProps> = () => {
  const [state] = useContext(Context);
  const { cookbook, user } = state;
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <div className="sidebar">
      <div className="sidebar__header">{cookbook && <HeaderSwitcher />}</div>
      <div className="sidebar__content">
        {cookbook.banner_url && <img src={cookbook.banner_url} />}
        {canManage(user, cookbook) ? (
          <EuiButton
            iconType="plus"
            color="ghost"
            onClick={() => setShowModal(true)}
            className="add-guide"
          >
            Add folder
          </EuiButton>
        ) : null}
        <TreeNav />

        <GuideModal
          open={showModal}
          onClose={() => setShowModal(false)}
          title="Add Guide"
        />
      </div>
      {cookbook && user && (
        <div className="sidebar__footer">
          <EuiAvatar
            imageUrl={DISCORD.getAvatarUrl(user.discord_id, user.avatar)}
            name={`${user.username}#${user.discriminator}`}
            size="m"
          />
          <span className="username">{`${user.username}#${user.discriminator}`}</span>

          {canManage(user, cookbook) ? (
            <span className="settings">
              <Link to={`/${cookbook.name}/settings`}>
                <EuiIcon type="gear" size="m" color="ghost" />
              </Link>
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
};
