import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

function showStartError(text) {
  document.getElementById('root').textContent = text;
}

window.onload = function () {
  window.ZFAPPS.extension.init().then(function () {
    window.ZFAPPS.invoke('RESIZE', { width: '1000px', height: '640px' });

    window.ZFAPPS.get('organization').then(function (orgData) {
      window.ZFAPPS.get('user').then(function (userData) {
        let root = createRoot(document.getElementById('root'));
        root.render(
          <App
            organizationId={orgData.organization.organization_id}
            apiRootEndpoint={orgData.organization.api_root_endpoint}
            userId={userData.user.user_id}
          />
        );
      }).catch(function (err) {
        showStartError('Could not load user details.');
        console.error(err);
      });
    }).catch(function (err) {
      showStartError('Could not load organization details.');
      console.error(err);
    });
  }).catch(function (err) {
    showStartError('Could not start the widget.');
    console.error(err);
  });
};
