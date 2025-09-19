/* eslint-disable @typescript-eslint/naming-convention */
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
	entries: ['./src/index'],
	declaration: true,
	rollup: {
		emitCJS: true,
	},
	outDir: 'build',
	failOnWarn: false,
})
