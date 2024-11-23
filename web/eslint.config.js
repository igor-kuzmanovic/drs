import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';

/** @type {import('eslint').Linter.Config[]} */
export default [
	{ files: ['**/*.{js,ts,jsx,tsx}'] },
	{ ignores: ['**/*.{mjs,cjs,d.ts,d.mts}'] },
	{ languageOptions: { globals: globals.browser } },
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	{
		rules: {
			// Taken from a Redux template
			'@typescript-eslint/consistent-type-imports': [
				'error',
				{
					fixStyle: 'separate-type-imports',
				},
			],
			// Taken from a Redux template
			'@typescript-eslint/no-restricted-imports': [
				'error',
				{
					paths: [
						{
							name: 'react-redux',
							importNames: ['useSelector', 'useStore', 'useDispatch'],
							message: 'Please use pre-typed versions from `src/app/hooks.ts` instead.',
						},
					],
				},
			],
		},
	},
	pluginReact.configs.flat['jsx-runtime'],
];
