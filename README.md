# Evo-WC

Evo-WC is a web component transpiler that takes template file based on HTML and XML and created raw JavaScript Web Component .js files. These components rely on the baseclass `DFElement` that is included. No other frameworks, libraries or code is needed.

You can create one or more components in the template file. But you can only have components or comments in the template file. Any other top level element will result in a compile error.

There are sample components in the `components` folder. They are semi-HTML files. Take a look at a few and read the docs to see how to create your own.

## Alpha Testing

After you clone the repo:

1. To install the repo run `npm install`
1. To launch the simple web server run `npm start` in one terminal
1. To transpile the components run `npm run build` in another terminal
1. To view the webpage browse to `http://localhost:5555`
1. To change which components are in the browser edit the file `static/index.html`
1. Please use the bug reporting in the issues section of the repo.
1. Any document suggestions should also be added to the issues section of the repo.
1. Write several component and test Evo-WC for any errors in the transpiler.
1. Try doing oddball things in your component, push the envelope.
1. Currently there is no way to loop through tags. So no auto generation of tables, list items, etc. That is coming.
1. **Please make a Pull Request with your example components or bug fixes.**
1. **Do not check into the master branch**

## Component Object

Each component is create by using the `<component></component>` tag. Each component must have a tag attribute that names the tag to be used in your HTML to access this component.

Each component must also include a `<template></template>` that represents the HTML template for your component

#### Example:

Template file:
```xml
<component tag="special-thing">
  <template>
    <p>Hello world.</p>
  </template>
</component>
```

Your HTML:
```html
<html>
<body>
  <h1>Example file</h1>
  <special-thing></special-thing>
  <script type="module">
    import { SpecialThingElement } from './js/components/SpecialThingElement.js';
  </script>
</body>
</html>
```

### Property definition attributes
You can define a set of properties that the component will use by adding attributes that starts with a colon (__`:`__). These will become properties on the object as well as attributes that are monitored by the `observedAttributes` callback.

#### Example:

``` xml
<component tag="special-thing" :message>
  <template>
    <p>Hello world.</p>
  </template>
</component>
```

The attribute `:message` in the `<component>` tag will create a property called `message` on the class and the attribute `message` will be observed. If you change the attribute it will also change the class property. Attributes that you place on the component in your HTML can be seen as the initial data for the component.

When you create a Property Definition attribute you can also define the data type of the generated property as well as a possible default value.

The variable types that can be user are `'number'`, `'int'`, `'string'`, `'bool'`, `'object'`, `'array'`, `'date'` with the default type being `'string'`.

#### Example

``` xml
<component tag="special-thing" :age="int:10">
  <template>
    <p>Hello world.</p>
  </template>
</component>
```

The property `age` is going to be a `number`. No matter what type of value you pass in, it will be converted into a number. So `component.age = '33'` will give it a numeric value of `33` and not a string of `"33"`.

> TODO: What other types do I need to support?

You can create private properties that are not accessable outside the component and are not settable by changing an attribute. These propertied are defined like this `:#propName` These properties can not be set outside of the generated class. Your code can call the getter and setter for these properties by using `const a = this.#propName;` or `this.#propName = 'something';`

#### INFO

Be aware that when you set a class property it will not affect the associated attribute on the component. We treat attributes for a property as an input to the component and not for an output. If you want to change an attribute on the component then you must call the exported function `setAttr` in your own code.

> _`setAttr` is exported from the file `DFElement.js`._

#### Example:

Component definition:
```xml
<component tag="my-message" :message>
  <template>
    <h1 ::text="message"></h1>
  </template>
</component>
```

HTML that uses the component:

```html
<html>
<body>
  <my-message message="Initial Message"></my-message>
  <button onclick="changeMessage()">Change message</button>
  <script>
    const target = document.querySelector('my-message');
    function changeMessage() {
      target.message = "Second Message";
    }
  </script>
</body>
</html>
```

Both before and after the user clicks on the button the message attribute for the `<my-message>` component will be `"Initial Message"`. But, the value for `target.message` will be `"Initial Message"` before the user clicks the button and `"Second Message"` after they click on the button.

All properties are defined in the class using private class fields. These private fields are exposed outside of the class by using public getter and setter function.

In the above example there is a private class field called `#message` and both a getter and a setter called `message`. When the setter is called is when the magic of Evo-WC happens. The setters know everything in the UI that needs to be updated. And, when you call the setter it does update only the things that use this variable.

#### dataset / data attributes
We support `data` attributes through the `dataset` property. If you create an attribute like this `:data-dog-food="varName` then the property `element.dataset.dogFood` will be set every time the setter for `varName` is called.

### File `DFElement.js`

There are three things exported from the file `DFElement.js`.

* The class `DFElement` - This is the base class for all of the generated Web Components.
* The function `setAttr` - A helper function that calls either `setAttribute` or `removeAttribute` based on the value passed in.
* The function `handleCondition` - A helper function that hides and shows a DOM element based on a value of the `condition` parameter.

#### Exported class `DFElement`

Do not override the member functions `connectedCallback`, `disconnectedCallback`, `adoptedCallback`, and `attributeChangedCallback`. Create your own funcitone `connected`, `disconnected`, `adopted`, and `attrChanged` instead.

#### Exported function `setAttr(el, attr, value)`

* `el` is the element to be affected.
* `attr` is the attribute to be set or reset.
* `value` is the value to set for the attribute.
  * If `value` is `null` then the attribute will be removed from the element `el`
  * Any other value will set the attribute to that value.

### Template tag
### Style tag
### Script tag
### Event tag
### Import tag

### Lifecycle Functions

You can provide, in your script, lifecycle functions that will be called at specific times in the lifecycle of the component.

* `init()` - Called at the end of the constructor. Follow all of the [requirements for custom element constructors and reactions](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-element-conformance).
* `update(member)` - Called every time any property is updated when the component is connected to the DOM. You can adjust any private properties in this function. If this componenet was previously disconnected from the DOM then this also is called when the component is reconnected. The value for `member` is the name of the member variable that was updated just before calling this function.
* `connected()` - Called when an attribute has changed. This is called by the base class `connectedCallback` function.
* `disconnected()` - Called when an attribute has changed. This is called by the base class `disconnectedCallback` function.
* `adopted()` - Called when an attribute has changed. This is called by the base class `adoptedCallback` function.
* `attrChanged(attr, oldVal, newval)` - Called when an attribute has changed. This is called by the base class `attributeChangedCallback` function.

## Bindings

### Properties
Within the template an attribute that starts with a colon ( __`:`__ ) indicates the name of the property that will be set by the variable defined in the quotes.

#### Example:

If we have this image tag in the template: `<img :src="imageUrl" :alt="imageTitle">`

* Every time that the component property `imageUrl` changes Evo-WC will set the `src` property of the image tag like this: `img.src = this.imageUrl`

* Every time that the component property `imageTitle` changes Evo-WC will set the `alt` property of the image tag like this: `img.alt = this.imageTitle`

> _This does NOT call code like Angular. It only uses a property value._

These attributes will be put into the property getter and setter functions.
Attributes can be set like this:
  * `:name` uses property called 'name'
  * `:attr.name` uses
                setAttribute('name', value) and, if value is null,
                removeAttribute('name')
  * `::html` uses property 'innerHTML'
  * `::text` uses property 'textContext'
  * `::value` provides two way binding for `<input>` and `<textarea>`. Like:
`<input ::value="firstName" />` will 2-way bind to the
`get firstName()` and `set firstName()`

### Attributes

### Events
An attribute that starts with a period ( __`.`__ ) are event handlers:
  * `.click="functionName"`
  * `.mouseup="#myMouseUp"`
You can use private member functions by starting the function name with `#` both here
and for the acctual function name. ([JavaScript private class fields](https://devdocs.io/javascript/classes/private_class_fields))

### Pipes
Property variables can use pipes to alter or format data without affecting the original values. Use the bar character ( __|__ ) to searate pipes
  * Like `:name="name|upperCase"` or  `:name="name|#upperCase|#reverse"`
  * All pipe methods take a `string` and return a `string`.<br/> 
    _<span style="color:red">This may need to take whatever type the var is and return anything</span>_

#### Example pipes

Pipes are very easy to write. You have only one incoming parameter and your pipe must return a string. Here are two example pipes:

```javascript
#upperCase(value) {
  return value.toUpperCase();
}

#revserse(value) {
  return [...value].reverse().join('');
}
```

### Conditionals: Do I use/automate CSS state?

You can use `:if="variable"` or `:if="!variable"` to conditionaly hide and show sections of the html template.

```html
<component tag="if-one" :state="bool:true">
  <template>
    <div>this.state is currently set to <span ::text="state"></span></div>
    <button .click="#toggleState">Toggle</button>
    <div class="red" :if="state">TRUE - This shows if this.state is set to true.
      <p>Go watcha fun movie!</p>
    </div>
    <div class="blue" :if="!state">FALSE - If this.state is set to false then this shows.
      <p>Listen to an audio book.</p>
    </div>
  </template>
  <style>
    .red {
      background-color: #F00;
      margin: 20px;
      padding: 20px;
    }
    .blue {
      background-color: #00F;
      color: #FFF;
      margin: 20px;
      padding: 20px;
    }
  </style>
  <script>
    #toggleState(event) {
      this.state = !this.state;
    }
  </script>
</component>
```

## Other exports

### setAttr(el, attr, value)
`setAttr` is a helper function that calls `removeAttribute(attr)` if you pass in `null` as the `value`. If the `value` is `true` then ir calls `setAttribute(attr, '')`. For all other values it calls `setAttribute(attr, value)`.

You can call `setAttr` from your own code. For example you can do the following to set the `name` attribute on your component:
```javascript
setAttr(this, 'name', 'SomeValue');
```
### handleCondition(el, condition, commentEl)
`handleCondition` is a helper function that is used with conditional attributes `:if` and `:switch`.

You pass in the element `el` that is conditionally to hide or show, the conditional value `condition` that is `true` or `false` and the comment element `commentEl` that will replace the element if the condition is `false`.

`handleCondition` will place either the element or the comment element into the DOM based on the condition.

> Normally this is not to be called by your code.

## Notes of things that still need to be finished

### Compine options
* Debug Mode that adds lost of debug code.
* Generates JSDOC comments
* Provide a way to add doc info into the template
* On compile error: set the output of the JS file to display the error message in the UI
* Do I allow TypeScript in the code??
* Map Files? Would they work? Of have the debug

### Pipes
* Regular pipes work.
* Importable pipes? Is this just an import and then calling that import from a member function?

### Conditional Attributes
* Add docs that explain how to use the `state` attribute and CSS to improve performance
* Conditionals should really only be used when large chunks of DOM are involved.
* `:if` works
* Add Looping (`:for`) - require _keys_, work to _limit DOM changes_
* Only allow one conditional attribute per element
* Should I add `:switch`
* Should I add any others??
  * https://angular.io/api/common#directives

### Other language version (increase tool usage)
* .NET
* Java
* Python
* Gulp
* Grunt
* Webpack
* Babble
* Rollup

### Properties that need to be renamed or changed to attributes: (List not complete)

| convert from | convert to |
| --- | --- |
| class | className |
| style | attr.style |
| accept | attr.accept |


## Reference
* [Custom elements](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements)
* [JavaScript private class fields](https://devdocs.io/javascript/classes/private_class_fields)
* [Web Components Can Now Be Native Form Elements
](https://javascript.plainenglish.io/web-components-can-now-be-native-form-elements-107c7a93386)
* [How to style shadow DOM with ::part() and ::slotted()](https://ziga-petek.medium.com/styling-shadow-dom-with-part-and-slotted-bc4bc94ab56b)
