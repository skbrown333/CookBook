import React, {
  FunctionComponent,
  useContext,
  useState,
  useEffect,
} from "react";

/* Models */
import { Guide } from "../../models/Guide";
import { Tag } from "../../models/Tag";

/* Components */
import { GuideCard } from "./GuideCard/GuideCard";
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
} from "@elastic/eui";

import { TagInput } from "../TagInput/TagInput";

/* Styles */
import "./_guide-list-view.scss";
import { CharacterSelect } from "../CharacterSelect/CharacterSelect";

/* Context */
import { Firebase, FirebaseContext } from "../../firebase";
import { Context } from "../../store/Store";

/* Constants */
import { CHARACTERS, FIRESTORE } from "../../constants/constants";

/* Services */
import { ToastService } from "../../services/ToastService";

export interface GuideListViewProps {}

const emptyGuide: Guide = {
  title: "",
  description: "",
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

export const GuideListView: FunctionComponent<GuideListViewProps> = () => {
  const [state] = useContext(Context);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [guideToDelete, setGuideToDelete] = useState<any>(null);
  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [guide, setGuide] = useState<Guide>(emptyGuide);
  const [creating, setCreating] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const firebase = useContext<Firebase | null>(FirebaseContext);
  const { cookbook } = state;
  const toast = new ToastService();

  const getGuides = async () => {
    return await firebase?.getAll(cookbook.id, FIRESTORE.collections.guides);
  };

  useEffect(() => {
    async function init() {
      try {
        setGuides(await getGuides());
      } catch (err) {
        toast.errorToast("Error getting guides", err.message);
      }
    }
    init();
  }, []);

  const deletePrompt = async (e, guide) => {
    e.stopPropagation();
    setGuideToDelete(guide);
    setShowDelete(true);
  };

  const deleteGuide = async () => {
    if (!guideToDelete) return;
    try {
      await firebase?.deleteDocById(
        cookbook.id,
        FIRESTORE.collections.guides,
        guideToDelete.id
      );
      setGuides(await getGuides());
      toast.successToast(
        "Guide deleted",
        `guide ${guideToDelete.title} has been deleted`
      );
    } catch (error) {
      toast.errorToast("Guide failed to be deleted", error.msg);
    } finally {
      setShowDelete(false);
      setGuideToDelete(null);
    }
  };

  const destroyModal = (
    <EuiConfirmModal
      title={`Delete guide ${guideToDelete ? guideToDelete.title : ""}?`}
      onCancel={() => setShowDelete(false)}
      onConfirm={deleteGuide}
      cancelButtonText="No, don't do it"
      confirmButtonText="Yes, do it"
      buttonColor="danger"
      defaultFocusedButton="confirm"
    >
      <p>You&rsquo;re about to delete this guide permanently</p>
      <p>Are you sure you want to do this?</p>
    </EuiConfirmModal>
  );

  const addGuideform = (
    <EuiForm id="addGuideForm" component="form">
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
          value={guide.description || ""}
          onChange={(e) =>
            setGuide({ ...guide, ...{ description: e.target.value } })
          }
        />
      </EuiFormRow>
      <EuiFormRow label="Select Character (optional)">
        <CharacterSelect
          onChange={(value) => setGuide({ ...guide, ...{ character: value } })}
        />
      </EuiFormRow>
      <EuiFormRow label="Tags (optional)">
        <TagInput
          initialTags={[]}
          handleUpdate={(tags) => setGuide({ ...guide, ...{ tags: tags } })}
        />
      </EuiFormRow>
    </EuiForm>
  );

  const createGuide = async (newGuide) => {
    const { character, description, tags, title } = newGuide;
    try {
      await firebase?.add(cookbook.id, FIRESTORE.collections.guides, {
        character,
        description,
        sections: [],
        tags,
        title,
      });
      toast.successToast(
        guide.title,
        "Guide succesfully created",
        character ? CHARACTERS[character] : null
      );
    } catch (err) {
      toast.errorToast("Failed to create guide", err.message);
    }
  };
  const handleSave = async (event) => {
    event?.preventDefault();
    try {
      setCreating(true);
      await createGuide(guide);
      setGuides(
        await firebase?.getAll(cookbook.id, FIRESTORE.collections.guides)
      );
      setGuide(emptyGuide);
      setShowAdd(false);
    } finally {
      setCreating(false);
    }
  };
  const handleCancel = () => {
    setShowAdd(false);
    setGuide(emptyGuide);
  };

  const buildGuides = () => {
    return guides.map((guide, index) => {
      return (
        <GuideCard
          guide={guide}
          key={index}
          editing={editing}
          handleDelete={(event, guide) => deletePrompt(event, guide)}
        />
      );
    });
  };

  return (
    <div className="guide-list">
      <div className="guide-list__controls">
        {editing ? (
          <EuiButton
            aria-label="edit"
            className="guide-controls__button"
            fill
            iconType="heart"
            color="danger"
            onClick={() => {
              setEditing(false);
            }}
          />
        ) : (
          <EuiButton
            aria-label="edit"
            className="guide-controls__button"
            fill
            iconType="heart"
            color="primary"
            onClick={() => {
              setEditing(true);
            }}
          />
        )}
        <EuiButton
          aria-label="add"
          className="guide-controls__button"
          fill
          iconType="plus"
          color="secondary"
          onClick={() => {
            setShowAdd(true);
          }}
        >
          Create
        </EuiButton>
        {showAdd === true && firebase && (
          <EuiModal onClose={handleCancel} initialFocus="[name=popswitch]">
            <EuiModalHeader>
              <EuiModalHeaderTitle>
                <h1>Add Guide</h1>
              </EuiModalHeaderTitle>
            </EuiModalHeader>
            <EuiModalBody>{addGuideform}</EuiModalBody>
            <EuiModalFooter>
              <EuiButtonEmpty onClick={handleCancel}>Cancel</EuiButtonEmpty>

              <EuiButton
                type="submit"
                form="addGuideForm"
                onClick={handleSave}
                fill
                disabled={!guide.title || guide.title.length === 0}
                isLoading={creating}
              >
                Save
              </EuiButton>
            </EuiModalFooter>
          </EuiModal>
        )}
        {showDelete ? destroyModal : <></>}
      </div>
      <div className="guide-list__content">{buildGuides()}</div>
    </div>
  );
};
