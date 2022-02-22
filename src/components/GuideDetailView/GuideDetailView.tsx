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
import { TwitchSidebar } from '../TwitchSidebar/TwitchSidebar';

/* Styles */
import '../GuideDetailView/_guide-detail-view.scss';

/* Types */
import { Guide } from '../../models/Guide';

/* Constants */
import { CHARACTERS, ROLES } from '../../constants/constants';

/* Store */
import { Context } from '../../store/Store';

/* Services */
import {
  useDeleteGuide,
  useSaveGuide,
} from '../../services/GuideService/GuideHooks';

const shallowCopy = (params) => {
  return JSON.parse(JSON.stringify(params));
};

export interface GuideDetailViewProps {}

export const GuideDetailView: FunctionComponent<GuideDetailViewProps> =
  (): ReactElement => {
    const [editing, setEditing] = useState<boolean>(false);
    const [guide, setGuide] = useState<Guide | null>(null);
    const [state] = useContext(Context);
    const [isOpen, setIsOpen] = useState(false);
    const { cookbook, user, guides } = state;
    const guideSlug = useParams().recipe;
    const sectionSlug = useParams().section;
    const showControls =
      user &&
      (ROLES.admin.includes(cookbook.roles[user.uid]) || user.super_admin);
    const deleteGuide = useDeleteGuide(setEditing);
    const saveGuide = useSaveGuide(setEditing);

    const handlers = useSwipeable({
      onSwipedLeft: () => setIsOpen(false),
      onSwipedRight: () => setIsOpen(true),
      delta: 1,
    });

    const getGuide = async () => {
      setGuide({
        ...shallowCopy(guides.find((guide) => guide._id === guideSlug)),
      });
    };

    useEffect(() => {
      const init = async () => {
        getGuide();
      };
      init();
    }, [guides, guideSlug]);

    const findSectionIndex = (sections) => {
      return sections.findIndex(
        (section) => `${section.title}` === decodeURIComponent(sectionSlug),
      );
    };

    const findSection = (sections) => {
      return sections.find(
        (section) => `${section.title}` === decodeURIComponent(sectionSlug),
      );
    };

    const updateSection = (key, value) => {
      if (!guide) return;
      const sectionIndex = findSectionIndex(guide.sections);
      guide.sections[sectionIndex][key] = value;
      setGuide({ ...guide });
    };

    const handleCancel = async () => {
      await getGuide();
      setEditing(false);
    };

    if (!guide || guide.sections == null) return <></>;

    const section: any = findSection(guide.sections);

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
                        text: findSection(guide.sections)?.title,
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
                        onClick={() => saveGuide(guide)}
                        size="m"
                        iconSize="l"
                      />
                      <EuiButtonIcon
                        aria-label="cancel"
                        className="controls__button"
                        display="fill"
                        iconType="trash"
                        color="danger"
                        onClick={() => deleteGuide(guide, section)}
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
                        onClick={() => setEditing(!editing)}
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
