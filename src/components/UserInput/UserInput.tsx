import React, {
  FunctionComponent,
  useState,
  useContext,
  useEffect,
} from 'react';

import { EuiComboBox } from '@elastic/eui';
import { Context } from '../../store/Store';
import { DISCORD } from '../../constants/constants';

import './_user-input.scss';
import UserService from '../../services/UserService/UserService';

export interface UserInputInterface {
  initialSelected?: any;
  handleUpdate: (option) => void;
}

export const UserInput: FunctionComponent<UserInputInterface> = ({
  initialSelected,
  handleUpdate,
}) => {
  const [users, setUsers] = useState<Array<any>>([]);
  const [selected, setSelected] = useState<any>(null);
  const [state] = useContext(Context);
  const { user } = state;
  const userService = new UserService();

  useEffect(() => {
    async function init() {
      const users = await userService.get();
      setUsers(
        users.map((_user) => {
          const { discord_id, avatar, username, discriminator } = _user;
          return {
            label: `${username}#${discriminator}`,
            value: {
              discord_id,
              avatar,
            },
          };
        }),
      );
      if (initialSelected && initialSelected._id) {
        const user = await userService.getById(initialSelected._id);
        const { discord_id, avatar, username, discriminator, _id } = user;

        setSelected([
          {
            label: `${username}#${discriminator}`,
            value: {
              discord_id,
              avatar,
              _id,
            },
          },
        ]);
      } else {
        users.forEach((_user) => {
          if (user._id === _user._id) {
            const { discord_id, avatar, username, discriminator, _id } = _user;
            setSelected([
              {
                label: `${username}#${discriminator}`,
                value: {
                  discord_id,
                  avatar,
                  _id,
                },
              },
            ]);
          }
        });
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (selected && selected[0] && selected[0].value) {
      handleUpdate(selected[0].value._id);
    }
  }, [selected]);

  const handleChange = async (selected) => {
    setSelected(selected);
  };

  const renderOption = (_user) => {
    const { value, label } = _user;
    const { discord_id, avatar } = value;
    return (
      <span className="user-input__user">
        <img src={DISCORD.getAvatarUrl(discord_id, avatar)} /> {label}
      </span>
    );
  };

  return (
    <>
      {users && selected && user && (
        <EuiComboBox
          placeholder="Author"
          singleSelection={{ asPlainText: true }}
          options={users}
          selectedOptions={selected}
          onChange={handleChange}
          renderOption={renderOption}
        />
      )}
    </>
  );
};
