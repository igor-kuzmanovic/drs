import '@mantine/core/styles.css';
import './styles/global.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { MantineProvider } from '@mantine/core';
import { RouterProvider } from 'react-router-dom';
import { store } from './app/store';
import { theme } from './styles/theme';
import { router } from './app/router';

const container = document.getElementById('root');

if (!container) {
	throw new Error(
		"Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
	);
}

const root = createRoot(container);

root.render(
	<React.StrictMode>
		<Provider store={store}>
			<MantineProvider theme={theme}>
				<RouterProvider router={router} />
			</MantineProvider>
		</Provider>
	</React.StrictMode>,
);
