'use strict';
jest.dontMock('../lib/parent-using-jsx');
jest.dontMock('../lib/parent-using-create-factory');
jest.dontMock('../lib/parent-using-create-element');
describe('comparing jsx vs .createFactory() vs .createElement()', function() {
	var React, TestUtils,
		Child;
	beforeEach(function() {
		React = require('react/addons');
		TestUtils = React.addons.TestUtils;

		Child = require('../lib/child');
	});
	describe('when using jsx only', function() {
		var Parent, instance;
		beforeEach(function() {
			Parent = require('../lib/parent-using-jsx');
			instance = TestUtils.renderIntoDocument(<Parent/>);
		});
		it('should scry children but cannot', function() {
			var children = TestUtils.scryRenderedComponentsWithType(instance, Child);
			expect(children.length).toBe(1);
		});
		it('does not maintain refs', function() {
			expect(instance.refs.child).not.toBeUndefined();
		});
		it('can capture Child instantiation calls', function() {
			expect(Child).lastCalledWith({ foo: "foo value", children: "children value" });
		});
	});
	describe('when using parent that uses .createFactory()', function() {
		var factory, instance;
		beforeEach(function() {
			factory = React.createFactory(require('../lib/parent-using-create-factory'));
			instance = TestUtils.renderIntoDocument(factory());
		});
		it('can properly scry children', function() {
			var children = TestUtils.scryRenderedComponentsWithType(instance, Child);
			expect(children.length).toBe(1);
		});
		it('does not maintain refs', function() {
			expect(instance.refs.child).not.toBeUndefined();
		});
		it('cannot capture Child instantiation calls', function() {
			expect(Child).lastCalledWith({ foo: "foo value", children: "children value" });
		});
	});
	describe('when using parent that uses .createElement()', function() {
		var factory, instance;
		beforeEach(function() {
			factory = React.createFactory(require('../lib/parent-using-create-element'));
			instance = TestUtils.renderIntoDocument(factory());
		});
		it('should scry children but cannot', function() {
			var children = TestUtils.scryRenderedComponentsWithType(instance, Child);
			expect(children.length).toBe(1);
		});
		it('does not maintain refs', function() {
			expect(instance.refs.child).not.toBeUndefined();
		});
		it('can capture Child instantiation calls', function() {
			expect(Child).lastCalledWith({ foo: "foo value", children: "children value" });
		});
	});
});
