import React from 'react';

import { EuiMarkdownEditor, EuiMarkdownEditorProps } from '@elastic/eui';

import './_markdowneditor.scss';

export type MarkdownEditorProps = EuiMarkdownEditorProps;

export const MarkdownEditor: React.VFC<MarkdownEditorProps> = (props) => {
  return <EuiMarkdownEditor {...props} />;
};
