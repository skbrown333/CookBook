import React, { FunctionComponent } from 'react';

/* Components */
import {
  EuiButtonIcon,
  EuiFieldText,
  EuiMarkdownEditor,
  EuiMarkdownFormat,
  EuiSpacer,
  EuiBadge,
  EuiPanel,
} from '@elastic/eui';
import { TagInput } from '../../TagInput/TagInput';

/* Styles */
import './_guide-detail-section.scss';

/*Models*/
import { Tag } from '../../../models/Tag';

/* Plugins */
import { parsingList, processingList, uiList } from '../../../plugins';

export interface GuideDetailSectionProps {
  title: string;
  editing: boolean;
  body: string;
  updateSection: (key: string, value: string) => void;
}

export const GuideDetailSection: FunctionComponent<GuideDetailSectionProps> = ({
  title,
  editing,
  body,
  updateSection,
}) => {
  return (
    <EuiPanel
      id={`section-${title}`}
      hasShadow={false}
      className="guide-section"
      key={title}
    >
      <div className={`guide-section__body${editing ? ' editing' : ''}`}>
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
    </EuiPanel>
  );
};
