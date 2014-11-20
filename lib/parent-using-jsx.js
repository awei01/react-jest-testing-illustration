'use strict';
// this module just uses jsx
var React = require('react'),
	Child = require('./child');
module.exports = React.createClass({
	render: function() {
		return (
			<div>
				<Child ref="child" foo="foo value">children value</Child>
			</div>
		);
	}
});
