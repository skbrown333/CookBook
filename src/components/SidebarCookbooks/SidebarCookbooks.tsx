import * as React from 'react';
import logo from '../../images/logo.svg';
import { Cookbook } from '../../models/Cookbook';
import { EuiSpacer } from '@elastic/eui';
import { Context } from '../../store/Store';
import { MELEE } from '../../constants/MeleeIcons';
import { Link } from 'react-router-dom';
import CookbookService from '../../services/CookbookService/CookbookService';
import { canManage, CHARACTERS } from '../../constants/constants';
import { ToastService } from '../../services/ToastService';
import { updateCookbook, updateGuides } from '../../store/actions';
import GuideService from '../../services/GuideService/GuideService';
import './_cookbooks.scss';

const CookbookItem = ({ cookbook }: { cookbook: Cookbook }) => {
  const [state, dispatch] = React.useContext(Context);
  const { cookbook: currentCookbook, game } = state;
  const cookbookService = new CookbookService();

  const handleOnClick = async () => {
    try {
      const _cookbook = await cookbookService.getByName(
        game._id,
        cookbook.name,
      );
      const guideService = new GuideService(_cookbook._id);
      const guides = await guideService.getByCookbook(_cookbook._id);
      dispatch(updateCookbook(_cookbook));
      dispatch(updateGuides([...guides], _cookbook));
    } catch (err: any) {
      console.log('err ', err.message);
    }
  };

  return (
    <Link to={`/${cookbook.name}`} onClick={handleOnClick}>
      <img
        src={CHARACTERS[game.name][cookbook.character.name] || MELEE.sandbag}
        alt={cookbook.name}
        className="cookbook"
        style={
          currentCookbook?.name === cookbook.name
            ? { filter: 'grayscale(0%)', opacity: 1 }
            : {}
        }
      />
    </Link>
  );
};

export const SidebarCookbooks: React.FC = () => {
  const [state] = React.useContext(Context);
  const { game, cookbook, user } = state;
  const [cookbooks, setCookbooks] = React.useState<Cookbook[]>([]);
  const cookbookService = new CookbookService();
  const toast = new ToastService();

  React.useEffect(() => {
    async function getCharacters() {
      try {
        let characters = await cookbookService.get({
          game,
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
      }
    }
    getCharacters();
  }, []);

  return (
    <div className="cookbooks">
      <div className="logo">
        <img src={logo} alt="" className="logo" />
      </div>
      <EuiSpacer className="spacer" size="xs" />
      {cookbooks.map((cb, i) => (
        <CookbookItem key={i} cookbook={cb} />
      ))}
    </div>
  );
};
