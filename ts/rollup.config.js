import resolve from '@rollup/plugin-node-resolve';

export default {
	input: 'out/main.js',
	output: {
		file: '../wwwroot/bundle.js',
		format: 'es'
	},
	plugins: [
		resolve()
	]
};
