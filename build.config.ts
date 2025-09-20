/* eslint-disable @typescript-eslint/naming-convention */
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig([
	// Node build
	{
		name: 'node',
		entries: [{ input: './src/index', name: 'index' }],
		declaration: true,
		rollup: { emitCJS: true, output: { exports: 'named' } },
		outDir: 'build/node',
		failOnWarn: false,
	},

	// Browser build
	{
		name: 'browser',
		entries: [{ input: './src/index.browser', name: 'index' }],
		declaration: true,
		rollup: { emitCJS: false, output: { exports: 'named' } },
		hooks: {
			'rollup:options'(_ctx, options) {
				options.external = () => false
			},
		},
		outDir: 'build/browser',
		failOnWarn: false,
	},

	// Tests build (auto-discovers files)
	{
		name: 'tests',
		// Treat the directory as a multi-entry source
		entries: [{ input: './src', builder: 'mkdist', ext: 'js' }],
		outDir: './test-build',
		declaration: false,
		rollup: {
			emitCJS: false,
			output: { exports: 'named' },
		},
		failOnWarn: false,
	},
])
