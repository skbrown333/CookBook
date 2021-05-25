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

  useEffect(() => {
    async function init() {
      const docs = await firebase?.getUsers(Object.keys(cookbook.roles));
      setUsers(
        docs.map((_user) => {
          const { id, avatar, username, discriminator, doc_ref } = _user;
          return {
            label: `${username}#${discriminator}`,
            value: {
              id,
              avatar,
              doc_ref,
            },
          };
        }),
      );
      if (initialSelected) {
        const doc = await initialSelected.get();
        const author = doc.data();
        const { id, avatar, username, discriminator, doc_ref } = author;

        setSelected([
          {
            label: `${username}#${discriminator}`,
            value: {
              id,
              avatar,
              doc_ref,
            },
          },
        ]);
      } else {
        docs.forEach((_user) => {
          if (user.id === _user.id) {
            const { id, avatar, username, discriminator, doc_ref } = _user;
            setSelected([
              {
                label: `${username}#${discriminator}`,
                value: {
                  id,
                  avatar,
                  doc_ref,
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
    const { id, avatar } = value;
    return (
      <span className="user-input__user">
        <img src={DISCORD.getAvatarUrl(id, avatar)} /> {label}
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
