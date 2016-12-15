module.exports.index = function(req, res) {
	res.renderT('index', {
		template: "index"
	})
}

module.exports.contact = function(req, res) {
	res.renderT('contact', {
		template: 'contact'
	})
}