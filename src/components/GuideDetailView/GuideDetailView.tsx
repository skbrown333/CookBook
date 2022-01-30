import React, {
  FunctionComponent,
  useState,
  useEffect,
  ReactElement,
  useContext,
} from 'react';
import { useParams } from 'react-router-dom';

/* Components */
import { useSwipeable } from 'react-swipeable';
import {
  EuiAvatar,
  EuiBreadcrumbs,
  EuiButtonIcon,
  EuiMarkdownEditor,
  EuiMarkdownFormat,
} from '@elastic/eui';
import { parsingList, processingList, uiList } from '../../plugins';

/* Styles */
import '../GuideDetailView/_guide-detail-view.scss';

/* Types */
import { Guide } from '../../models/Guide';

/* Constants */
import { CHARACTERS, ROLES } from '../../constants/constants';

/* Store */
import { Context } from '../../store/Store';
import { updateGuides } from '../../store/actions';

/* Services */
import { ToastService } from '../../services/ToastService';
import GuideService from '../../services/GuideService/GuideService';
import { TwitchSidebar } from '../TwitchSidebar/TwitchSidebar';

export interface GuideDetailViewProps {}

export const GuideDetailView: FunctionComponent<GuideDetailViewProps> =
  (): ReactElement => {
    const [editing, setEditing] = useState<boolean>(false);
    const [guide, setGuide] = useState<Guide | null>(null);
    const [state, dispatch] = useContext(Context);
    const [isOpen, setIsOpen] = useState(false);
    const { cookbook, user, guides } = state;
    const guideSlug = useParams().recipe;
    const sectionSlug = useParams().section;
    const toast = new ToastService();
    const guideService = new GuideService(cookbook._id);
    const showControls =
      user &&
      (ROLES.admin.includes(cookbook.roles[user.uid]) || user.super_admin);

    const handlers = useSwipeable({
      onSwipedLeft: () => setIsOpen(false),
      onSwipedRight: () => setIsOpen(true),
      delta: 1,
    });

    const getGuide = async () => {
      setGuide({
        ...JSON.parse(
          JSON.stringify(guides.find((guide) => guide._id === guideSlug)),
        ),
      });
    };

    useEffect(() => {
      const init = async () => {
        getGuide();
      };
      init();
    }, [guides, guideSlug]);

    const updateSection = (key, value) => {
      if (!guide) return;
      const sectionIndex = guide.sections.findIndex(
        (section) => `${section.title}` === decodeURI(sectionSlug),
      );
      guide.sections[sectionIndex][key] = value;
      setGuide({ ...guide });
    };

    const handleSetEditing = (isEditing) => {
      setEditing(isEditing);
    };

    const handleCancel = async () => {
      await getGuide();
      setEditing(false);
    };

    const handleSave = async () => {
      if (!guide) return;
      try {
        const token = await user.user.getIdToken();
        await guideService.update(
          guide._id,
          { sections: guide.sections },
          {
            Authorization: `Bearer ${token}`,
          },
        );
        toast.successToast('Guide saved!', 'Guide saved');
        const guides = await guideService.get({ cookbook: cookbook._id });
        dispatch(updateGuides([...guides]));
        setEditing(false);
      } catch (error) {
        toast.errorToast('Something went wrong', 'Guide was not saved');
      }
    };

    if (!guide || guide.sections == null) return <></>;

    const section: any = guide.sections.find(
      (section) => `${section.title}` === decodeURI(sectionSlug),
    );
    console.log('decodeURI(sectionSlug): ', decodeURI(sectionSlug));
    console.log('sections: ', guide.sections);

    if (!section) return <></>;

    const { body, title } = section;

    return (
      <div
        id="guide-detail"
        className="guide-detail"
        style={{ marginLeft: isOpen ? 300 : 0 }}
        {...handlers}
      >
        {guide && (
          <>
            {
              <div className="guide-detail__header">
                <div className="title">
                  <EuiAvatar
                    size="xl"
                    className="guide-header__avatar"
                    name={guide.title}
                    color={null}
                    iconType={
                      guide.character
                        ? CHARACTERS[cookbook.game.name][guide.character.name]
                        : CHARACTERS.melee.sandbag
                    }
                  />
                  <EuiBreadcrumbs
                    breadcrumbs={[
                      {
                        text: guide.title,
                      },
                      {
                        text: guide.sections.find(
                          (section) =>
                            `${section.title}` === decodeURI(sectionSlug),
                        )?.title,
                      },
                    ]}
                    truncate={true}
                    aria-label="An example of EuiBreadcrumbs"
                  />
                </div>
                <div className="controls">
                  {editing ? (
                    <>
                      <EuiButtonIcon
                        aria-label="cancel"
                        className="controls__button"
                        display="fill"
                        iconType="cross"
                        color="danger"
                        onClick={handleCancel}
                        size="m"
                        iconSize="l"
                      />
                      <EuiButtonIcon
                        aria-label="save"
                        className="controls__button"
                        display="fill"
                        iconType="save"
                        color="success"
                        onClick={handleSave}
                        size="m"
                        iconSize="l"
                      />
                    </>
                  ) : (
                    showControls && (
                      <EuiButtonIcon
                        aria-label="edit"
                        className="controls__edit"
                        display="fill"
                        iconType="pencil"
                        size="m"
                        iconSize="l"
                        onClick={() => handleSetEditing(!editing)}
                      />
                    )
                  )}
                </div>
              </div>
            }

            <div className="guide-detail__content">
              <div
                id={`section-${title}`}
                key={title}
                className={`body${editing ? ' editing' : ''}`}
              >
                {editing ? (
                  <>
                    <EuiMarkdownEditor
                      aria-label="Body markdown editor"
                      value={body}
                      onChange={(value) => updateSection('body', value)}
                      height={'full'}
                      parsingPluginList={parsingList}
                      processingPluginList={processingList}
                      uiPlugins={uiList}
                    />
                  </>
                ) : (
                  <>
                    <EuiMarkdownFormat
                      parsingPluginList={parsingList}
                      processingPluginList={processingList}
                    >
                      {body}
                    </EuiMarkdownFormat>
                  </>
                )}
              </div>
              <TwitchSidebar className="guide-sidebar" />
            </div>
          </>
        )}
      </div>
    );
  };
