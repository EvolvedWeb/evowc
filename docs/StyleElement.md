# `<style>` element

[<< Prev](./TemplateElemenet.md) `<template>` Element &nbsp; &nbsp; | &nbsp; &nbsp; [Next >>](./ScriptElement.md) `<script>` Element

---

In an Evo component file, the `<style>` element is used to define the component's internal CSS, which can be global or scoped to the component using Shadow DOM. The Shadow DOM is a web standard that encapsulates the component's styles, preventing them from affecting other elements in the document and ensuring isolation. This allows developers to write standard CSS rules, just like in a regular CSS file, specific to the component without interfering with other parts of the web page.

## CSS in shadow DOM

In Shadow DOM, CSS encapsulation rules are crucial to maintain the isolation and scoping of styles within web components. The primary rule in CSS for Shadow DOM is that the styles defined inside the Shadow DOM are confined to the component and do not leak outside, ensuring that they do not unintentionally affect other elements on the page.

One of the key features of Shadow DOM is that it creates a boundary between the component's DOM and the rest of the page. This means that CSS styles applied inside the Shadow DOM are only visible and accessible within the component itself, and they cannot be targeted or overridden by CSS rules from the outside.

To further enforce this encapsulation, the CSS selectors inside the Shadow DOM are automatically scoped to apply only to the component's internal elements. This prevents accidental interference with elements outside the component and avoids style collisions across different components.

However, it is essential to remember that even though the CSS inside the Shadow DOM is isolated, it can still interact with the outer DOM elements through CSS variables or custom properties. This allows for controlled communication between the component and its container, providing a way to customize the appearance of the component based on external factors.

The CSS rules in Shadow DOM are designed to ensure strict encapsulation and prevent unintended side effects on other elements in the page. By adhering to these rules, web components can maintain their autonomy, allowing for cleaner, more modular code and facilitating the seamless integration of components into various web applications.

For more information about using CSS in shadow DOM refer to the following links:

* [Using shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM)
* [How to style shadow DOM with ::part() and ::slotted()](https://ziga-petek.medium.com/styling-shadow-dom-with-part-and-slotted-bc4bc94ab56b)
* [CSS Shadow Parts](https://www.w3.org/TR/css-shadow-parts-1/)

## CSS when your component does not use shadow DOM

Evo's intelligent CSS insertion mechanism ensures that styles defined within the `<style>` element of your component are inserted appropriately, regardless of whether the component itself uses Shadow DOM or not. When a component that does not use shadow DOM is placed inside another component that does use Shadow DOM, Evo seamlessly adds the `<style>` tag to the outer component's Shadow DOM, ensuring the styles are available in the correct place.

On the other hand, if the component that does not use shadow DOM is used outside of all Shadow DOMs, Evo places the `<style>` tag directly in the `<head>` section of the HTML document. This strategy ensures that the styles are always available and apply to the component when it is used in or out of any Shadow DOM boundaries.

To enable this dynamic behavior, Evo sets the `component` attribute of the `<style>` element to the name of your component. By doing so, Evo can determine whether the component's CSS has already been loaded or not. This intelligent attribute management helps Evo maintain a consistent and efficient CSS insertion process, providing developers with a seamless and hassle-free experience when defining and using CSS within their components.

> In a future version of EVO you will be able to import external CSS files at compile time. Techincally you can already do this using the CSS `@import`, but this happens at runtime.

---

[<< Prev](./TemplateElemenet.md) `<template>` Element &nbsp; &nbsp; | &nbsp; &nbsp; [Next >>](./ScriptElement.md) `<script>` Element