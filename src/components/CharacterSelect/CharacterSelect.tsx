import React, {
  FunctionComponent,
  useState,
  useEffect,
  useContext,
} from 'react';

/* Components */
import { EuiSuperSelect } from '@elastic/eui';
import { CHARACTERS } from '../../constants/CharacterIcons';

/* Services */
import CharacterService from '../../services/CharacterService/CharacterService';
import { ToastService } from '../../services/ToastService';

/* Store */
import { Context } from '../../store/Store';

/* Styles */
import './_character-select.scss';

export interface CharacterSelectProps {
  onChange: (value: string) => void;
  value?: any;
}

export const CharacterSelect: FunctionComponent<CharacterSelectProps> = ({
  onChange,
  value = {},
}) => {
  const [state] = useContext(Context);
  const [selected, setSelected] = useState(value || undefined);
  const [options, setOptions] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const { cookbook } = state;
  const characterService = new CharacterService();
  const toast = new ToastService();

  useEffect(() => {
    async function init() {
      try {
        const characters = await characterService.get({
          game: cookbook.game._id,
        });
        getOptions(characters);
      } catch (err) {
        toast.errorToast('Error Fetching Characters', err.message);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const getOptions = async (characters) => {
    const optionElements = characters.map((character) => {
      const { name, display_name, _id } = character;
      return {
        value: _id,
        inputDisplay: (
          <span className="character-select__character">
            <img src={CHARACTERS[cookbook.game.name][name]} /> {display_name}
          </span>
        ),
      };
    });

    setOptions(optionElements);
  };

  const handleOnChange = (value) => {
    setSelected(value);
    onChange(value);
  };

  return (
    <EuiSuperSelect
      options={options || []}
      valueOfSelected={selected}
      onChange={handleOnChange}
      isLoading={loading}
    />
  );
};
