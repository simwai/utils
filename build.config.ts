/* eslint-disable @typescript-eslint/naming-convention */
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig([
	// Node.js build
	{
		name: 'node',
		entries: [{ input: './src/index', name: 'index' }],
		declaration: true,
		rollup: {
			emitCJS: true,
			output: { exports: 'named' },
		},
		outDir: 'build/node',
		failOnWarn: false,
	},
	// Browser build
	{
		name: 'browser',
		entries: [{ input: './src/index.browser', name: 'index' }],
		declaration: true,
		rollup: {
			emitCJS: false,
			output: { exports: 'named' },
		},
		hooks: {
			'rollup:options'(_context, options) {
				// Force bundling of all dependencies for browser
				options.external = () => false
			},
		},
		outDir: 'build/browser',
		failOnWarn: false,
	},
])
