import React, { FunctionComponent, useState } from 'react';

/* Components */
import { EuiSuperSelect } from '@elastic/eui';
import { CHARACTERS } from '../../constants/CharacterIcons';

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
  const [selected, setSelected] = useState(value || undefined);
  const options = [
    {
      value: 'wireframe',
      inputDisplay: (
        <span className="character-select__character">
          <img src={CHARACTERS.wireframe} /> General
        </span>
      ),
    },
    {
      value: 'bowser',
      inputDisplay: (
        <span className="character-select__character">
          <img src={CHARACTERS.bowser} /> Bowser
        </span>
      ),
    },
    {
      value: 'donkey_kong',
      inputDisplay: (
        <span className="character-select__character">
          <img src={CHARACTERS.donkey_kong} /> Donkey Kong
        </span>
      ),
    },
    {
      value: 'dr_mario',
      inputDisplay: (
        <span className="character-select__character">
          <img src={CHARACTERS.dr_mario} /> Dr. Mario
        </span>
      ),
    },
    {
      value: 'falco',
      inputDisplay: (
        <span className="character-select__character">
          <img src={CHARACTERS.falco} /> Falco
        </span>
      ),
    },
    {
      value: 'falcon',
      inputDisplay: (
        <span className="character-select__character">
          <img src={CHARACTERS.falcon} /> Captain Falcon
        </span>
      ),
    },
    {
      value: 'fox',
      inputDisplay: (
        <span className="character-select__character">
          <img src={CHARACTERS.fox} /> Fox
        </span>
      ),
    },
    {
      value: 'game_and_watch',
      inputDisplay: (
        <span className="character-select__character">
          <img src={CHARACTERS.game_and_watch} /> Mr. Game & Watch
        </span>
      ),
    },
    {
      value: 'ganon',
      inputDisplay: (
        <span className="character-select__character">
          <img src={CHARACTERS.ganon} /> Ganondorf
        </span>
      ),
    },
    {
      value: 'ice_climbers',
      inputDisplay: (
        <span className="character-select__character">
          <img src={CHARACTERS.ice_climbers} /> Ice Climbers
        </span>
      ),
    },
    {
      value: 'jiggly_puff',
      inputDisplay: (
        <span className="character-select__character">
          <img src={CHARACTERS.jiggly_puff} /> Jigglypuff
        </span>
      ),
    },
    {
      value: 'kirby',
      inputDisplay: (
        <span className="character-select__character">
          <img src={CHARACTERS.kirby} /> Kirby
        </span>
      ),
    },
    {
      value: 'link',
      inputDisplay: (
        <span className="character-select__character">
          <img src={CHARACTERS.link} /> Link
        </span>
      ),
    },
    {
      value: 'luigi',
      inputDisplay: (
        <span className="character-select__character">
          <img src={CHARACTERS.luigi} /> Luigi
        </span>
      ),
    },
    {
      value: 'mario',
      inputDisplay: (
        <span className="character-select__character">
          <img src={CHARACTERS.mario} /> Mario
        </span>
      ),
    },
    {
      value: 'marth',
      inputDisplay: (
        <span className="character-select__character">
          <img src={CHARACTERS.marth} /> Marth
        </span>
      ),
    },
    {
      value: 'mew_two',
      inputDisplay: (
        <span className="character-select__character">
          <img src={CHARACTERS.mew_two} /> Mewtwo
        </span>
      ),
    },
    {
      value: 'ness',
      inputDisplay: (
        <span className="character-select__character">
          <img src={CHARACTERS.ness} /> Ness
        </span>
      ),
    },
    {
      value: 'peach',
      inputDisplay: (
        <span className="character-select__character">
          <img src={CHARACTERS.peach} /> Peach
        </span>
      ),
    },
    {
      value: 'pichu',
      inputDisplay: (
        <span className="character-select__character">
          <img src={CHARACTERS.pichu} /> Pichu
        </span>
      ),
    },
    {
      value: 'pikachu',
      inputDisplay: (
        <span className="character-select__character">
          <img src={CHARACTERS.pikachu} /> Pikachu
        </span>
      ),
    },
    {
      value: 'roy',
      inputDisplay: (
        <span className="character-select__character">
          <img src={CHARACTERS.roy} /> Roy
        </span>
      ),
    },
    {
      value: 'samus',
      inputDisplay: (
        <span className="character-select__character">
          <img src={CHARACTERS.samus} /> Samus
        </span>
      ),
    },
    {
      value: 'sheik',
      inputDisplay: (
        <span className="character-select__character">
          <img src={CHARACTERS.sheik} /> Sheik
        </span>
      ),
    },
    {
      value: 'yoshi',
      inputDisplay: (
        <span className="character-select__character">
          <img src={CHARACTERS.yoshi} /> Yoshi
        </span>
      ),
    },
    {
      value: 'young_link',
      inputDisplay: (
        <span className="character-select__character">
          <img src={CHARACTERS.young_link} /> Young Link
        </span>
      ),
    },
    {
      value: 'zelda',
      inputDisplay: (
        <span className="character-select__character">
          <img src={CHARACTERS.zelda} /> Zelda
        </span>
      ),
    },
  ];

  const handleOnChange = (value) => {
    setSelected(value);
    onChange(value);
  };

  return (
    <EuiSuperSelect
      options={options}
      valueOfSelected={selected}
      onChange={handleOnChange}
    />
  );
};
