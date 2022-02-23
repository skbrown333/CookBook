import React from 'react';
import {
  EuiButton,
  EuiButtonEmpty,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
} from '@elastic/eui';

export const ConfirmationModal = ({
  open,
  title,
  body,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <EuiModal onClose={onCancel} initialFocus="[name=popswitch]">
      <EuiModalHeader>
        <EuiModalHeaderTitle>
          <h1>{title}</h1>
        </EuiModalHeaderTitle>
      </EuiModalHeader>
      <EuiModalBody>{body}</EuiModalBody>
      <EuiModalFooter>
        <EuiButtonEmpty onClick={onCancel}>Cancel</EuiButtonEmpty>
        <EuiButton onClick={onConfirm} color="danger" fill>
          Confirm
        </EuiButton>
      </EuiModalFooter>
    </EuiModal>
  );
};
