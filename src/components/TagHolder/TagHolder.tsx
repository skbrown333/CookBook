import React, { FunctionComponent } from 'react';

/* Styles */
import './_tag-holder.scss';

/* Components */
import { EuiBadge } from '@elastic/eui';

/* Models */
import { Tag } from '../../models/Tag';

export interface TagHolderProps {
  className: string;
  tags: Array<Tag>;
}

export const TagHolder: FunctionComponent<TagHolderProps> = ({
  className,
  tags,
}) => {
  return (
    <div className={className}>
      {tags.map((tag, index) => (
        <EuiBadge key={index} className="tag" color="hollow">
          #{tag.label}
        </EuiBadge>
      ))}
    </div>
  );
};
