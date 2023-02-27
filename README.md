# Evo-WC

Evo-WC is a web component transpiler that takes template file based on HTML and XML and created raw JavaScript Web Component .js files. These components rely on the baseclass `EvoElement` that is included. No other frameworks, libraries or code is needed.

You can create one or more components in the template file. But you can only have components or comments in the template file. Any other top level element will result in a compile error.

There are sample components in the `components` folder. They are XML based files. Take a look at a few and read the docs to see how to create your own.


<div style="background:#300;border:3px dashed #A00;margin:20px;padding:10px">

## Alpha Testing

After you clone the repo:

1. To install the repo run `npm install`
1. To launch the simple web server run `npm start` in one terminal
1. To transpile the components run `npm run build` in another terminal
1. To view the webpage browse to `http://localhost:5555`
1. To change which components are in the browser edit the file `static/test.html`
1. Please use the __bug reporting in the issues section__ of the repo.
1. Any __document suggestions__ should also be added to the issues section of the repo.
1. __Write several component__ and test Evo-WC for any errors in the transpiler.
1. __Do oddball things__ in your component, push the envelope.
1. Currently there is no way to loop through tags. So no auto generation of tables, list items, etc. That is coming.
1. **Please make a Pull Request with your example components or bug fixes.**
1. **Do not check into the master branch**

</div>

## Parts of a component file

The component file is based on XML. Your component is defined with a `<component>` element. You must include the `tag="component-name"` attribute in the `<component>` element.

The valid elements inside the `<component>` element are:

* `<template>` - The HTML for your component.
* `<style>` - The CSS for this component.
* `<script>` - Custom JavaScript for this component.
* `<import>` - List needed imports at the top of the generated JavaScript file.

The minimal component is made up by using both the `<component>` and `<template>` tags like this:

``` xml
<component tag="my-tag">
  <template>Hi</template>
</component>
```

## Component Element

Each component is created by using the `<component></component>` element. Each component must have a `tag` attribute that names the element tag to be used in your HTML to access this component.

Each component must also include a `<template></template>` that represents the HTML template for your component

#### Example:

Template file:
``` xml
<component tag="special-thing">
  <template>
    <p>Hello world.</p>
  </template>
</component>
```

Your HTML:
``` html
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

### Property Definition Attributes (PDA)

Most components will need to provide a way for the parent code to interact with the component. This is done by adding attributes into the `<component>` element that starts with a colon (__`:`__). These attributes will become properties on the component object as well as attributes that are monitored by the component's `observedAttributes` callback.

#### Example:

``` xml
<component tag="special-thing" :message>
  <template>
    <p :text="message"></p>
  </template>
</component>
```

The attribute `:message` in the `<component>` element will create a public property called `message` in the component class and the component will observe changes made to the `message` attribute. If you change the `message` attribute the code will also change the component property.

When you create a PDA you can also define the data type of the generated property as well as an optional default value.

The variable types that can be user are `'number'`, `'int'`, `'string'`, `'bool'`, `'object'`, `'array'`, `'date'` with the default type being `'string'`.

#### Example

``` xml
<component tag="special-thing" :age="int:10">
  <template>
    <p>Hello world.</p>
  </template>
</component>
```

In the example above the property `age` will be a number and will have a default value of `10` when the component is constructed. Any value passed into `component.age` will be converted into a number. So `component.age = '33'` will store a numeric value of `33` and not a string of `"33"`.

You can create private properties that are not accessable outside the component and are not settable by changing an attribute. These propertied are defined like this `:#propName` These properties can not be set outside of the generated class. Your code can call the getter and setter for these properties by using `const a = this.#propName;` or `this.#propName = 'something';`

#### INFO

Be aware that when you set a class property it will not affect the associated component attribute. We treat attributes for a property as an input to the component and not for an output. If you want to change an attribute on the component then you must call the exported function `setAttr` in your own code.

**_<span style="color:yellow">2023-02-27</span> - We are working on a way to indicate that a component attributemust be changed when the associated value is changed. Probably adding an explamation mark to the beginning of a PDA. Probably like this:_ '`:!show="boolean:false"`' or this '`:+show="boolean:false"`'**

> _`setAttr` is exported from the file `EvoElement.js`._

#### Example:

Component definition:

```xml
<component tag="my-message" :message>
  <template>
    <h1 :text="message"></h1>
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

> All public component properties are defined in the component class using private class fields. These private fields are exposed outside of the class by using public `getter` and `setter` methods.

In the above example there is a private class field called `#message` and both a getter and a setter called `message`. When the setter is called is when the magic of Evo-WC happens. The setters know everything in the UI that needs to be updated. And, when you call the setter it does update only the things that use this variable.

#### dataset / data attributes
We support setting the `data` attributes through the `dataset` property. If you create an attribute like this `:data-dog-food="varName"` then the property `element.dataset.dogFood` will be set every time the setter for `varName` is called.

We recommend using dataset attributes for passing needed data to an event handler.

##### example using dataset to pass params

``` xml
<component tag="my-el" :#locale>
  <template>
    <p>Current locale is <span :text="#locale"></span></p>
    <button data-locale="en" .click="#handleLocale">EN</button>
    <button data-locale="ja" .click="#handleLocale">JS</button>
    <button data-locale="ru" .click="#handleLocale">RU</button>
  </tamplate>
  <script>
    #handleLocale(event) {
      this.#locale = event.target.dataset.locale;
    }
  </script>
<component>
```

### Style element
Place all of your CSS for the component into this `<style>` element.

> Possible future plans to allow importing external CSS files.

### Script element
Place all of your JavaScript for the component into this `<script>` element. All of the code you place in here is inserted into the component class as class methods.

<div style="background:#F00;color:#000;margin:0 20px 8px;padding:2px 8px;font-weight:bold;">Important: Do not use fat arrow functions for your class methods.</div>

#### Lifecycle Methods

You can provide, in your script, lifecycle functions that will be called at specific times in the lifecycle of the component.

| Method | Description |
| --- | --- |
| `init()` | Called at the end of the constructor. Follow all of the [requirements for custom element constructors and reactions](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-element-conformance). |
| `update(member)` | Called every time any property is updated when the component is connected to the DOM. You can adjust any private properties in this function. If this componenet was previously disconnected from the DOM then this also is called when the component is reconnected. The value for `member` is the name of the member variable that was updated just before calling this function. |
| `connected()` | Called when an attribute has changed. This is called by the base class `connectedCallback` function. |
| `disconnected()` | Called when an attribute has changed. This is called by the base class `disconnectedCallback` function. |
| `adopted()` | Called when an attribute has changed. This is called by the base class `adoptedCallback` function. |
| `attrChanged(attr, oldVal, newval)` | Called when an attribute has changed. This is called by the base class `attributeChangedCallback` function. |

### Import element
Place any imports that are needed for this class and only for this class in this element.


## Bindings

### Properties and Attributes

Within the template an attribute that starts with a colon ( __`:`__ ) indicates the name of the property that will be set by the variable defined in the quotes.

#### Example:

If we have this image tag in the template: `<img :src="imageUrl" :title="#imageTitle">`

* Every time the component's public property `imageUrl` changes Evo-WC will set the `src` property of the image tag like this: `img.src = this.imageUrl;`

* Every time the component's private property `#imageTitle` changes Evo-WC will set the `title` property of the image tag like this: `img.title = this.#imageTitle;`

> _You can only place public or private propert names in the quotes and NOT call code like Angular._

Generaly these values will be put into the property getter and setter methods. There are certain properties that do not exist in an HTML element and so we auto-set the attribute instead. For example there is no `alt` property on an `<img>` element so Evo WC will set the attribute `alt` instead. _Evo WC will only convert from properties to attributes for the well defined standard HTML attributes._

> _**As of 2023-02-27 We have not compleated the attribute conversion list.**_

The template element attributes can be set like this:

 | Attr | Code generated |
 | --- | --- |
 | `:title="val"` | `element.title = this.val` |
 | `:title="#val"` | `element.title = this.#val` |
 | `:attr.state="st"` | `element.setAttribute('state', this.st)` or, if the value of `this.st` is `null`, `element.removeAttribute('state')` |
 | `:html="value` | `element.innerHTML = this.value` |
 | `:text="name"` | `element.textContext = this.name` |

#### 2-way-binding - `:value`

`:value` provides two way binding for `<input>` and `<textarea>` elements. Like: `<input :value="firstName" />` will 2-way bind to the component's `get firstName()` and `set firstName()` methods.

### Events
An attribute that starts with a period ( __`.`__ ) are event handlers:
  * `.click="functionName"`
  * `.mouseup="#myMouseUp"`

> You can use private member functions by starting the function name with `#` both here
and for the acctual function name. ([JavaScript private class fields](https://devdocs.io/javascript/classes/private_class_fields))

### Pipes
Property variables can use pipes to alter or format data without affecting the original values. Use the bar character ( __|__ ) to searate pipes
  * Like `:name="name|upperCase"` or  `:name="name|#upperCase|#reverse"`
  * All pipe methods take a `string` and return a `string`.

  > _<span style="color:red">**TODO:** This may need to take whatever type the var is and return anything</span>_

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

### Conditionals

You can use `:if="variable"` or `:if="!variable"` to conditionaly hide and show sections of the html template.

```html
<component tag="if-one" :state="bool:true">
  <template>
    <div>this.state is currently set to <span :text="state"></span></div>
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
  </s>
  <script>
    #toggleState(event) {
      this.state = !this.state;
    }
  </script>
</component>
```

## File `EvoElement.js`

There are three things exported from the file `EvoElement.js`.

* The class `EvoElement` - This is the base class for all of the generated Web Components.
* The function `setAttr` - A helper function that calls either `setAttribute` or `removeAttribute` based on the value passed in.
* The function `handleCondition` - A helper function that hides and shows a DOM element based on a value of the `condition` parameter.

### Exported class `EvoElement`

This is used by Evo WC as the base class for all component. Normally you will not use this base class yourself.

In your component class you must not override the built in methods `connectedCallback`, `disconnectedCallback`, `adoptedCallback`, and `attributeChangedCallback`. Instead you will create your own methods `connected`, `disconnected`, `adopted`, and `attrChanged`.

### Exported function `setAttr(el, attr, value)`

* `el` is the element to be affected.
* `attr` is the attribute to be set or reset.
* `value` is the value to set for the attribute.
  * If `value` is `null` then the attribute will be removed from the element `el`
  * Any other value will set the attribute to that value.

`setAttr` is a helper function that calls `el.removeAttribute(attr)` if you pass in `null` as the `value`. If the `value` is `true` then it calls `el.setAttribute(attr, '')`. For all other values it calls `el.setAttribute(attr, value)`.

While it is not likely that you will need to, you can call `setAttr` from your own code. For example you can do the following to set the `name` attribute on your component:
```javascript
setAttr(this, 'name', 'SomeValue');
```
### Exported function `handleCondition(el, condition, commentEl)`
`handleCondition` is a helper function that is used with conditional attributes `:if` and `:switch`.

> 2023-02-27 - `:switch` is not yet supported.

You pass in the element `el` that is conditionally to hide or show, the conditional value `condition` that is `true` or `false` and the comment element `commentEl` that will replace the element if the condition is `false`. It is important to have a unique comment element for each conditional.

`handleCondition` will place either the element or the comment element into the DOM based on the condition.

> Normally, this is not to be called by your code.

---

## Notes of things that still need to be finished

### PDAs
* Provide a way to tie a component attribute to its property
  * Maybe like this: `:!show` or this `:+show`

### Date Types
* Support bigint

### Compile options
* Debug Mode that adds lost of debug code.
* Generates JSDOC comments
* Provide a way to add doc info into the template
* On compile error: set the output of the JS file to display the error message in the UI
* Do I allow TypeScript in the code??
* SourceMaps? Would they work?

### Pipes
* Regular pipes work.
* Importable pipes? Is this just an import and then calling that import from a member function?

### Conditional Attributes
* Add docs that explain how to use the `state` attribute and CSS to improve performance
* Conditionals should really only be used when large chunks of DOM are involved.
* `:if` works
* `:swich` is coming
* Add Looping (`:for`)
  * require a _key_ field.
  * Improve it to _limit DOM changes_ (Reuse DOM where possible)
* Only allow one conditional attribute per element
* Should I add any others??
  * https://angular.io/api/common#directives

### Things to prevent

* ERROR: Do not allow `<script>` in the template or style sections
* ERROR: Do not allow `<style>` in the template or script sections
* ERROR: Do not allow any `on????` event attributes in the template.
  * Indicate that they need to convert to a `.event` handler instead.

### Other language version (increase tool usage)

Sometime in the near future we plan to release translpilers in different languages since not all backends are written in JavaScript. We want to support as many tools and lanuguages as possible. Here is the suggested list:

* .NET
* Java
* Python
* Gulp
* Grunt
* Webpack
* Babble
* Rollup

## Element properties that are renamed or changed to attributes: 

| converted from | converted to |
| --- | --- |
| accept | attr.accept |
| alt | attr.alt |
| for | attr.for |
| html | innerHTML |
| class | className |
| style | attr.style |
| text | textContent |

> 2023-02-27 - List not complete

## Reference
* [Custom elements](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements)
* [JavaScript private class fields](https://devdocs.io/javascript/classes/private_class_fields)
* [Web Components Can Now Be Native Form Elements
](https://javascript.plainenglish.io/web-components-can-now-be-native-form-elements-107c7a93386)
* [How to style shadow DOM with ::part() and ::slotted()](https://ziga-petek.medium.com/styling-shadow-dom-with-part-and-slotted-bc4bc94ab56b)
