import React, {
  FunctionComponent,
  useState,
  useEffect,
  useContext,
} from 'react';

/* Component */
import {
  EuiFieldSearch,
  EuiIcon,
  EuiPopover,
  EuiPopoverTitle,
} from '@elastic/eui';
import { ReactComponent as Logo } from '../../images/logo.svg';

/* Styles */
import './_header-switcher.scss';

/* Models */
import { Game } from '../../models/Game';

/* Store */
import { Context } from '../../store/Store';

/* Services */
import GameService from '../../services/GameService/GameService';
import { ToastService } from '../../services/ToastService';
import CookbookService from '../../services/CookbookService/CookbookService';

/* Constants */
import { CHARACTERS } from '../../constants/CharacterIcons';
import { canManage, URL_UTILS } from '../../constants/constants';

export interface HeaderSwitcherProps {}

export const HeaderSwitcher: FunctionComponent<HeaderSwitcherProps> = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [state] = useContext(Context);
  const [games, setGames] = useState<Game[]>([]);
  const [cookbooks, setCookbooks] = useState<any[]>([]);
  const [loadingGames, setLoadingGames] = useState<boolean>(false);
  const [loadingCharacters, setLoadingCharacters] = useState<boolean>(false);
  const { game, cookbook, user } = state;
  const [selectedGame, setSelectedGame] = useState<Game>(game);
  const gameService = new GameService();
  const cookbookService = new CookbookService();
  const toast = new ToastService();

  const button = (
    <button onClick={() => setIsOpen(!isOpen)} className="switcher">
      <Logo className="logo" />
      <div>{game.display_name}</div>
      <EuiIcon type={isOpen ? 'arrowUp' : 'arrowDown'} className="icon" />
    </button>
  );

  useEffect(() => {
    async function init() {
      try {
        setLoadingGames(true);
        const games = await gameService.get();
        setGames(games);
      } catch (err: any) {
        toast.errorToast('Error Fetching Games', err.message);
      } finally {
        setLoadingGames(false);
      }
    }
    init();
  }, [game]);

  useEffect(() => {
    async function getCharacters() {
      setLoadingCharacters(true);
      try {
        let characters = await cookbookService.get({
          game: selectedGame,
        });
        let showPreview = false;
        for (let i = 0; i < characters.length; i++) {
          if (canManage(user, characters[i])) {
            showPreview = true;
            break;
          }
        }
        if (!showPreview) {
          characters = characters.filter(
            (character) => character.preview === false,
          );
        }
        setCookbooks(characters);
      } catch (err: any) {
        toast.errorToast('Error Getting Cookbooks', err.message);
      } finally {
        setLoadingCharacters(false);
      }
    }
    getCharacters();
  }, [selectedGame]);

  const buildGames = () => {
    if (loadingGames) return <></>;
    return games.map((g) => {
      return (
        <div
          onClick={() => handleGameChange(g)}
          className={g._id === selectedGame._id ? 'game selected' : 'game'}
        >
          {g.display_name}
        </div>
      );
    });
  };
  const buildCharacters = () => {
    if (loadingCharacters) return <></>;
    return cookbooks.map((c) => {
      return (
        <div
          className={
            cookbook && c._id === cookbook._id
              ? 'character selected'
              : 'character'
          }
          onClick={() => handleCharacterChange(c)}
        >
          <img src={CHARACTERS[selectedGame.name][c.character.name]} />
          <span>{c.name}</span>
        </div>
      );
    });
  };
  const handleGameChange = (_game) => {
    setSelectedGame(_game);
  };
  const handleCharacterChange = (_cookbook) => {
    setIsOpen(false);
    window.location.href = `${URL_UTILS.protocol}://${selectedGame.subdomain}.${URL_UTILS.domain}/${_cookbook.name}`;
  };

  return (
    <EuiPopover
      id="popoverHeaderSwitcher"
      button={button}
      isOpen={isOpen}
      closePopover={() => setIsOpen(false)}
      panelPaddingSize="none"
      panelClassName="header-switcher__popover"
      style={{ display: 'flex' }}
    >
      <div className="header-switcher__content">
        <div className="header-switcher__game">
          <EuiPopoverTitle paddingSize="s">
            {/* <EuiFieldSearch
              compressed
              onChange={handleGameChange}
              isClearable={false}
            /> */}
          </EuiPopoverTitle>
          <div className="header-switcher__games">{buildGames()}</div>
        </div>
        <div className="header-switcher__character">
          <EuiPopoverTitle paddingSize="s">
            {/* <EuiFieldSearch
              compressed
              onChange={handleCharacterChange}
              isClearable={false}
            /> */}
          </EuiPopoverTitle>
          <div className="header-switcher__characters">{buildCharacters()}</div>
        </div>
      </div>
    </EuiPopover>
  );
};
