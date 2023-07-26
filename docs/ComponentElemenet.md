# `<component>` Element

[<< Prev](../README.md) README.md &nbsp; &nbsp; | &nbsp; &nbsp; [Next >>](./TemplateElement.md) `<template>` Element

---

At the core of Evo is the `<component>` element, which serves as the foundation for defining your custom components. This element allows you to encapsulate your component's template, styles, and behavior in a single, reusable unit. To create a minimal web component, you simply use the `<component>` and `<template>` elements, as shown here:

```html
<component tag="my-tag">
  <template>Hi</template>
</component>
```

Here, we've defined a component with the tag `"my-tag"` and a basic template containing the text `"Hi"`. Once transpiled, this component is immediately usable. You can expand it by adding custom styles, JavaScript functionality, and more elements to the template.

The `<component>` element is crucial for building self-contained, reusable, and encapsulated web components that adhere to web standards. The `tag` attribute is required, providing a unique name for your component, which you can then use as a custom element in your HTML.  As you explore Evo, you'll discover how to leverage the power of the `<component>` element to create complex and dynamic web components to enhance your web development projects.

We recommend creating unique tag names by incorporating a collection name or a company name as the initial part of the component's tag. This approach minimizes the chances of potential name collisions with third-party components. It is essential to ensure that each tag name corresponds to a single custom element, allowing for better organization and clarity in your project.

> Examples:
> * If you are developing components for a company named "**Acme**," you can prefix your components with the company name to ensure uniqueness. For example, a slider component could be named `acme-slider`.
> * If you are building components for your own application named "**MyApp**," you can use the application name as a prefix. For instance, a sidebar component could be named `myapp-sidebar`.
> * If you are developing a collection of components for an "**Awesome UI**" library, you can use the library name as a prefix. For example, a button component could be named `awesome-ui-button` or `awesomeui-button`.

[Read this](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name) for the rules on tag names.

## CPAs

CPA stands for "Component Property Attribute." This term is used in Evo to describe the **attributes** added to the `<component>` element that define the **properties** in your transpiled component. CPAs are automatically converted into corresponding properties in your web component, making it easier to interact with and manage data within the component. Public CPAs are also available as watched attributes on your transpiled component. When the attribute is changed the property is updated to reflect that change.

The attribute names for CPAs always start with a (`:`) character. In this case `tag="my-el"` , `tag` is just an attribute. In this case `:title="str"`, `title` is a CPA because it starts with the (`:`) character and Evo knows how to use that throughout the rest of your file.

CPAs in Evo function similarly to React's "props" or Angular's "input properties," serving as a means of passing data from parent components to their child components. However, the notable difference lies in how CPAs are transpiled into getter and setter functions on the component class, making them accessible by the parent, and internally, as class properties.

By utilizing CPAs, developers can define class properties for their components, allowing the parent code to read and write data to the component during initialization or runtime. This seamless data binding facilitates smooth information transfer across different parts of the application, enhancing the overall functionality and interactivity of the components.

Let's consider the following example:

```html
<component tag="some-thing" :message>
  <template>
    <p :text="message"></p>
  </template>
</component>
```

In this case, the CPA `:message` inside the `<component>` element will automatically create a public property named `message` in the component class. Additionally, the component will keep an eye on any changes made to the `message` attribute. If the message attribute is modified in the parent code, the component's `message` property will also be updated accordingly.

This powerful feature simplifies the interaction between parent and child components. By establishing a clear link between attributes and properties, developers can easily manage data flow and ensure that any changes in the parent code are efficiently reflected in the component's behavior and UI. CPAs promote modularity and reusability by allowing components to encapsulate their logic while still being easily configurable by external code.

CPAs offer several advantages over state management solutions like React's `useState`. With CPAs, developers can directly define component properties, their types, and default values, leading to more concise and readable code. Unlike `useState`, which requires developers to write additional boilerplate code to handle state changes, CPAs automatically manage data binding. This reduces complexity and ensures a more intuitive approach to handling component properties, making CPAs the preferred choice for streamlined and efficient web component development.

> FYI: During transpilation, Evo defines the public CPA properties as public getter and setter methods. The magic of Evo-WC occurs when the setter is called, as it automatically updates all relevant UI elements that depend on this variable, ensuring efficient and precise updates. Evo also supports private CPAs as described in the section [Public vs Private CPAs](#public-vs-private-cpas)

&nbsp;

----

### kebab-case and camelCase

CPAs are defined as **kebab-case** attributes within the `<component>` tag. This naming convention aligns with HTML standards for attribute names, providing consistency and familiarity to developers.

However, when CPAs are transformed into properties in the component class, they are converted to **camelCase**, which is a common convention in JavaScript for defining variables and properties. This naming convention is consistent with other HTML standards, such as dataset variables, where **kebab-case** is used in the HTML attribute, but **camelCase** is employed to access the corresponding property in JavaScript.

In the code snippet below, we have a custom component named `<some-thing>` with three CPAs defined: `"locale"`, `"person-name"`, and `"person-age"`. These are defined as attributes on the component and allow the parent code to set values on this component. Evo also created these CPAs into corresponding class properties: `locale`, `personName`, and `personAge`.

```html
<component tag="some-thing"
  :locale="str:en"
  :person-name="str"
  :person-age="int">
</component>
```

In this example, the parent code can interact with the `<some-thing>` component by setting the `locale`, `person-name`, and `person-age` attributes. Within the component, these attributes are automatically mapped to the corresponding class properties: `locale`, `personName`, and `personAge`. This mapping allows for easy access and manipulation of the component's data and enhances code readability and maintainability.

This standardized approach for naming CPAs, attributes, and properties ensures a seamless integration between the HTML template and the JavaScript logic. It promotes code readability, reduces potential naming conflicts, and aligns with well-established best practices in HTML, CSS, and JavaScript development. By adhering to these standards, Evo empowers developers to build components that feel native to the web platform while promoting code consistency and maintainability.

> FYI: It's crucial to exercise caution when using a CPA that shares the same name with a reserved attribute or property in HTML, as it can lead to potential problems. It is essential to carefully choose the names for your CPAs to ensure compatibility with existing code. For instance, all components already support a `title` attribute and property. If you decide to use `:title` as a CPA in your component, it's essential to uphold the standard expectation of what `title` represents in HTML to prevent any conflicts or confusion. This ensures smooth integration with existing codebases and adheres to established conventions.

<a name="public-vs-private-cpas">&nbsp;</a>

----

### Public vs Private CPAs

Public CPAs in web components offer developers a standardized and flexible way to interact with their components. By exposing specific properties, developers can easily customize the component's behavior and appearance, enabling reuse in various contexts. Public CPAs facilitate bidirectional communication between the component and parent code, through getters and setters, ensuring changes made in parent code are automatically reflected in the component. Overall, public CPAs enhance reusability, maintainability, and interoperability, providing a clear and controlled interface for seamless integration with other frameworks and libraries.

In Evo, you have the option to create private properties that are not accessible outside the component and cannot be directly set by changing an attribute on the component. These private properties are defined with `#` character, as in `:#propName`. It's important to note that the `#` character is standard part of the JavaScript specification for private class fields.

Utilizing private properties marked with the `#` character guarantees that the data remains encapsulated within the component's generated class, ensuring accessibility solely within the component's code. This level of encapsulation offers greater control over the component's internal data, preventing unintended side effects and external interference.

In contrast to public CPAs, private properties cannot be directly set from outside the component. However, component code can interact with these private properties through private getter and setter methods. For example, to access the value of a private property named `propName`, you would use `const a = this.#propName;`. Likewise, to assign a value to the private property, you can use `this.#propName = 'something';`. This approach promotes a secure and controlled environment for managing component data while retaining the flexibility to manipulate it when needed.

By following the JavaScript specification for private fields, Evo ensures that your component's data remains secure and provides a more reliable and organized way to manage component properties.

&nbsp;

----

### The relationship between properties and attributes

By default, a CPA does not automatically change the associated attribute in the component when the property is changed. This behavior aligns with how standard HTML elements behave. For instance, the `value` attribute of an `<input>` is utilized when a form is initialized or reset, but altering the `value` property does not change the `value` attribute.

However, there are instances where you might want a property to also update the corresponding attribute on the component. The `src` attribute of an `<img>` tag is changed when you set the `src` property. This can also be desirable when dealing with CSS. To achieve this, you can include a `+` symbol in your CPA, like `:+show`. With this example, when you set the `show` property, it will simultaneously set the `show` attribute on the component. This feature provides greater flexibility, allowing your component to behave more like standard HTML elements while offering additional control over attribute changes based on property updates.

> It's important to remember that attributes are always treated as strings in HTML. Therefore, setting an attribute with a non-string property value can lead to adverse effects or unintended consequences. Be mindful of data types and conversions to maintain the expected behavior of your components and avoid any unexpected behavior caused by incorrect attribute values.

&nbsp;

----

### CPA Date Types

When creating a CPA, you have the option to define the data type of the generated property and provide an optional default value.

The supported variable type names are:

* `'string'` or `'str'`
* `'boolean'` or `'bool'`
* `'int'`
* `'number'` or `'num'`
* `'bigint'`
* `'array'` or `'arr'`
* `'object'` or `'obj'`
* `'date'`

The default type being `'string'`.

Let's consider the following example:

```html
<component tag="special-thing" :age="int:10" :name :enable="bool:false">
  <template>
    <p>Hello <span :text="name"></span>.</p>
    <p>You are <span :text="age"></span> years old.</p>
  </template>
</component>
```

In this example, we have defined three CPAs with different data types and optional default values:

`'age'` is of type `'int'` and has a default value of `10`.
`'name'` is of type `'string'` and does not have a default value, so it will be initialized as an empty string.
`'enable'` is of type `'bool'` and has a default value of `false`.

With this setup, when the component is constructed, it will automatically create properties with the specified data types. Any value passed into these properties will be converted to the corresponding data type. For example, if `component.age = '33'` is assigned, the property `age` will store the numeric value `33`, not a string `"33"`. This ensures consistent data handling and proper type conversions for CPAs, making it easier to work with data in your components.

> It's crucial to note that not all data types can be accurately converted. To avoid issues, ensure that you only set properties with valid and compatible data types.

To set the default value for a `'boolean'` CPA use the string `false` or `true`. For example: `:show="bool:true"` or `:enabled="bool:false"`.

To set the default value for a `'date'` CPA use a string formatted date, as shown here: `:today="date:2023-07-24T18:04:43.349Z"`. Any string recognized by the [Date.parse() method](https://devdocs.io/javascript/global_objects/date/parse) is allowed for specifying the default value.

To set the default value for an `'array'` CPA use a string that conforms to the formatting of a JavaScript array or a JSON array. Be aware of [how to encode attribute values](#encoding-default-values).

To set the default value for an `'object'` CPA use a string that conforms to the formatting of a JavaScript Object or a JSON object. Be aware of [how to encode attribute values](#encoding-default-values).

&nbsp;

----

### Upper and lower limits for numeric CPAs

When defining the type of a numeric CPA, you have the flexibility to set optional minimum and maximum limits for the property. These defined limits will ensure that the property's value remains within the specified range. If the value provided for the CPA falls outside this range, it will be automatically clamped to fit within the defined limits. This feature allows for better control and validation of numeric data in your components, ensuring that they adhere to the required constraints.

Let's consider the following examples:

```html
<component tag="example-1" :count="int(1)">
  <template>
    <p>Count: <span :text="count"></span></p>
  </template>
</component>

<component tag="example-2" :things="num(0,9.9)">
  <template>
    <p>Things: <span :text="things"></span></p>
  </template>
</component>

<component tag="example-3" :eyes="int(,4)">
  <template>
    <p>Eyes: <span :text="eyes"></span></p>
  </template>
</component>
```

In the examples above:

* `example-1` has a CPA named `count` with data type `'int'`. The `(1)` indicates that `count` has a minimum value of `1` and no maximum value.
* `example-2` has a CPA named `things` with data type `'number'`. The `(0,9.9)` indicates that `things` has a minimum value of `0` and a maximum value of `9.9`.
* `example-3` has a CPA named `eyes` with data type `'int'`. The `(,4)` indicates that `eyes` has no minimum value and a maximum value of `4`.

By specifying these limits, you can ensure that the assigned values to the properties fall within the defined range, providing more control and validation for your component's data.

<a name="encoding-default-values">&nbsp;</a>

----

### Encoding default values of a CPA

HTML Entity encoding is an HTML standard for attribute values and a valuable tool when working with default values in CPAs. If you need to include special characters like double quotes in the default value, it is essential to use URI encoding to ensure proper parsing.

In HTML, certain characters have special meanings and need to be encoded to be correctly interpreted by the browser. For instance, the double quote character (`"`) is a reserved character in HTML, and using it directly in the default value can lead to parsing errors.

To overcome this, you can use HTML entity encoding for the double quote character, which is represented by `&quot;`. So, instead of directly writing the CPA like this: `:animals="arr:["cat","dog"]"`, which is invalid due to the unencoded double quote, you would use URI encoding like this: `:animals="arr:[&quot;cat&quot;,&quot;dog&quot;]"`.

By using HTML entity encoding, you adhere to the HTML standard and ensure that your component's default values are correctly interpreted and rendered by browsers, without any parsing issues. This practice ensures consistency and reliability in your component's behavior across different environments.

The only characters that must be encoded are:

| Character |	Entity |
| --- |	--- |
| `&` | `&amp;` |
| `<` | `&lt;` |
| `>` | `&gt;` |
| `"` | `&quot;` |
| `'` | `&#39;` |

&nbsp;

----

### Other component attributes

Besides the required `tag` attribute and CPAs the `<component>` element also supports the `shadow` attribute and the `extends` attribute.

* `shadow` - This attribute allows the developer to specify the type of shadow DOM to be used by this web component. The available options are `open`, `closed`, and `none`, with `open` being the default. If you set the value to `none`, the component will not utilize shadow DOM. [Click here to learn more about `open` and `closed` shadow DOM.](https://devdocs.io/dom/element/attachshadow)

* `extends` - This attribute allows the developer to define that this component is a customized built-in element. It consists of two parts: the element name used in customElements.define and the class name of the base component used in creating the new component. For example, `extends="p,HTMLParagraphElement"` the `p` indicates that the new component extends the built-in `<p>` element, and `HTMLParagraphElement` specifies the class name of the base component used in creating the new component. This feature provides flexibility and reusability in building web components. [Click here for more information about creating customized built-in element.](https://devdocs.io/dom/customelementregistry/define#customized_built-in_element)

---

[<< Prev](../README.md) README.md &nbsp; &nbsp; | &nbsp; &nbsp; [Next >>](./TemplateElement.md) `<template>` Element