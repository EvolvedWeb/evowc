# `<template>` Element

[<< Prev](./ComponentElemenet.md) `<component>` Element &nbsp; &nbsp; | &nbsp; &nbsp; [Next >>](./StyleElement.md) `<style>` Element

---

In Evo, the `<template>` element serves a similar purpose as the standard HTML `<template>`, but it also brings additional capabilities specific to Evo's web component transpilation process.

The Evo version of the `<template>` element allows developers to define the structure of their web components' content in a concise and readable way.

Key features of the Evo version of the `<template>` element include:

Component Templating: The `<template>` element in Evo allows developers to define the HTML structure of their custom components. This makes it easy to create reusable components with clear and well-organized content.

Binding Expressions: Evo supports data binding in the template content using binding expressions. With these expressions, developers can bind component properties to attributes, properties, events, and other parts of the template, enabling dynamic content updates based on data changes.

Conditional Rendering: Evo allows developers to use conditional expressions in the template to show or hide elements based on specific conditions. This enables developers to create flexible and interactive components.

Event Binding: Developers can use the `<template>` element to define event handlers directly in the component's template, making it convenient to attach behavior to elements without writing additional JavaScript code.

Overall, the Evo version of the `<template>` element provides a powerful way to define the structure and behavior of custom web components. It streamlines the process of creating reusable and interactive components, enhancing the developer's productivity and improving the overall user experience.

## Data Binding

Data binding in Evo is a powerful feature that simplifies and automates the process of setting properties and attributes within the component's template. By using attributes with a colon (`:`) followed by the name of the property, you establish a direct connection between the component's properties and the properties or attributes of the elements in the template. For example, if we have an image tag in the template like this: `<img :src="imageUrl" :alt="#imageAlt" />`, Evo will automatically update the `src` property of the image tag whenever the `imageUrl` property changes, and it will do the same for the `alt` attribute when the `#imageAlt` private property changes.

Evo's powerful data binding mechanism eliminates the need for manual property updates in the component's code, resulting in cleaner and more concise code. By using the names of the component CPAs in the quotes, when the setter method is called, the property is automatically updated, and these changes are seamlessly propagated throughout the template. Evo also intelligently handles properties without corresponding HTML element properties, setting the appropriate attributes instead. This streamlined data binding capability significantly benefits developers, making component development more efficient and ensuring consistent and up-to-date rendering of dynamic content.

> FYI: When using data binding within the template, you can only reference the names of public or private properties in the quotes. Unlike some other frameworks, such as Angular, you cannot execute arbitrary code inside these quotes. This restriction is important because it ensures that the data binding remains predictable and safe. By limiting the quotes to property names only, Evo maintains a clear separation between data and logic, leading to more manageable and secure code. This design choice helps prevent potential issues, improves code maintainability, and ensures a more robust and reliable data binding mechanism in Evo.

---

### One-way binding

One-way data binding provides a powerful approach that simplifies developer code and enhances the performance of data binding operations. With one-way data binding, data flows in a single direction, from the component's properties to the template. This means that any changes to the component's properties automatically update the corresponding elements in the template.

Evo's one-way data binding simplifies developer code by providing a straightforward and predictable data flow from component properties to the template. This approach not only enhances code maintainability but also improves the application's performance, delivering a smooth and efficient user experience.

One way binding can update a element's property, or an attribute. The developer can choose which to update. By doing this `<p :title="pTitle" :html="pText"></p>` the following will happen in the compiled code:

```js
set pTitle(val) {
  pEl.title = val;
}

set pText(val) {
  pEl.innerHTML = val;
}
```

To set an attribute you can use `:attr.` like this `<p :attr.cheese="#cheeseType"></p>` and the transpiled code will do something like this:

```js
set #cheeseType(val) {
  pEl.setAttribute('cheese', val);
}
```

> The above JavaScript is only to show the basics of what Evo is doing. There are other things that happen in each setter, but the binding is similar to what is shown.

Here are some examples of how Evo processes CPA binding:

 | Attribute | Code generated |
 | --- | --- |
 | `:title="val"` | `element.title = this.val` |
 | `:src="#imgSrc"` | `element.src = this.#imgSrc` |
 | `:href="#url"` | `element.href = this.#url` |
 | `:text="name"` | `element.textContext = this.name` |
 | `:html="value"` | `element.innerHTML = this.value` |
 | `:data.title="#val"` | `element.dataset.title = this.#val` |
 | <nobr>`:aria.label="val"`</nobr> | `element.ariaLabel = this.val` |
 | <nobr>`:attr.state="#state"`</nobr> | `element.setAttribute('state', this.#state)`<br/>or, if `this.#state === null`, `element.removeAttribute('state')` |

Evo will auto-convert from properties to attributes for the well defined standard HTML attributes that have no property equivelant. If you want to make it clear that you are setting the attribute the use `:attr.keyName` instead of relying on the auto-conversion.

| converted from | converted to |
| --- | --- |
| `:accept` | `accept` attribute |
| `:alt` | `alt` attribute |
| `:for` | `for` attribute |
| `:html` | `innerHTML` property |
| `:class` | `className` property |
| `:style` | `style` attribute |
| `:text` | `textContent` property |
| `:accept-charset` | _need to add_ |
| `:charset` | _need to add_ |
| `:colspan` | _need to add_ |
| `:formaction` | _need to add_ |
| `:headers` | _need to add_ |
| `:http-equiv` | _need to add_ |
| `:ismap` | _need to add_ |
| `:media` | _need to add_ |
| `:ping` | _need to add_ |
| `:rowspan` | _need to add_ |
| `:usemap` | _need to add_ |
| `:wrap` | _need to add_ |

> Enter a issue on GitHub if you run into any other problems or things that need to be changed.

---

### Two-Way Binding (:value) and (:checked)

`:value` provides two way binding for `<input>`, `<select>`, and `<textarea>` elements. For example: `<input :value="firstName" />` will 2-way bind to the component's `set firstName(val)` methods. When your code calls `set firstName(val)` then that value will be placed into the element. When the user edits the value for the element then `set firstName(val)` will be called with the new value.

2-way binding in Evo is a powerful feature that simplifies data synchronization between component properties and corresponding HTML elements. It allows you to automatically keep the data in the component and the value of an input element in sync, both ways. When you use the `:value` attribute in your component's template, Evo automatically creates 2-way binding for `input`, `select`, and `textarea` elements.

Here's how you can use 2-way binding in Evo:

In your component's template, add the `:value` attribute to the `<input>` element you want bound to a CPA. For example: `<input type="text" :value="inputValue" />` In your component class, define a corresponding CPA called `inputValue`. Now, whenever the `inputValue` property in your component changes, Evo will automatically update the `value` of the input element. And whenever the user changes the `value` of the `<input>` element, Evo will automatically update the `inputValue` property in your component. This is done by Evo auto-adding an event handler for the `input` event.

The beauty of 2-way binding in Evo lies in its simplicity. By using just a single attribute, `:value`, you can enable bidirectional data binding without writing additional event listeners or handlers. It's a seamless and intuitive way to keep your component's data and the user interface in sync, saving you time and effort in your development process.

Additionally, Evo also allows you to add your event handler for the `input` event. This ensures that if you want to provide your own custom logic for handling the `input` event, it will be smoothly integrated with the existing 2-way binding functionality. Your `input` event handler is called after the `value` has been updated.

Overall, 2-way binding in Evo provides a native and standards-based approach to data synchronization, making it a user-friendly and efficient tool for developing dynamic and responsive web components.

We will soon allow 2-way binding for checkboxes and radio buttons by using the `:checked` attribute. (More to come soon. As of 2023-07-23 the `:checked` property has not been added.)

> **Future update:** We will add support for 2-way binding of the `currentTime` property of the `<audio>` and `<video>` elements. If you know of other values that would be good candidates for built in 2-way binding, please create an enhancment request in the GitHub issues. We may also add support the `<select>` property `selectedIndex`.

## Pipes

Evo pipes are a powerful and flexible feature that allow developers to transform data as it is bound to the template. Pipes provide a way to alter the displayed values of component properties without modifying the original data. These pipes can be particularly useful when dealing with date formatting, currency formatting, or any other custom transformation requirements. With Evo pipes, developers can easily customize how data is presented to users, enhancing the user experience and making the application more user-friendly.

One of the key benefits of Evo pipes is their ability to accept formatting parameters through the dataset object. This allows developers to pass additional information to the pipe method, making it dynamic and adaptable. For instance, if a developer wants to format a date, they can use a dataset attribute like `data-date-format` to specify the desired date format. The pipe method will then receive the date value and the dataset object, enabling it to access and utilize the specified date format from the dataset.

Here's an example of using a custom pipe for date formatting with a provided date format through the dataset:

```html
<component tag="date-formatter">
  <template>
    <p>Date in custom format: <span data-locale="fr" :text="date|^formatDate"></span></p>
  </template>
  <script>
    #formatDate(date, dataset) {
      const locale = dataset.locale || 'en-US'; // Default locale if not provided
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Intl.DateTimeFormat(locale, options).format(date);
    }
  </script>
</component>
```

In this example, the `date` property is transformed using the private `#formatDate` pipe method. The pipe accesses the `data-locale` attribute from the dataset to determine the desired date locale. If the attribute is not provided, it uses the default locale `'en-US'`. Developers can easily change the date locale by setting the `data-locale` attribute to any valid locale string.

Evo pipes can also use external functions by importing them from separate files. This provides modularity and reusability, allowing developers to organize their pipes more effectively. For instance, an external pipe file named `my-pipes.js` may contain the following pipe:

```js
export function toUpper(value) {
  return value.toUpperCase();
}
```

To use this external pipe in a component, developers can import it and use it like this:

```html
<script root>
 import { toUpper } from "../my-pipes.js";
</script>

<component tag="example">
  <template>
    <p>Upper-cased name: <span :text="name|^toUpper"></span></p>
  </template>
</component>
```

> External pipes receive the same two arguments.

By combining the flexibility of passing formatting parameters through the dataset and supporting both internal and external pipes, Evo empowers developers to handle a wide range of data transformations efficiently and maintainably. This feature ensures a cleaner and more organized codebase while promoting code reusability and improved developer productivity.

Adhering to standards and using simple pipe functions offers numerous benefits for developers. It ensures code consistency, facilitates reusability, easy testability, and promotes compatibility with Evo and other frameworks. Simplicity and standardization streamline development, resulting in a cleaner and more maintainable codebase.

### Dataset

The HTML dataset is a feature that allows developers to store custom data attributes directly on HTML elements like this `<p data-locale="en">`. It provides a way to attach additional information to elements without using standard attributes. The dataset object can be accessed in JavaScript and is particularly useful when developers need to store data associated with specific elements for later reference or manipulation. It can be used in any regular HTML project and provides a straightforward mechanism to add metadata to elements that is not interpreted by the browser but is accessible through the DOM for custom scripting purposes.

Evo provides a clean mechanism for binding CPAs to data attributes. When defining a custom attribute in the component's template file like this: `:data.dog-food="varName"`, Evo will automatically set the corresponding property in the `element.dataset` object. For example, `element.dataset.dogFood` will be set every time the setter for `varName` is called.

```html
<component tag="my-el" :locale>
  <template>
    <p :data.local="locale">Current locale: <span :text="locale"></span></p>
  </template>
</component>
```

In the previous code snippet the `data-locale` attribute will be bound to the `locale` CPA.

This approach ensures that the component's data attributes are kept in sync with its properties, making it easy to pass and retrieve data from the component's event handlers. By using data attributes for passing necessary data to an event handler, developers can create more modular and maintainable code.

Setting data attributes with absolute values allows developers to provide fixed values directly in the template, without binding them to CPAs. These absolute data attributes are useful when the data does not need to be dynamically updated based on component properties or attributes. By setting absolute values, developers can efficiently define default data attributes or provide static data that doesn't change during the component's lifecycle. This approach improves performance and simplifies the code, especially when the data attributes are not meant to be modified dynamically. By combining absolute data attributes with CPAs, developers have the flexibility to choose the most suitable approach for each specific use case, ensuring a well-organized and efficient component structure.

In the example below, we have a component that displays the current locale and three buttons with different data attributes representing different languages. When a button is clicked, the #handleLocale event handler is called, and the component's #locale property is updated accordingly.

```html
<component tag="my-el" :#locale>
  <template>
    <p>Current locale is <span :text="#locale"></span></p>
    <button data-locale="en" .click="#handleLocale">EN</button>
    <button data-locale="ja" .click="#handleLocale">JS</button>
    <button data-locale="ru" .click="#handleLocale">RU</button>
  </template>
  <script>
    #handleLocale(event, data) {
      this.#locale = data.locale;
    }
  </script>
</component>
```

With this approach, the data-locale attributes on the buttons are used to pass the corresponding locale data to the event handler, allowing the component to respond dynamically based on the user's selection. This ensures a clean separation between the component's logic and data representation, following the best practices for web development.

### Aria - (Add to template)

## Events

Evo events are discussed in the [Events.md](./Events.md) file.

## Conditionals

Conditional DOM is discussed in the [Conditionals.md](./Conditionals.md) file.

## Main features of the Evo `<template>` element

* **Data Binding:** The template allows data binding between the component's properties and the HTML elements within the template. This enables automatic updates to the DOM when component properties change, reducing the need for manual updates.

* **Pipe Function Support:** Evo templates support pipe functions that allow developers to modify and format data before presenting it in the HTML. Pipes are simple functions that can be applied to property values in the template, enhancing data presentation.

* **Event Handling:** Developers can attach event handlers directly to elements within the template using the .event notation. This enables seamless interaction between the template and the component's methods.

* **Dynamic Content:** The template supports dynamic content rendering, making it easy to display different data based on the component's state or user interactions.

* **Integration with Shadow DOM:** Evo templates integrate well with Shadow DOM, offering encapsulation and style isolation for components.

* **Ease of Use:** The template syntax is designed to be intuitive and developer-friendly, making it easy to create and manage complex component structures.

* **Compatibility:** Evo templates adhere to HTML standards, ensuring that the transpiled components are compatibile with other libraries and frameworks.

Overall, the `<template>` element in Evo empowers developers to create dynamic and interactive web components with concise and straightforward syntax.

---

[<< Prev](./ComponentElemenet.md) `<component>` Element &nbsp; &nbsp; | &nbsp; &nbsp; [Next >>](./StyleElement.md) `<style>` Element