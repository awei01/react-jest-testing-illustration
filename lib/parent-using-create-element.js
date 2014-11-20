'use strict';
// per this link: https://gist.github.com/sebmarkbage/d7bce729f38730399d28
// we're not supposed to do this, but including it for illustration
var React = require('react'),
	Child = require('./child');
module.exports = React.createClass({
	render: function() {
		return React.DOM.div({}, React.createElement(Child, { ref: "child", foo: "foo value" }, 'children value'));
	}
});
