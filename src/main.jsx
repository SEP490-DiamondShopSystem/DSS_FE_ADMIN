import React from 'react';
import ReactDOM from 'react-dom/client';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import App from './App.jsx';
import './index.css';
import {persistor, store} from './redux/store.js';
import {Toast} from './utils/toast.jsx';
import {GoogleOAuthProvider} from '@react-oauth/google';
import {ConfigProvider} from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/vi.js';
import locale from 'antd/locale/vi_VN';

const NEXT_PUBLIC_GOOGLE_CLIENT_ID =
	'375198830790-6lk26c7frudnqee2b55ge7fkbco1nkma.apps.googleusercontent.com';

dayjs.locale('vi');

ReactDOM.createRoot(document.getElementById('root')).render(
	<GoogleOAuthProvider clientId={NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
		<Provider store={store}>
			<ConfigProvider
				locale={locale}
				theme={{
					token: {
						colorPrimary: '#dec986',
					},
					components: {
						Button: {
							colorPrimary: '#dec986',
						},
						Table: {
							rowHoverBg: '#tintWhite',
							headerBg: '#dec986',
						},
						Slider: {
							trackBg: '#dec986',
							trackHoverBg: '#ffed99',
							dotActiveBorderColor: '#dec986',
							colorPrimary: '#dec986',
						},
					},
				}}
			>
				<PersistGate persistor={persistor}>
					<Toast />
					<App />
				</PersistGate>
			</ConfigProvider>
		</Provider>
	</GoogleOAuthProvider>
);
