import React, {
  FunctionComponent,
  useState,
  useEffect,
  ReactElement,
  useContext,
} from 'react';
import { useParams } from 'react-router-dom';

/* Styles */
import '../GuideDetailView/_guide-detail-view.scss';

/* Types */
import { Guide } from '../../models/Guide';

/* Constants */
import { ROLES } from '../../constants/constants';

/* Firebase */
import { Context } from '../../store/Store';

/* Services */
import { ToastService } from '../../services/ToastService';
import GuideService from '../../services/GuideService/GuideService';
import { GuideDetailSection } from '../GuideDetailView/GuideDetailSection/GuideDetailSection';
import { GuideDetailHeader } from '../GuideDetailView/GuideDetailHeader/GuideDetailHeader';
import { updateGuides } from '../../store/actions';
import { useSwipeable } from 'react-swipeable';

export interface GuideDetailViewProps {}

export const SectionView: FunctionComponent<GuideDetailViewProps> =
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
        (section) => `:${section.title}` === decodeURI(sectionSlug),
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

    const Section: FunctionComponent = () => {
      if (!guide || !guide.sections) return <></>;

      const section: any = guide.sections.find(
        (section) => `:${section.title}` === decodeURI(sectionSlug),
      );

      if (!section) return <></>;

      const { title, body, tags } = section;

      return (
        <GuideDetailSection
          key={0}
          title={title}
          body={body}
          editing={editing}
          updateSection={updateSection}
        />
      );
    };

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
                <GuideDetailHeader
                  editing={editing}
                  handleCancel={handleCancel}
                  handleSave={handleSave}
                  handleSetEditing={handleSetEditing}
                  title={`${guide.title}`}
                  sectionTitle={
                    guide.sections.find(
                      (section) =>
                        `:${section.title}` === decodeURI(sectionSlug),
                    )?.title
                  }
                  character={guide.character}
                  showControls={showControls}
                />
              </div>
            }

            <div className="guide-detail__content">
              <div id="sections" className="guide-content__sections">
                <Section />
              </div>
            </div>
          </>
        )}
      </div>
    );
  };
