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
  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [guide, setGuide] = useState<Guide>(emptyGuide);
  const [creating, setCreating] = useState<boolean>(false);
  const firebase = useContext<Firebase | null>(FirebaseContext);
  const { cookbook } = state;
  const toast = new ToastService();

  useEffect(() => {
    async function init() {
      try {
        setGuides(
          await firebase?.getAll(cookbook.id, FIRESTORE.collections.guides)
        );
      } catch (err) {
        toast.errorToast("Error getting guides", err.message);
      }
    }
    init();
  }, []);

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

  const handleSave = async (event) => {
    event?.preventDefault();
    try {
      setCreating(true);
      setGuides(
        await firebase?.getAll(cookbook.id, FIRESTORE.collections.guides)
      );
      setGuide(emptyGuide);
      setShowAdd(false);
      toast.successToast(
        guide.title,
        "Guide succesfully created",
        guide.character ? CHARACTERS[guide.character] : null
      );
    } catch (err) {
      toast.errorToast("Error creating guide", err.msg);
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
      return <GuideCard guide={guide} key={index} />;
    });
  };

  return (
    <div className="guide-list">
      <div className="guide-list__controls">
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
      </div>
      <div className="guide-list__content">{buildGuides()}</div>
    </div>
  );
};
