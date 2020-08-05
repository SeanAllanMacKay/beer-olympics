import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  headerNavigation,
  headerList,
  headerListItem,
  headerLink,
  headerLinkText,
} from './styles.scss';

const links = [
  { title: 'Test', url: '/test' },
  { title: 'Test', url: '/test' },
  { title: 'Test', url: '/test' },
];

export default () => {
  const location = useLocation();

  return (
    <nav className={headerNavigation}>
      <ul className={headerList}>
        {links.map(({ title, url }, index) => (
          <Link className={headerLink} to={url}>
            <li className={headerListItem} key={`${title}-${index}`}>
              <p className={headerLinkText}>{title}</p>
            </li>
          </Link>
        ))}
      </ul>
    </nav>
  );
};
