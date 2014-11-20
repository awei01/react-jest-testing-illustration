'use strict';
// we're using React.createFactory() to generate an element factory
// per this link: https://gist.github.com/sebmarkbage/d7bce729f38730399d28
var React = require('react'),
	Child = React.createFactory(require('./child'));
module.exports = React.createClass({
	render: function() {
		return React.DOM.div({}, Child({ ref: "child", foo: "foo value" }, 'children value'));
	}
});
