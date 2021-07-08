import React, { useContext, FunctionComponent, useEffect } from 'react';
import { Route, Redirect, useParams } from 'react-router-dom';

/* Constants */
import { ROLES } from '../../constants/constants';

/* Services */
import CookbookService from '../../services/CookbookService/CookbookService';
import { ToastService } from '../../services/ToastService';

/* Store */
import { Context } from '../../store/Store';
import { updateCookbook } from '../../store/actions';

/**
 * Route wrapper to protect authenticated routes
 *
 * @example
 * <ProtectedRoute path="/:cookbook/" component={Component} />
 */
export const ProtectedRoute: FunctionComponent<any> = ({
  component: Component,
  ...rest
}) => {
  const [state, dispatch] = useContext(Context);
  const { cookbook, user, game } = state;
  const cookbookSlug = rest.computedMatch.params.cookbook;
  const cookbookService = new CookbookService();
  const toast = new ToastService();

  useEffect(() => {
    async function init() {
      try {
        const cookbooks = await cookbookService.get({
          game: game._id,
          name: cookbookSlug,
        });
        dispatch(updateCookbook(cookbooks[0]));
      } catch (err) {
        toast.errorToast('Error', err);
      }
    }
    init();
  }, []);

  function renderRoute(props) {
    const component = <Component {...rest} {...props} />;
    const error = (
      <Redirect
        to={{
          pathname: '/',
          state: {
            from: props.location,
          },
        }}
      />
    );
    return user &&
      cookbook &&
      (ROLES.admin.includes(cookbook.roles[user.uid]) || user.super_admin)
      ? component
      : error;
  }

  return <>{cookbook && <Route {...rest} render={renderRoute} />}</>;
};
