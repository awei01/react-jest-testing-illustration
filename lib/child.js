'use strict';
// simple module used as a stub
var React = require('react');
module.exports = React.createClass({
	render: function() {
		return (
			<div>{ this.props.children }</div>
		);
	}
});
