# some notable differences when using Jest and React 0.12 #

Disclaimer: What I am doing may be obvious to some people, but I've spent a few days wrapping my head on how to test mocked React sub-modules using Jest. Hopefully, this will save people some time.

According to this link: https://gist.github.com/sebmarkbage/d7bce729f38730399d28, non-jsx modules must be wrapped in a `React.createFactory()`. But, when testing these modules using Jest, I've found that these are not interchangeable within tests that mock sub-modules.

I'm guessing that the differences stem from using `.bind()` within `React.createFactory`:
```
function createFactory(type){
  return React.createElement.bind(null, type);
}
```

Or within `ReactCompositeComponent.createClass()`:
```
createClass: function(spec) {
	...
    if ("production" !== process.env.NODE_ENV) {
      return ReactLegacyElement.wrapFactory(
        ReactElementValidator.createFactory(Constructor)
      );
    }
    return ReactLegacyElement.wrapFactory(
      ReactElement.createFactory(Constructor)
    );
}
```

## How to run tests ##
* clone this repo
* `npm install`
* `node_modules/.bin/jest`

## When using pure jsx ##
* You cannot `.scryRenderedComponentsWithType()` of a mocked module
* You can capture calls to the sub-module to see what props have been passed from the parent.

## When using React.createFactory() from parent module ##
* You can correctly `.scryRenderedComponentsWithType()` of a mocked module
* You cannot capture calls to the sub-module to see what props have been passed from the parent.

## When using React.createElement() from parent module ##
I know this isn't the documented way of rendering a sub-module from a parent, but I've included it for illustration purposes. This behaves exactly like a pure jsx implementation.

## sub-modules referenced in refs are not found ##
In any of the above cases, your refs are not going to work. You can work around this by using `jest.dontMock()` for the sub-module for which you've assigne a `ref`, but this doesn't really allow you to test a module in isolation.

# Solution #

After flailing around for a bit, I've found a solution that allows you to test sub-modules as mocks. There are still some Gothcas! to watch out for, though. Please note that underlying React/Jest APIs may change so the following may end up breaking. I've not seen an example of a facebook test file but would be really interested in seeing one if someone knows of one that is publicly available.

* Use JSX. It seems that using JSX is fairly future proof and will be a mainstay for React development, so that's a plus.

* When testing a React module that uses sub-modules that you want to mock, use `TestUtils.mockModule(require('../my-sub-module'));`. I'd also suggest passing a second string parameter with some fake tag name that will uniquely identify your sub module, e.g. `TestUtils.mockModule(require('../my-sub-module'), 'mysubmoduletag');`. If you want access to the sub-module's constructor, you'll have to do something like: `var SubModule = require('../my-sub-module'); TestUtils.mockModule(SubModule, 'mysubmodule');` This way, you can assert props passed to the item if you're using the sub-module more than once and cannot use refs to isolate the instance (as in rendering an array of items using a sub-module)

* The `refs` you've defined from the parent module will properly resolve to their respective sub-modules.

* To locate a collection of your mocked sub-modules, use `TestUtils.scryRenderedDomComponentsWithTag(component, 'tagname');`. This is why I suggest using a unique fake tag when you're using `TestUtils.mockModule()`

* If your parent has one ref pointing to the sub-module, you can assert that props are properly passed to your sub-module's rendered element by grabbing the `.props` from it: `var submodule = parent.refs.foo; console.log(submodule.props);`. However, if you have multiple sub-modules (because you're looping through an array or something), you'll have to test that props are correctly passed a little differently:

```
var SubModule = require('../lib/sub-module');
TestUtils.mockComponent(SubModule, 'submodule');
var instance = TestUtils.renderIntoDocument(<Parent items={ ['foo', 'bar'] }/>);
// test that a sub-module is rendered for each item
expect(TestUtils.scryRenderedDOMComponentsWithTag(instance, 'submodule').length).toBe(2);
expect(SubModule).toBeCalledWith({ item: "foo" });
expect(SubModule.lastCalledWith({ item: "bar" });
```
