# `<script root>` Element

[<< Prev](./SciptElement.md) `<script>` Element &nbsp; &nbsp; | &nbsp; &nbsp; [Next >>](./Events.md) Events

---

The `<script root>` element allows developers to define code outside the scope of the component class. It serves as a place to include imports or code that is needed for the component but doesn't need to be part of the class. All the code placed within the `<script root>` element is included at the top of the generated JavaScript file, just after the line that includes the default imports. This feature provides a clean and organized way to include additional code without cluttering the component class, making it easier for developers to manage and maintain their codebase. Additionally, it allows developers to keep the component class focused on its core functionality while still being able to access necessary external resources or code.

For example:

```html
<script root>
  import { DIALOG_BUTTONS } from './WcDialogElement.js';
  export const sleep = (time) => new Promise((resolve) => setTimeout(() => {resolve()}, time));
  window.doSomething = (message) => {
    // Place your code here
  }
</script>
```

In the above code snippet, we see an `import` statement for the `DIALOG_BUTTONS` constant from the file `WcDialogElement.js`. Additionally, there is an exported function, `sleep` that can be imported into othere files. We also set a global function `doSomething`, that will be available for use globally once the component is transpiled and loaded.

By leveraging the `<script root>` element, developers can neatly organize their external imports and global functions, ensuring they are easily accessible when needed, without affecting the structure and readability of the component class itself.

---

[<< Prev](./SciptElement.md) `<script>` Element &nbsp; &nbsp; | &nbsp; &nbsp; [Next >>](./Events.md) Events
