import React, { FunctionComponent, useEffect } from 'react';
import { useHistory, useLocation, Link, Redirect } from 'react-router-dom';

/* Styles */
import './_tag-holder.scss';

/* Components */
import { EuiBadge } from '@elastic/eui';

/* Models */
import { Tag } from '../../models/Tag';

export interface TagHolderProps {
  className: string;
  tags: Array<Tag>;
  clickable?: boolean;
}

export const TagHolder: FunctionComponent<TagHolderProps> = ({
  className,
  tags,
  clickable = true,
}) => {
  const handleClick = (location, tag) => {
    if (location.search.includes('?filters')) {
      return `${location.search}+${tag.label}`;
    } else {
      return `?filters=${tag.label}`;
    }
  };

  return (
    <div className={className}>
      {tags.map((tag, index) => (
        <Link to={(location) => handleClick(location, tag)}>
          <EuiBadge key={index} className="tag" color="hollow">
            #{tag.label}
          </EuiBadge>
        </Link>
      ))}
    </div>
  );
};
