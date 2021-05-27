import React, {
  FunctionComponent,
  useState,
  useContext,
  useEffect,
} from 'react';

import { EuiComboBox } from '@elastic/eui';
import { FirebaseContext } from '../../firebase';
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
  const firebase = useContext(FirebaseContext);
  const { cookbook, user } = state;
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
      if (initialSelected) {
        const user = await userService.getById(initialSelected);
        const { discord_id, avatar, username, discriminator } = user;

        setSelected([
          {
            label: `${username}#${discriminator}`,
            value: {
              discord_id,
              avatar,
            },
          },
        ]);
      } else {
        users.forEach((_user) => {
          if (user._id === _user._id) {
            const { discord_id, avatar, username, discriminator } = _user;
            setSelected([
              {
                label: `${username}#${discriminator}`,
                value: {
                  discord_id,
                  avatar,
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
    if (selected && selected[0] && selected[0].value.doc_ref) {
      handleUpdate(selected[0]);
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
