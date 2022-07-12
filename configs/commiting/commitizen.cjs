const commitRules = require('./commit-rules.json')

function convertCommitTypes(types) {
	const maxLength = Object.keys(types)
		.map(key => key.length)
		.sort()
		.reverse()[0]

	return Object.entries(types).map(([key, value]) => ({
		value: key,
		name: `${key}:${' '.repeat(maxLength - key.length)} ${value}`
	}))
}

module.exports = {
	types: convertCommitTypes(commitRules.types),
	scopes: [...commitRules.scopes],
	...commitRules.other
}
