const URL = require('url');
const path = require('path');

module.exports = ({ Nunjucks, _ }) => {
	Nunjucks.addFilter('kebabCase', string => {
		return _.kebabCase(string);
	});

	Nunjucks.addFilter('camelCase', string => {
		return _.camelCase(string);
	});

	Nunjucks.addFilter('firstLowerCase', string => {
		return _.lowerFirst(string);
	});

	Nunjucks.addFilter('fileName', string => {
		return _.camelCase(string);
	});

	Nunjucks.addFilter('oneLine', string => {
		if (!string) return string;
		return string.replace(/\n/g, ' ');
	});

	Nunjucks.addFilter('containsTag', (array, tag) => {
		if (!array || !tag) {
			return false;
		}
		return array.find(value => {
			return tag === value.name();
		});
	});

	Nunjucks.addFilter('docline', (field, fieldName, scopePropName) => {
		const buildLine = (f, fName, pName) => {
			const type = f.type() ? f.type() : 'string';
			const description = f.description()
				? ` - ${f.description().replace(/\r?\n|\r/g, '')}`
				: '';
			let def = f.default();

			if (def && type === 'string') def = `'${def}'`;

			let line;
			if (def !== undefined) {
				line = ` * @param {${type}} [${
					pName ? `${pName}.` : ''
				}${fName}=${def}]`;
			} else {
				line = ` * @param {${type}} ${pName ? `${pName}.` : ''}${fName}`;
			}

			if (type === 'object') {
				let lines = `${line}\n`;
				let first = true;
				for (const propName in f.properties()) {
					lines = `${lines}${first ? '' : '\n'}${buildLine(
						f.properties()[propName],
						propName,
						`${pName ? `${pName}.` : ''}${fName}`
					)}`;
					first = false;
				}
				return lines;
			}

			return `${line}${description}`;
		};

		return buildLine(field, fieldName, scopePropName);
	});

	Nunjucks.addFilter('port', (url, defaultPort) => {
		const parsed = URL.parse(url);
		return parsed.port || defaultPort || 80;
	});

	Nunjucks.addFilter('pathResolve', (pathName, basePath = '/') => {
		return path.resolve(basePath, pathName);
	});

	Nunjucks.addFilter('throw', message => {
		throw new Error(message);
	});
};
