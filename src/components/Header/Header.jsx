import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import Nav from './Nav.jsx';
import { headerContainer, headerText } from './styles.scss';

import ScreenContext from '@contexts/ScreenContext';

const links = [{ title: 'Test', url: '/test' }];

export default () => {
  const location = useLocation();
  const { width } = useContext(ScreenContext);

  const active = location?.pathname;

  return (
    <header className={headerContainer}>
      <h1 className={headerText}>Beer-Olympics</h1>
    </header>
  );
};
