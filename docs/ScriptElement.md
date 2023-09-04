# `<script>` Element

[<< Prev](./StyleElement.md) `<style>` Element &nbsp; &nbsp; | &nbsp; &nbsp; [Next >>](./ScriptRootElement.md) `<script root>` Element

---

The Web Component standard indicates that Web Components are defined as classes. This means that components are treated as first-class citizens in the JavaScript world, allowing developers to use class syntax, inheritance, and other object-oriented programming features to build components.

The class-based approach also promotes code reusability, as components can be extended and customized to create new components without duplicating code. This encourages a modular and organized structure for web applications, making it easier to maintain and scale projects.

In the `<script>` element of your component file, you include all JavaScript methods that define the behavior and functionality of your component. This code will be inserted into the generated component class as **class methods** and **class properties**. All of this code becomes an integral part of your component's logic.

It's important to understand that anything placed within this `<script>` element will be interpreted as class-level code, and all class methods must follow standard JavaScript syntax and conventions for classes.

> To avoid runtime errors, it is important not to use the `function` keyword nor fat arrow functions (=>) for your class methods. However, you can still use arrow functions __inside__ your class methods if needed. This distinction ensures that the proper scope and context are maintained for the class methods, preventing potential errors and ensuring the correct behavior of your components.

Here's an example of how to define class methods within the `<script>` element:

```html
<script>
  #click(event, data) {
    // Handle your click event here
    if (this.someCondition) {
      // Perform a specific action
    } else {
      // Do something else
    }
  }

  updatePersonName(newName) {
    // Update the person's name property
    this.personName = newName;
  }

  async #fetchData() {
    try {
      // Fetch data from an API
      const resp = await fetch('https://api.example.com/data');
      const data = await response.json();

      // Process the data and update component properties
      this.personName = data.name;
      this.personAge = data.age;
    }

    catch(error) {
      // Handle any errors
      console.error('Failed to fetch data:', error);
    };
}
</script>
```

In this example, we've included multiple class methods: `#click`, `updatePersonName`, and` #fetchData`. Each method performs a specific function, such as handling click events, updating the person's name property, and fetching data from an external API. By organizing your component's logic in this way, you can efficiently manage and extend its behavior while adhering to industry-standard best practices.

> REMEMBER: in JavaScript, any class method that begins with the `#` character is a private method, meaning it is only accessible within the context of the component's class. Private methods are not accessible from outside the class. This encapsulation ensures that the internal functionality and implementation details of the component remain hidden and protected from external interference.

## Non-CPA member variables

If you need to define other private member variables and these member variables are not intended to be bound to anything you do not need to define them as CPAs. Instead you can specify any number of private member variables by defining them in your `<script>` block and, optionally, providing a default value.

```html
<script>
  #temp;
  #second;
  #other = 10;
</script>
```

Resources:

* [Private class features](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields)

---

[<< Prev](./StyleElement.md) `<style>` Element &nbsp; &nbsp; | &nbsp; &nbsp; [Next >>](./ScriptRootElement.md) `<script root>` Element