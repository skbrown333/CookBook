import React, {
  FunctionComponent,
  useContext,
  useState,
  useEffect,
} from 'react';

/* Component */
import {
  EuiAvatar,
  EuiBasicTable,
  EuiButton,
  EuiButtonEmpty,
  EuiButtonIcon,
  EuiComboBox,
  EuiForm,
  EuiFormRow,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiSuperSelect,
} from '@elastic/eui';
import { SearchCreateBar } from '../../SearchCreateBar/SearchCreateBar';

/* Services */
import { ToastService } from '../../../services/ToastService';
import CookbookService from '../../../services/CookbookService/CookbookService';
import UserService from '../../../services/UserService/UserService';

/* Store */
import { Context } from '../../../store/Store';
import { updateCookbook } from '../../../store/actions';

/* Constants */
import { DISCORD } from '../../../constants/constants';

/* Styles */
import './_access-view.scss';

export interface AccessViewProps {}

export const AccessView: FunctionComponent<AccessViewProps> = () => {
  const [saving, setSaving] = useState<boolean>(false);
  const [userItems, setUserItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState<any>(null);
  const [newRole, setNewRole] = useState<any>(null);
  const [userToRemove, setUserToRemove] = useState<any>(null);
  const [showAddUser, setShowAddUser] = useState<boolean>(false);
  const [showRemoveUser, setShowRemoveUser] = useState<boolean>(false);
  const [searchText, setSearchText] = useState('');
  const [state, dispatch] = useContext(Context);
  const { user, cookbook } = state;
  const cookbookService = new CookbookService();
  const userService = new UserService();
  const toast = new ToastService();

  useEffect(() => {
    async function init() {
      const users = await userService.get();
      const filteredUsers = users.filter((_user) => {
        return !!cookbook.roles[_user.uid];
      });

      setUsers(
        users
          .filter((_user) => {
            return !cookbook.roles[_user.uid];
          })
          .map((_user) => {
            const { discord_id, avatar, username, discriminator, _id, uid } =
              _user;
            return {
              label: `${username}#${discriminator}`,
              value: {
                discord_id,
                avatar,
                _id,
                uid,
              },
            };
          }),
      );

      setUserItems(
        filteredUsers.map((user) => {
          const { _id, username, discriminator, uid, avatar, discord_id } =
            user;
          return {
            id: _id,
            discord: { username, avatar, discord_id, discriminator },
            role: cookbook.roles[uid],
            uid,
          };
        }),
      );
    }
    init();
  }, [cookbook]);

  const handleRoleChange = async (role, _user) => {
    setSaving(true);
    const roles = { ...cookbook.roles, ...{ [_user.uid]: role } };
    await updateRoles(roles);
    setSaving(false);
  };

  const renderOption = (_user) => {
    const { value, label } = _user;
    const { discord_id, avatar } = value;
    return (
      <span className="user-input__user">
        <EuiAvatar
          imageUrl={DISCORD.getAvatarUrl(discord_id, avatar)}
          name={discord_id}
          size="s"
          style={{ marginRight: 12 }}
        />
        {label}
      </span>
    );
  };

  const handleNewUser = (_user) => {
    setNewUser(_user);
  };

  const handleNewRole = (role) => {
    setNewRole(role);
  };

  const closeModal = () => {
    setShowAddUser(false);
  };

  const showModal = () => {
    setShowAddUser(true);
  };

  const closeRemoveModal = () => {
    setShowRemoveUser(false);
  };

  const showRemoveModal = () => {
    setShowRemoveUser(true);
  };

  const updateRoles = async (roles) => {
    try {
      const updatedCookbook = await cookbookService.update(cookbook._id, user, {
        roles,
      });
      dispatch(updateCookbook(updatedCookbook));
      toast.successToast(`Roles Updated`);
    } catch (err: any) {
      toast.errorToast(`Failed updating roles`, err.message);
    }
  };

  const handleAddUser = async (event) => {
    event.preventDefault();
    const newRoles = {
      ...cookbook.roles,
      ...{ [newUser[0].value.uid]: newRole },
    };
    await updateRoles(newRoles);
    closeModal();
  };

  const handleRemoveUser = async () => {
    const newRoles = { ...cookbook.roles };
    delete newRoles[userToRemove.uid];
    await updateRoles(newRoles);
    closeRemoveModal();
  };

  const updateSearchText = (event) => {
    const value = event.target.value;
    setSearchText(value);
  };

  const addRoleModal = (
    <EuiModal
      className="access-view__modal"
      onClose={closeModal}
      initialFocus="[name=popswitch]"
    >
      <EuiModalHeader>
        <EuiModalHeaderTitle>
          <h1>Add User</h1>
        </EuiModalHeaderTitle>
      </EuiModalHeader>
      <EuiModalBody>
        {users && users.length > 0 && (
          <EuiForm id="newUserForm" component="form">
            <EuiFormRow label="User">
              <EuiComboBox
                placeholder="User"
                singleSelection={{ asPlainText: true }}
                options={users}
                selectedOptions={newUser ? newUser : undefined}
                onChange={handleNewUser}
                renderOption={renderOption}
              />
            </EuiFormRow>
            <EuiFormRow label="Role">
              <EuiSuperSelect
                options={[
                  {
                    value: 'chef',
                    inputDisplay: <span className="role">Chef</span>,
                  },
                  {
                    value: 'admin',
                    inputDisplay: <span className="role">Admin</span>,
                  },
                  {
                    value: 'none',
                    inputDisplay: <span className="role">None</span>,
                  },
                ]}
                valueOfSelected={newRole}
                onChange={handleNewRole}
              />
            </EuiFormRow>
          </EuiForm>
        )}
      </EuiModalBody>
      <EuiModalFooter>
        <EuiButtonEmpty onClick={closeModal}>Cancel</EuiButtonEmpty>
        <EuiButton
          type="submit"
          form="postForm"
          onClick={handleAddUser}
          fill
          disabled={!newUser || !newRole}
        >
          Add
        </EuiButton>
      </EuiModalFooter>
    </EuiModal>
  );

  const removeUserModal = (
    <EuiModal
      className="access-view__modal"
      onClose={closeRemoveModal}
      initialFocus="[name=popswitch]"
    >
      <EuiModalHeader>
        <EuiModalHeaderTitle>
          <h1>Remove User</h1>
        </EuiModalHeaderTitle>
      </EuiModalHeader>
      <EuiModalBody>
        Are you sure you want to remove: <br />
        {userToRemove && (
          <span
            className="user"
            style={{ display: 'flex', alignItems: 'center', padding: 12 }}
          >
            <EuiAvatar
              imageUrl={DISCORD.getAvatarUrl(
                userToRemove.discord.discord_id,
                userToRemove.discord.avatar,
              )}
              name={`${userToRemove.discord.username}#${userToRemove.discord.discriminator}`}
              size="m"
              style={{ marginRight: 12 }}
            />
            <div className="username">
              {`${userToRemove.discord.username}#${userToRemove.discord.discriminator}`}
            </div>
          </span>
        )}
      </EuiModalBody>
      <EuiModalFooter>
        <EuiButtonEmpty onClick={closeRemoveModal}>Cancel</EuiButtonEmpty>
        <EuiButton onClick={handleRemoveUser} fill>
          Confirm
        </EuiButton>
      </EuiModalFooter>
    </EuiModal>
  );

  const columns = [
    {
      field: 'discord',
      name: 'Discord',
      render: (_user) => {
        return (
          <>
            <EuiAvatar
              imageUrl={DISCORD.getAvatarUrl(_user.discord_id, _user.avatar)}
              name={`${_user.username}#${_user.discriminator}`}
              size="m"
            />
            <div className="username">
              {`${_user.username}#${_user.discriminator}`}
            </div>
          </>
        );
      },
    },
    {
      field: 'role',
      name: 'Role',
      render: (role, _user) => {
        return (
          <>
            <EuiSuperSelect
              options={[
                {
                  value: 'chef',
                  inputDisplay: <span className="role">Chef</span>,
                },
                {
                  value: 'admin',
                  inputDisplay: <span className="role">Admin</span>,
                },
                {
                  value: 'none',
                  inputDisplay: <span className="role">None</span>,
                },
              ]}
              valueOfSelected={role}
              onChange={(value) => handleRoleChange(value, _user)}
            />
            <EuiButtonIcon
              onClick={() => {
                setUserToRemove(_user);
                showRemoveModal();
              }}
              iconType="minusInCircle"
              color="danger"
              style={{ marginLeft: 12 }}
            ></EuiButtonIcon>
          </>
        );
      },
    },
  ];
  return (
    <div className="access-view">
      <div className="access-view__header">Access</div>
      <div className="access-view__content">
        {showAddUser && addRoleModal}
        {showRemoveUser && userToRemove && removeUserModal}
        <SearchCreateBar
          handlePlus={showModal}
          handleSearch={updateSearchText}
          disableTags
        />
        <EuiBasicTable
          items={userItems.filter(
            (item: any) =>
              `${item.discord.username}${item.discord.discriminator}`
                .toUpperCase()
                .indexOf(searchText.replace(/#+/, '').toUpperCase()) > -1,
          )}
          rowHeader="firstName"
          columns={columns}
        />
      </div>
    </div>
  );
};
