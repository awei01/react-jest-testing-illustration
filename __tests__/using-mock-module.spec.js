'use strict';
jest.dontMock('../lib/parent-using-jsx');
jest.dontMock('../lib/parent-using-create-factory');
jest.dontMock('../lib/parent-using-create-element');
describe('comparing jsx vs .createFactory() vs .createElement() when using TestUtils.mockComponent()', function() {
	var React, TestUtils,
		Child;
	beforeEach(function() {
		React = require('react/addons');
		TestUtils = React.addons.TestUtils;

		Child = require('../lib/child');
		TestUtils.mockComponent(Child, 'mymockchild');
	});
	describe('when using jsx only', function() {
		var Parent, instance;
		beforeEach(function() {
			Parent = require('../lib/parent-using-jsx');
			instance = TestUtils.renderIntoDocument(<Parent/>);
		});
		it('can scry on our fake tag', function() {
			var children = TestUtils.scryRenderedDOMComponentsWithTag(instance, 'mymockchild');
			expect(children.length).toBe(1);
		});
		it('does maintains refs', function() {
			expect(instance.refs.child).not.toBeUndefined();
		});
		it('can capture props passed to child component', function() {
			expect(instance.refs.child.props).toEqual({ foo: "foo value", children: "children value" });
		});
		it('can capture the props passed to mock component', function() {
			expect(Child).lastCalledWith({ foo: "foo value", children: "children value" });
		});
		it('cannot capture all props to element using .findRenderedDOMComponentWithTag (or .scryRenderedDOMComponentsWithTag)', function() {
			var child = TestUtils.findRenderedDOMComponentWithTag(instance, 'mymockchild');
			expect(child.props).toEqual({ foo: "foo value", children: "children value" });
		});
	});
	describe('when using parent that uses .createFactory()', function() {
		var factory, instance;
		beforeEach(function() {
			factory = React.createFactory(require('../lib/parent-using-create-factory'));
			instance = TestUtils.renderIntoDocument(factory());
		});
		it('can scry on our fake tag', function() {
			var children = TestUtils.scryRenderedDOMComponentsWithTag(instance, 'mymockchild');
			expect(children.length).toBe(1);
		});
		it('maintains refs', function() {
			expect(instance.refs.child).not.toBeUndefined();
		});
		it('can capture props passed to child component', function() {
			expect(instance.refs.child.props).toEqual({ foo: "foo value", children: "children value" });
		});
	});
	describe('when using parent that uses .createElement()', function() {
		var factory, instance;
		beforeEach(function() {
			factory = React.createFactory(require('../lib/parent-using-create-element'));
			instance = TestUtils.renderIntoDocument(factory());
		});
		it('can scry on our fake tag', function() {
			var children = TestUtils.scryRenderedDOMComponentsWithTag(instance, 'mymockchild');
			expect(children.length).toBe(1);
		});
		it('does maintains refs', function() {
			expect(instance.refs.child).not.toBeUndefined();
		});
		it('can capture props passed to child component', function() {
			expect(instance.refs.child.props).toEqual({ foo: "foo value", children: "children value" });
		});
	});
});
