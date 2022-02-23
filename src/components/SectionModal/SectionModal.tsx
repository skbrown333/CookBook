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
import { newSection } from '../../constants/constants';
import { useSaveGuide } from '../../services/GuideService/GuideHooks';

export const SectionModal = ({ onCancel, guide, open }) => {
  const [showErrors, setShowErrors] = useState<boolean>(false);
  const [section, setSection] = useState(newSection);
  const saveGuide = useSaveGuide();

  const onCancelSection = () => {
    onCancel();
    setSection(newSection);
    setShowErrors(false);
  };

  const onAddSection = async (event) => {
    event.preventDefault();
    guide.sections.push(section);
    onCancel();
    await saveGuide(guide);
  };

  if (!open) return null;

  return (
    <EuiModal onClose={onCancelSection} initialFocus="[name=popswitch]">
      <EuiModalHeader>
        <EuiModalHeaderTitle>
          <h1>Add Section</h1>
        </EuiModalHeaderTitle>
      </EuiModalHeader>
      <EuiModalBody>
        <EuiForm id="sectionForm" component="form">
          <EuiFormRow
            label="Title"
            isInvalid={showErrors}
            error="Title must be unique"
          >
            <EuiFieldText
              value={section.title}
              required
              onChange={(e) => {
                setShowErrors(
                  guide.sections.filter((s) => s.title === e.target.value)
                    .length > 0,
                );
                setSection({
                  ...section,
                  ...{ title: e.target.value },
                });
              }}
            />
          </EuiFormRow>
        </EuiForm>
      </EuiModalBody>
      <EuiModalFooter>
        <EuiButtonEmpty onClick={onCancelSection}>Cancel</EuiButtonEmpty>
        <EuiButton
          type="submit"
          form="sectionForm"
          onClick={onAddSection}
          disabled={showErrors || section.title.length < 1}
          fill
        >
          Add
        </EuiButton>
      </EuiModalFooter>
    </EuiModal>
  );
};
