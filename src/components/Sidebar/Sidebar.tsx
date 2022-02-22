import {
  EuiAvatar,
  EuiButton,
  EuiButtonEmpty,
  EuiFieldText,
  EuiForm,
  EuiFormRow,
  EuiIcon,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiPopover,
  EuiTextArea,
  EuiTreeView,
} from '@elastic/eui';
import { Link } from 'react-router-dom';
import React, { FunctionComponent, useContext, useState } from 'react';
import { Guide } from '../../models/Guide';
import GuideService from '../../services/GuideService/GuideService';
import { ToastService } from '../../services/ToastService';
import { Context } from '../../store/Store';
import { useHistory } from 'react-router-dom';

import './_sidebar.scss';
import { HeaderSwitcher } from '../HeaderSwitcher/HeaderSwitcher';
import { CHARACTERS, DISCORD, ROLES } from '../../constants/constants';
import { TreeNav } from '../TreeNav/TreeNav';
import { CharacterSelect } from '../CharacterSelect/CharacterSelect';
import { updateCookbook, updateGuides } from '../../store/actions';

const emptyGuide = {
  title: '',
  sections: [],
  tags: [],
};

interface SidebarProps {}

export const Sidebar: FunctionComponent<SidebarProps> = () => {
  const [state, dispatch] = useContext(Context);
  const { cookbook, user } = state;
  const [guide, setGuide] = useState<Guide>(emptyGuide);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showErrors, setShowErrors] = useState<boolean>(false);
  const [creating, setCreating] = useState<boolean>(false);
  const guideService = new GuideService(cookbook._id);

  const toast = new ToastService();
  const slugErrors = ['An invalid URL slug was specified'];

  const handleSlugChange = async (e) => {
    if (
      e.target.value.length === 0 ||
      /^[a-zA-Z0-9_-]{3,45}$/g.test(e.target.value)
    ) {
      setShowErrors(false);
    } else {
      setShowErrors(true);
    }
    setGuide({ ...guide, ...{ slug: e.target.value } });
  };

  const GuideForm = (
    <EuiForm id="guideForm" component="form">
      <EuiFormRow label="Title">
        <EuiFieldText
          value={guide.title}
          required
          onChange={(e) => setGuide({ ...guide, ...{ title: e.target.value } })}
        />
      </EuiFormRow>
      <EuiFormRow label="Description (optional)">
        <EuiTextArea
          resize="none"
          value={guide.description || ''}
          onChange={(e) =>
            setGuide({ ...guide, ...{ description: e.target.value } })
          }
        />
      </EuiFormRow>
      <EuiFormRow label="Select Character (optional)">
        <CharacterSelect
          onChange={(value) => setGuide({ ...guide, ...{ character: value } })}
          value={guide.character ? guide.character._id : null}
        />
      </EuiFormRow>
      <EuiFormRow
        label="Custom URL Slug (optional)"
        isInvalid={showErrors}
        error={slugErrors}
      >
        <EuiFieldText
          value={guide.slug !== guide._id ? guide.slug : ''}
          onChange={handleSlugChange}
          isInvalid={showErrors}
        />
      </EuiFormRow>
    </EuiForm>
  );

  const createGuide = async (newGuide) => {
    const { character, description, tags, title } = newGuide;
    const slug =
      newGuide.slug && newGuide.slug.length > 0
        ? newGuide.slug.toLowerCase()
        : undefined;
    try {
      const guide = await guideService.create(
        {
          character,
          description,
          sections: [],
          tags,
          title,
          slug,
        },
        user,
      );
      cookbook.guides.push(guide._id);
      dispatch(
        updateCookbook({
          ...cookbook,
        }),
      );
      toast.successToast(
        guide.title,
        'Guide succesfully created',
        character ? CHARACTERS[cookbook.game.name][character] : null,
      );
    } catch (err: any) {
      toast.errorToast('Failed to create guide', err.message);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setGuide(emptyGuide);
  };

  const handleSave = async (event) => {
    event?.preventDefault();
    try {
      setCreating(true);
      await createGuide(guide);
      const guides = await guideService.getByCookbook(cookbook._id);
      dispatch(updateGuides([...guides], cookbook));
      setGuide(emptyGuide);
      setShowModal(false);
    } finally {
      setCreating(false);
    }
  };

  const Modal = (title, save) => {
    return (
      <EuiModal onClose={handleCancel} initialFocus="[name=popswitch]">
        <EuiModalHeader>
          <EuiModalHeaderTitle>
            <h1>{title}</h1>
          </EuiModalHeaderTitle>
        </EuiModalHeader>
        <EuiModalBody>{GuideForm}</EuiModalBody>
        <EuiModalFooter>
          <EuiButtonEmpty onClick={handleCancel}>Cancel</EuiButtonEmpty>
          <EuiButton
            type="submit"
            form="guideForm"
            onClick={save}
            fill
            disabled={!guide.title || guide.title.length === 0 || showErrors}
            isLoading={creating}
          >
            Save
          </EuiButton>
        </EuiModalFooter>
      </EuiModal>
    );
  };

  return (
    <div className="sidebar">
      <div className="sidebar__header">{cookbook && <HeaderSwitcher />}</div>
      <div className="sidebar__content">
        {cookbook.banner_url && <img src={cookbook.banner_url} />}
        {user &&
        (ROLES.admin.includes(cookbook.roles[user.uid]) || user.super_admin) ? (
          <EuiButton
            iconType="plus"
            color="ghost"
            onClick={() => setShowModal(true)}
            className="add-guide"
          >
            Add guide
          </EuiButton>
        ) : null}
        <TreeNav />
        {showModal === true && Modal('Add Guide', handleSave)}
      </div>
      {cookbook && user && (
        <div className="sidebar__footer">
          <EuiAvatar
            imageUrl={DISCORD.getAvatarUrl(user.discord_id, user.avatar)}
            name={`${user.username}#${user.discriminator}`}
            size="m"
          />
          <span className="username">{`${user.username}#${user.discriminator}`}</span>

          {ROLES.admin.includes(cookbook.roles[user.uid]) ||
          user.super_admin ? (
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
