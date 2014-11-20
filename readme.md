# some notable differences when using Jest and React 0.12 #

According to this link: https://gist.github.com/sebmarkbage/d7bce729f38730399d28, non-jsx components must be wrapped in a `React.createFactory()`. But, when testing these components using Jest, I've found that these are not interchangeable within tests that mock sub-modules.

I'm guessing that the differences stem from using `.bind()` within `React.createFactory`:
```
function createFactory(type){
  return React.createElement.bind(null, type);
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

## sub-components referenced in refs are not found ##
In any of the above cases, your refs are not going to work. You can work around this by using `jest.dontMock()` for the sub-module for which you've assigne a `ref`, but this doesn't really allow you to test a component in isolation.
