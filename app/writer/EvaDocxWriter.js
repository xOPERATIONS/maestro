'use strict';

const docx = require('docx');
const Writer = require('./Writer');

module.exports = class EvaDocxWriter extends Writer {

	constructor(program, procedure) {
		super(program, procedure);
	}

	getRightTabPosition() {
		return 14400;
	}

	getPageSize() {
		return {
			width: 12240, // width and height transposed in LANDSCAPE
			height: 15840,
			orientation: docx.PageOrientation.LANDSCAPE
		};
	}

	getPageMargins() {
		return {
			top: 720,
			right: 720,
			bottom: 720,
			left: 720
		};
	}
};