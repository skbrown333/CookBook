import React, {
  FunctionComponent,
  useContext,
  useState,
  useEffect,
} from 'react';


/* Models */
import { Guide } from '../../models/Guide';
import { Tag } from '../../models/Tag';

/* Components */
import { GuideCard } from './GuideCard/GuideCard';

import {
  EuiButton,
  EuiButtonEmpty,
  EuiFieldText,
  EuiForm,
  EuiFormRow,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiConfirmModal,
  EuiModalHeaderTitle,
  EuiTextArea,
} from '@elastic/eui';

import { TagInput } from '../TagInput/TagInput';

/* Styles */
import './_guide-list-view.scss';
import { CharacterSelect } from '../CharacterSelect/CharacterSelect';

/* Context */
import { Firebase, FirebaseContext } from '../../firebase';
import { Context } from '../../store/Store';
import { updateAddStatus, updateTwitch } from '../../store/actions';

/* Constants */
import { CHARACTERS } from '../../constants/constants';

/* Services */
import { ToastService } from '../../services/ToastService';
import GuideService from '../../services/GuideService/GuideService';

export interface GuideListViewProps {
  filters: any;
  searchText: any;
  adding: string;
}

const emptyGuide: Guide = {
  title: '',
  description: '',
  character: null,
  sections: [],
  tags: [],
};
export interface AddForm {
  title?: string;
  description?: string;
  character?: string;
  tags?: Array<Tag>;
}

export const GuideListView: FunctionComponent<GuideListViewProps> = ({
  filters,
  searchText,
  adding,
}) => {
  const [state, dispatch] = useContext(Context);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [guide, setGuide] = useState<Guide>(emptyGuide);
  const [creating, setCreating] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const firebase = useContext<Firebase | null>(FirebaseContext);
  const { cookbook, user, add } = state;
  const toast = new ToastService();
  const guideService = new GuideService(cookbook._id);

  const getGuides = async () => {
    return await guideService.get();
  };

  useEffect(() => {
    async function init() {
      try {
        setGuides(await getGuides());
      } catch (err) {
        toast.errorToast('Error getting guides', err.message);
      }

      if (firebase) {
        try {
          dispatch(
            updateTwitch(await firebase.getTwitchStreams(cookbook.streams)),
          );
        } catch (err) {
          toast.errorToast('Error Getting Streams', err.message);
        }
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (add && adding === '/recipes') {
      setGuide(emptyGuide);
      setShowAdd(true);
    }
  }, [adding, add]);

  const deletePrompt = async (e, guide) => {
    e.stopPropagation();
    setGuide(guide);
    setShowDelete(true);
  };

  const deleteGuide = async () => {
    if (!guide) return;
    try {
      const token = await user.user.getIdToken();
      await guideService.delete(guide._id, {
        Authorization: `Bearer ${token}`,
      });
      setGuides(await getGuides());
      toast.successToast(
        'Guide deleted',
        `guide ${guide.title} has been deleted`,
      );
    } catch (error) {
      toast.errorToast('Guide failed to be deleted', error.message);
    } finally {
      setShowDelete(false);
      setGuide(emptyGuide);
    }
  };

  const handleEdit = async (event, guide) => {
    event.stopPropagation();
    setGuide(guide);
    setShowEdit(true);
  };

  const destroyModal = (
    <EuiConfirmModal
      title={`Delete guide "${guide ? guide.title : ''}"?`}
      onCancel={() => setShowDelete(false)}
      onConfirm={deleteGuide}
      cancelButtonText="Cancel"
      confirmButtonText="Delete"
      buttonColor="danger"
      defaultFocusedButton="confirm"
    >
      <p>You&rsquo;re about to delete this guide permanently</p>
    </EuiConfirmModal>
  );

  const guideForm = (
    <EuiForm id="guideForm" component="form">
      <EuiFormRow label="Title">
        <EuiFieldText
          value={guide.title}
          required
          onChange={(e) => setGuide({ ...guide, ...{ title: e.target.value } })}
        />
      </EuiFormRow>
      <EuiFormRow label="Description (optional)">
        <EuiTextArea
          resize="none"
          value={guide.description || ''}
          onChange={(e) =>
            setGuide({ ...guide, ...{ description: e.target.value } })
          }
        />
      </EuiFormRow>
      <EuiFormRow label="Select Character (optional)">
        <CharacterSelect
          onChange={(value) => setGuide({ ...guide, ...{ character: value } })}
          value={guide.character}
        />
      </EuiFormRow>
      <EuiFormRow label="Tags (optional)">
        <TagInput
          initialTags={guide.tags}
          handleUpdate={(tags) => setGuide({ ...guide, ...{ tags: tags } })}
        />
      </EuiFormRow>
    </EuiForm>
  );

  const createGuide = async (newGuide) => {
    const { character, description, tags, title } = newGuide;
    try {
      const token = await user.user.getIdToken();
      await guideService.create(
        {
          character,
          description,
          sections: [],
          tags,
          title,
        },
        {
          Authorization: `Bearer ${token}`,
        },
      );
      toast.successToast(
        guide.title,
        'Guide succesfully created',
        character ? CHARACTERS[character] : null,
      );
    } catch (err) {
      toast.errorToast('Failed to create guide', err.message);
    }
  };

  const handleNewSave = async (event) => {
    event?.preventDefault();
    try {
      setCreating(true);
      await createGuide(guide);
      setGuides(await guideService.get());
      setGuide(emptyGuide);
      dispatch(updateAddStatus(false));
      setShowAdd(false);
    } finally {
      setCreating(false);
    }
  };

  const handleEditSave = async () => {
    const { character, description, tags, title } = guide;
    try {
      setCreating(true);
      const token = await user.user.getIdToken();
      await guideService.update(
        guide._id,
        {
          character,
          description,
          tags,
          title,
        },
        {
          Authorization: `Bearer ${token}`,
        },
      );
      toast.successToast('Guide Updated', `Edited guide: ${guide.title}`);
      setGuides(await guideService.get());
    } finally {
      setGuide(emptyGuide);
      setShowEdit(false);
      setCreating(false);
    }
  };

  const handleCancel = () => {
    setShowAdd(false);
    setShowEdit(false);
    setGuide(emptyGuide);
    dispatch(updateAddStatus(false));
  };

  const buildGuides = () => {
    return guides
      .filter((guide) => {
        const { tags } = guide;
        if (!filters || !filters.length) return true;
        const parsedFilters = filters.map((filter) => {
          return filter.label;
        });
        for (let i = 0; i < tags.length; i++) {
          const tag = tags[i];
          return parsedFilters.includes(tag.label);
        }
      })
      .filter((guide) => {
        return (
          guide.title.toUpperCase().indexOf(searchText.toUpperCase()) > -1 ||
          (guide.description &&
            guide.description.toUpperCase().indexOf(searchText.toUpperCase()) > -1)
        );
      })
      .map((guide, index) => {
        return (
          <GuideCard
            guide={guide}
            key={index}
            handleDelete={(event, guide) => deletePrompt(event, guide)}
            handleEdit={(event, guide) => handleEdit(event, guide)}
          />
        );
      });
  };

  const Modal = (title, save) => {
    return (
      <EuiModal onClose={handleCancel} initialFocus="[name=popswitch]">
        <EuiModalHeader>
          <EuiModalHeaderTitle>
            <h1>{title}</h1>
          </EuiModalHeaderTitle>
        </EuiModalHeader>
        <EuiModalBody>{guideForm}</EuiModalBody>
        <EuiModalFooter>
          <EuiButtonEmpty onClick={handleCancel}>Cancel</EuiButtonEmpty>
          <EuiButton
            type="submit"
            form="guideForm"
            onClick={save}
            fill
            disabled={!guide.title || guide.title.length === 0}
            isLoading={creating}
          >
            Save
          </EuiButton>
        </EuiModalFooter>
      </EuiModal>
    );
  };

  return (
    <div className="guide-list">
      {showAdd === true && firebase && Modal('Add Guide', handleNewSave)}
      {showDelete && destroyModal}
      {showEdit && Modal('Edit Guide', handleEditSave)}
      <div className="guide-list__content">{buildGuides()}</div>
    </div>
  );
};
