import React, { useState } from 'react';
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
} from '@elastic/eui';
import { CharacterSelect } from '../CharacterSelect/CharacterSelect';
import {
  useCreateGuide,
  useSaveGuide,
} from '../../services/GuideService/GuideHooks';

const emptyGuide = {
  title: '',
  sections: [],
  tags: [],
};

export const GuideModal = ({
  guide,
  onClose,
  title,
  open,
}: {
  guide?: any;
  onClose: () => void;
  title: string;
  open?: boolean;
}) => {
  const [newGuide, setGuide] = useState(guide || emptyGuide);
  const [editing, setEditing] = useState<boolean>(false);
  const createGuide = useCreateGuide();
  const saveGuide = useSaveGuide();

  const handleSave = async (event) => {
    event?.preventDefault();
    setEditing(true);
    guide ? await saveGuide(newGuide) : await createGuide(newGuide);
    setGuide(emptyGuide);
    onClose();
    setEditing(false);
  };

  if (!open) return null;

  return (
    <EuiModal onClose={onClose} initialFocus="[name=popswitch]">
      <EuiModalHeader>
        <EuiModalHeaderTitle>
          <h1>{title}</h1>
        </EuiModalHeaderTitle>
      </EuiModalHeader>
      <EuiModalBody>
        <EuiForm id="guideForm" component="form">
          <EuiFormRow label="Title">
            <EuiFieldText
              value={newGuide.title}
              required
              onChange={(e) =>
                setGuide({ ...newGuide, ...{ title: e.target.value } })
              }
            />
          </EuiFormRow>
          <EuiFormRow label="Select Character (optional)">
            <CharacterSelect
              onChange={(value) =>
                setGuide({ ...newGuide, ...{ character: value } })
              }
              value={newGuide.character ? newGuide.character._id : null}
            />
          </EuiFormRow>
        </EuiForm>
      </EuiModalBody>
      <EuiModalFooter>
        <EuiButtonEmpty onClick={onClose}>Cancel</EuiButtonEmpty>
        <EuiButton
          type="submit"
          form="guideForm"
          onClick={handleSave}
          fill
          disabled={!newGuide.title || newGuide.title.length === 0}
          isLoading={editing}
        >
          Save
        </EuiButton>
      </EuiModalFooter>
    </EuiModal>
  );
};
