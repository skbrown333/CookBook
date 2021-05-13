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
import { updateToasts } from "../../store/actions";

/* Constants */
import { CHARACTERS } from "../../constants/constants";

export interface GuideListViewProps {}

const emptyGuide: Guide = {
  title: "",
  description: "",
  character: undefined,
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
  const [state, dispatch] = useContext(Context);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [guide, setGuide] = useState<Guide>(emptyGuide);
  const [creating, setCreating] = useState<boolean>(false);
  const firebase = useContext<Firebase | null>(FirebaseContext);

  useEffect(() => {
    async function init() {
      try {
        setGuides(await firebase?.getGuides());
      } catch (err) {
        dispatch(
          updateToasts(
            state.toasts.concat({
              title: "Error getting guides",
              color: "danger",
              iconType: "alert",
              toastLifeTimeMs: 5000,
              text: <p>{err.message}</p>,
            })
          )
        );
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
      await firebase?.addGuide(guide);
      setGuides(await firebase?.getGuides());
      setGuide(emptyGuide);
      setShowAdd(false);
      dispatch(
        updateToasts(
          state.toasts.concat({
            title: guide.title,
            color: "success",
            iconType: guide.character ? CHARACTERS[guide.character] : null,
            toastLifeTimeMs: 5000,
            text: <p>Guide succesfully created</p>,
          })
        )
      );
    } catch (err) {
      dispatch(
        updateToasts(
          state.toasts.concat({
            title: "Error creating guide",
            color: "danger",
            iconType: "alert",
            toastLifeTimeMs: 5000,
            text: <p>{err.message}</p>,
          })
        )
      );
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
