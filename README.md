# Evo-WC

Evo-WC, also known as Evo, is a web component transpiler designed to simplify the creation of native Web Components with minimal code. It compiles a user-created template file based on HTML/XML into a raw JavaScript Web Component file, relying solely on raw browser JavaScript and the base class `EvoElement`, without the need for additional runtime frameworks or libraries.

<div style="background:#311;border:3px dashed #900;margin:20px;padding:10px;color:#FFF">

## BETA Testing

Welcome to the beta version of our repository! We appreciate your participation and feedback in helping us improve Evo-WC. Below are some guidelines and rules to ensure a smooth experience:

1. **Installation:** Begin by installing the repository using `npm install`.
1. **Transpiling Components:** To transpile the components, run `npm run build` in one terminal.
1. **Launching Web Server:** Use `npm start` in another terminal to start the simple web server.
1. **Viewing the Webpage:** Access the webpage by browsing to `http://localhost:5555/test.html`.
1. **Customizing Components:** You can modify the components displayed in the browser by editing the `static/test.html` file.
1. **Bug Reporting:** For bug reports, please utilize the issues section in the repository.
1. **Document Suggestions:** Any suggestions for documentation improvements should also be added to the issues section of the repo.
1. **Component Testing:** We encourage you to create several components and thoroughly test Evo for any errors in the transpiler.
1. **Explore and Push Boundaries:** Feel free to experiment and push the boundaries with your components. Test Evo's capabilities in various scenarios.
1. **Looping Limitation:** Currently, looping through tags is not supported for auto-generation of tables, list items, etc. We are working on adding this functionality in the future.
1. **Contributions:** If you've created example components or bug fixes, please submit a Pull Request to share your work with the community.
1. **Branch Management:** Remember not to check into the master branch. We prefer that you work in separate branches to keep the master branch clean.

Your valuable contributions and insights will play a crucial role in the development of Evo-WC. Thank you for being part of our beta testing program! If you have any questions or need assistance, feel free to reach out to us. Happy coding!

</div>

## Introduction to Evo

Traditional Web Components often involve writing a substantial amount of boilerplate code, which can be cumbersome for developers. However, with Evo, you only need to write the necessary HTML, CSS and JavaScript code within a template file. In the HTML you can easily bind variables to attributes, properties, events, and more.

Unlike most frameworks that use interpolation syntax like `<h3>Current customer: {{currentCustomer}}</h3>`, Evo opts for a different approach. You would add a `<span>` element within the `<h3>` to achieve a similar binding effect. `<h3>Current customer: <span :text="currentCustomer"></span></h3>`. Or, You can combine the entire string into a private CPA, say `#welcome`, and then set the `textContent` or `innerHTML` of an element like `<h3 :text="#welcome"></h3>` and `<h3 :html="#welcome"></h3>`, respectively.

Example using a `<span>`:

```html
<component tag="my-example" :customer>
  <template>
    <h3>Current customer: <span :text="customer"></span></h3>
  </template>
</component>
```

Example using a private CPA:

```html
<component tag="my-example" :customer :#welcome>
  <template>
    <h3 :text="#welcome"></h3>
  </template>
  <script>
    update(property) {
      if (property === 'customer') {
        this.#welcome = `Current customer: ${this.customer}`;
      }
    }
  </script>
</component>
```

As you can see from the two example, using a `<span>` takes less code from the developer and happens automatically. Using a private CPA requires using the `update()` member function to set the private CPA each time the `customer` CPA changes.

### User interactions and Events

Evo efficiently manages user interactions by utilizing standard HTML events and JavaScript custom events. To implement event handling, a developer simply adds an event handler within the `<script>` section and pairs it with the corresponding event attribute in an HTML element.

```html
<component tag="my-example">
  <template>
    <button .click="#showMessage">Click Me</button>
  </template>
  <script>
    #showMessage(event, data) {
      alert('The button was clicked');
    }
  </script>
</component>
```

In this example, we have a custom component named "my-example" that includes a `<button>` element with a .click event attribute. This attribute is bound to the #showMessage event handler defined in the `<script>` section.

When the user clicks on the "Click Me" button, the event is triggered, and Evo calls the associated `#showMessage` event handler. In this example, an alert with the message "The button was clicked" will show.

By using this straightforward approach, Evo simplifies event management and enables developers to easily handle user interactions in their web components.

Evo's primary goals are to leverage HTML, CSS, and JavaScript standards, simplify developer workflows, enhance performance, and reduce memory consumption. It adheres to native HTML and JavaScript rules and patterns, avoiding unnecessary complexities present in many existing frameworks. Unlike other frameworks that may force extensive amounts of code to interact with the framework itself, Evo encourages developers to write only what is necessary for their components. With Evo you only write what you need.

To help developers get started, Evo provides a variety of sample components in the components folder. These files use the HTML file extension to ensure proper support in most editors, with helpful syntax highlighting in `<script>` and `<style>` tags. By exploring these examples and referring to the documentation, developers can easily create their own custom components.

## The Component Template File

The component template file is an XML file that defines the structure and behavior of your web component. For optimal results in your editor, such as VS Code, it's recommended to use the .html file extension for your component file.

To create a web component, you begin by defining it with a `<component>` element. This element serves as the starting point for your component's structure and behavior. Within the `<component>` element, you must include the `tag="component-name"` attribute, which provides a unique name for your component. This name will be used to represent your component when you add it to your HTML using the custom element syntax: `<component-name></component-name>`.

Inside the `<component>` element, you can use the following valid elements:

* `<template>`: This element holds the HTML markup for your component. It defines the visual appearance and structure of the component.

* `<style>`: This element contains the CSS rules that apply only to this specific component. This allows for encapsulated and scoped styling using Shadow DOM.

* `<script>`: This element houses custom JavaScript code specific to the component. Here, you can define event handlers, manipulate data, and add other necessary logic for the component's functionality. This code will be incorporated into the generated class, so it should be written as if it were already part of a class, including class properties and methods.

* `<script root>`: This element is used to list necessary imports at the top of the generated JavaScript file. This helps manage dependencies and ensures the required modules are available for the component. You also include anything that is not part of the compiled class in this element.

---
### `<component>` Element

[The `<component>` element](./docs/ComponentElemenet.md) is a fundamental building block in Evo for defining custom web components. It serves as the container for all component-related definitions, including the component's template, styles, and custom JavaScript code.

---
### `<template>` Element

The Evo [`<template>` element](./docs/TemplateElement.md) serves as a concise and readable way to define the structure and behavior of your custom web components. It enables developers to create reusable components with data binding, conditional rendering, and event handling directly within the template.

---
### `<style>` Element

The [`<style>` element](./docs/StyleElement.md) in Evo is used to define the component's internal CSS, supporting scoped styles within the component's Shadow DOM or globally scoped when not using the shadow DOM.

---
### `<script>` Element

The [`<script>` element](./docs/ScriptElement.md) in Evo serves as the container for writing JavaScript code that defines the component's behavior and logic. It allows developers to create class methods and define lifecycle functions, enabling seamless interaction with the component's properties, attributes, and events.

## `<script root>` Element

The [`<script root>` element](./docs/ScriptRootElement.md) in an Evo component file serves as a container for any imports or code that should be included at the top of the generated JavaScript file.


## Properties and Attributes

## Events

### Click event handler example

Here is an example component that has a CPA called `message`. Whenever the `message` attribute on this component is set or when the `message` property is set then the text of the `<h1>` tag will be set to that value.

#### Example:

Component definition:

```xml
<component tag="my-message" :message>
  <template>
    <h1 :text="message"></h1>
  </template>
</component>
```

Here is an example of HTML that uses the component:

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


## Conditionals
## Router Component (if applicable)
## Exported Class and Functions from EvoElement.js File
## Lifecycle methods

You can enhance the behavior of your component by providing lifecycle functions in your script, which will be called at specific stages during the component's lifecycle.

| Method | Description |
| --- | --- |
| init() | Called at the end of the constructor. This function allows you to perform additional setup or initialization steps for your component. Any code in this function must follow all of the [requirements for custom element constructors](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-element-conformance). |
| update(property, oldVal, newVal) | Called every time any property is updated, as well as when the component is connected to the DOM. You can use this function to adjust any private properties based on the changes in the component's properties. It is also called when the component is reconnected to the DOM after being previously disconnected. The property parameter provides the name of the member property that was updated just before calling this function. |
| connected() | This function is called by the base class connectedCallback function, which is part of the web component's lifecycle. It is invoked when the component is connected to the DOM. You can use this function to perform actions that need to happen when the component is added to the page's DOM structure. |
| disconnected() | This function is called by the base class disconnectedCallback function, which is part of the web component's lifecycle. It is invoked when the component is removed from the DOM. You can use this function to perform any cleanup or actions required when the component is no longer part of the page's DOM structure. |
| adopted() | This function is called by the base class adoptedCallback function, which is part of the web component's lifecycle. It is invoked when the component is moved to a new document. You can use this function to handle any specific actions required when the component is moved between documents. |
| attrChanged(attr, oldVal, newVal) | This function is called when an attribute has changed, and it is called by the base class attributeChangedCallback function, which is part of the web component's lifecycle. You can use this function to respond to attribute changes and update the component's behavior accordingly. |

By using these lifecycle functions, you can control and manage various aspects of your component's behavior throughout its existence, making your components more dynamic and responsive to changes in the DOM and attribute values.

## Base Class File EvoElement.js
## Compile Options

```json
  "evo": {
    "wc": {
      "output": "static/js",
      "outExtname": ".ts",
      "minify": {
        "css": true,
        "html": true
      }
    }
  },
```

More information soon

## Integration with TypeScript

Evo is designed to work seamlessly without requiring TypeScript. While you have the option to use TypeScript if you prefer, all of our example components are written in raw JavaScript. The generated files include extensive typing information using JSDocs. Most code editors interpret this typing information similar to TypeScript, but the advantage is that the transpiled code can be directly loaded into the browser without additional compilation steps.

If you choose to write your code in the `<script>` tag as TypeScript, you would need Evo to transpile it first before processing it with TypeScript.

> As of August 2023, we have not extensively tested TypeScript integration, and there might be some potential issues. If you encounter any problems, we encourage you to create a Github issue and provide your sample code along with the version of TypeScript you are using and the error message that was generated. This will help us improve and address any potential TypeScript-related issues for a better developer experience.

## VSCode Enhancements

### HTML Snippet

HTML Snippet to generate a skeleton of a template:

```json
  "evowc": {
    "prefix": "evowc",
    "body": [
      "<component tag=\"${1:tag-name}\">",
      "  <template>",
      "    $0",
      "  </template>",
      "  <style>",
      "  </style>",
      "  <script root>",
      "  </script>",
      "  <script>",
      "  </script>",
      "</component>"
    ]
  }
```

### JavaScript Snipper

JavaScript snippet for several evo repated class member functions:

```json
  "evo init function": {
    "prefix": "evoinit",
    "body": [
      "${1:// Called at the end of the constructor",
      "}init() {",
      "  $0",
      "}"
    ]
  },
  "evo update function": {
    "prefix": "evoupdate",
    "body": [
      "${1:// Called after any CPA value is changed",
      "}update(property, oldVal, newVal) {",
      "  $0",
      "}"
    ]
  },
  "evo event handler function": {
    "prefix": "evoevent",
    "body": [
      "${1:// ${2:click} event handler for ${3:save button}",
      "}${4:#functionName}(${5:event, data}) {",
      "  $0",
      "}"
    ]
  }
```

## ATOM enhancements

> The following were converted from the VS Code snippets using chatGPT. If someone can validate that these are valid and let me know.

### HTML Snippet

HTML Snippet to generate a skeleton of a template:

```cson
'.text.html.basic':
  'evowc':
    'prefix': 'evowc'
    'body': """
      <component tag="${1:tag-name}">
        <template>
          $0
        </template>
        <style>
        </style>
        <script root>
        </script>
        <script>
        </script>
      </component>
    """
```

### JavaScript Snipper

JavaScript snippet for several evo repated class member functions:

```json
'.source.js':
  'evo init function':
    'prefix': 'evoinit'
    'body': """
      ${1:// Called at the end of the constructor
      }init() {
        $0
      }
    """

  'evo update function':
    'prefix': 'evoupdate'
    'body': """
      ${1:// Called after any CPA value is changed
      }update(key, oldVal, newVal) {
        $0
      }
    """

  'evo event handler function':
    'prefix': 'evoevent'
    'body': """
      // ${1:click} event handler for ${2:save button}
      ${3:#functionName}(${4:event, data}) {
        $0
      }
    """
```

If anyone can convert these snippets to work in other editors, please do and submit a pull request on this file.

## Reference

Comming soon