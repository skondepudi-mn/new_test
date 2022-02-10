import React, { useEffect, useState } from 'react';
import { HashRouter as Router} from 'react-router-dom';
import {
  action,
  GlobalLoader,
  Layout,
  init as mnUIInit,
  RouteType,
  initi18n,
} from '@modeln/modn-phoenix-ui';

import { initReactI18next } from 'react-i18next';
import GridComponent from './GridComponent';

import '@modeln/modn-phoenix-ui/antTheme.less';
import '@modeln/modn-phoenix-ui/agGridTheme.scss';

export const initApp = async () => {
  try {
    // setConfig({ URL: process.env.REACT_APP_SERVER_URL });
  } catch (e) {}

  const tokenInfo = {
    lng: 'en',
    locale: 'en',
    zoneinfo: 'America/Los_Angeles',
  };

  await mnUIInit({
    lng: tokenInfo.lng,
    locale: tokenInfo.locale,
    timeZone: tokenInfo.zoneinfo,
  });

  await initi18n(tokenInfo.lng, initReactI18next);
};

const applications: RouteType[] = [
  {
    name: 'App 1',
    path: '/app1',
    component: () => <div><GridComponent /></div>,
  },
  {
    name: 'App2',
    path: '/app2',
    component: () => <div>Test12345</div>,
  },
];

function App() {

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    action(async () => {
      await initApp();
      setLoading(true);
    });
  }, []);
  return (
    <Router>
      {loading ? (
        <Layout
          style={{ height: '100%' }}
          siderWidth={236}
          avatarPopoverProps={{
            userInfo: {},
            onLogoutClick: () => {},
          }}
          notificationsData={[]}
          variant="APPLICATIONS"
          applications={applications}
        />
      ) : <GlobalLoader />}
      
    </Router>
  );
}

export default App;
