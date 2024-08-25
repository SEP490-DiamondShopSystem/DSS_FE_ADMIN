import React from 'react';
import ReactDOM from 'react-dom/client';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import App from './App.jsx';
import './index.css';
import {persistor, store} from './redux/store.js';
import {Toast} from './utils/toast.jsx';
import {GoogleOAuthProvider} from '@react-oauth/google';

const NEXT_PUBLIC_GOOGLE_CLIENT_ID =
	'375198830790-6lk26c7frudnqee2b55ge7fkbco1nkma.apps.googleusercontent.com';

ReactDOM.createRoot(document.getElementById('root')).render(
	<GoogleOAuthProvider clientId={NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
		<Provider store={store}>
			<PersistGate persistor={persistor}>
				<Toast />
				<App />
			</PersistGate>
		</Provider>
	</GoogleOAuthProvider>
);
