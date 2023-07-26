### Events
An attribute that starts with a period ( __`.`__ ) are event handlers:
  * `.click="functionName"`
  * `.mouseup="#myMouseUp"`

> You can use private member functions by starting the function name with `#` both here
and for the acctual function name. ([JavaScript private class fields](https://devdocs.io/javascript/classes/private_class_fields))

All event handlers receive two arguments. The first is the `event`. and the second is `data`. `data` is the same as `event.target.dataSet`

You can not pass any parameters into the event handler. Instead you add data attributes with anything you need to access in the event handler. For example you can have several buttons call the same method to change the component's locale. Each button has a different value for the attribute `data-locale` like this:


``` xml
<component tag="my-thing" :#locale>
  <template>
    <button .click="#setLocale" data-locale="en">EN</button>
    <button .click="#setLocale" data-locale="fr">FR</button>
    <button .click="#setLocale" data-locale="es">ES</button>
  </template>
  <script>
    #setLocale(event, data) {
      this.#local = data.locale;
    }
  </script>
</component>
```

### Conditionals

You can use `$if="variable"` or `$if="!variable"` to conditionaly hide and show sections of the html template.

```html
<component tag="if-one" :state="bool:true">
  <template>
    <div>this.state is currently set to <span :text="state"></span></div>
    <button .click="#toggleState">Toggle</button>
    <div class="red" $if="state">TRUE - This shows if this.state is set to true.
      <p>Go watcha fun movie!</p>
    </div>
    <div class="blue" $if="!state">FALSE - If this.state is set to false then this shows.
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

### Conditional Todo

> *2023-07-05 - Conditionals do not currently work with object properties. So, `$if="#person.name"` fails.*

## Base class File `EvoElement.js`

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

`handleCondition` is a helper function that is used with conditional attributes `$if` and `$switch`.

> 2023-02-27 - `$switch` works but is poorly designed and will be replaced.

You pass in the element `el` that is conditionally to hide or show, the conditional value `condition` that is `true` or `false` and the comment element `commentEl` that will replace the element if the condition is `false`. It is important to have a unique comment element for each conditional.

`handleCondition` will place either the element or the comment element into the DOM based on the condition.

> Normally, this is not to be called by your code.

---

## Notes of things that still need to be finished

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
* Importable pipes?
  * Is this just an import and then calling that import from a member function?
  * Is there a special way to indicate an imported pipe?

### Conditional Attributes

* Add docs that explain how to use the `state` attribute and CSS to improve performance
* Conditionals should really only be used when large chunks of DOM are involved.
* `$if` works
* `$swich` is coming
* Add Looping (`$for`)
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
* PHP
* Python

And we want to add the transpiler to the following tools:

* Gulp
* Grunt
* Webpack
* Babble
* Rollup

## Reference

* [Custom elements](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements)
* [JavaScript private class fields](https://devdocs.io/javascript/classes/private_class_fields)
* [Web Components Can Now Be Native Form Elements
](https://javascript.plainenglish.io/web-components-can-now-be-native-form-elements-107c7a93386)
[Custom element reactions](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-element-reactions) - New things for form elements
* [Declarative Shadow DOM](https://developer.chrome.com/en/articles/declarative-shadow-dom/)



## Router Component

Evo has a simple router component.
We use the express.js syntax for routes (/users/:id) to map URLs to Web Component views.
You are responsible for making sure that your server properly responds to all routes to load the same page.


* 2-way binding with async validation
* route to non existant file or element that is not in the file??
  * Do I just allow for `element` or `import` attribute?


