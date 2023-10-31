<a name="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<br />
<div align="center">
  <a href="https://github.com/EvolvedWeb/evowc">
    <img src="static/img/Logo1.jpg" alt="Evo-wc logo" width="80" height="80">
  </a>

  <p align="center">
    Create lightweight, high-performance native custom elements, with minimal boilerplate.
    <br />
    <a href="https://github.com/EvolvedWeb/evowc/wiki"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://www.evowc.com/examples">View Demo</a> ·
    <a href="https://github.com/EvolvedWeb/evowc/issues">Report Bug</a> ·
    <a href="https://github.com/EvolvedWeb/evowc/issues">Request Feature</a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <!--li><a href="#acknowledgments">Acknowledgments</a></li -->
  </ol>
</details>

## About The Project

<!-- [![Product Name Screen Shot][product-screenshot]](https://example.com) -->

Evo-wc, or Evolved Web Components, is a Web Component transpiler. The developer builds simple XML files that are very similar to and HTML with only the code they need. Evo-wc trnaspiles the XMl files into a JavaScript file that contains a native Custom Element.

Evo-wc offers developers a powerful and efficient way to create web components, whether used independently or alongside existing frameworks. The generated elements are standards based and run lightning fast.  Here are several compelling reasons why someone would want to consider using Evo:

1. **Reduced Boilerplate Code:** Evo dramatically reduces the amount of boilerplate code needed to create web components. Traditional web component development often involves writing extensive code for property accessors, event handling, and templating. Evo simplifies this process, allowing developers to focus on the core functionality of their components. This efficiency can save a significant amount of development time.

2. **Native Web Components:** Evo leverages the native web component standard, which has gained widespread browser support. This means that Evo-generated components can seamlessly integrate into web applications without relying on additional libraries or frameworks. Developers can enjoy the benefits of web components' encapsulation and reusability without the complexity of custom solutions.

3. **Minimal Runtime Overhead:** One of Evo's key strengths is its ability to shift much of the work from runtime to build time. This results in minimal runtime overhead, ensuring that Evo-generated components are highly performant. Faster-loading components lead to a more responsive user experience, making Evo an excellent choice for optimizing web applications.

4. **Versatility with Existing Frameworks:** Evo is not limited to standalone use. Developers can incorporate Evo-generated components into existing web frameworks, such as React, Angular, or Vue.js. This versatility allows for gradual adoption, enabling teams to leverage Evo's benefits in specific areas of their application while maintaining compatibility with their chosen framework.

5. **Data Binding and Event Handling:** Evo simplifies data binding and event handling within components. With straightforward syntax, developers can bind component properties to elements in the template, facilitating real-time updates. Event handling is equally intuitive, using native DOM events. This streamlines communication between components and ensures seamless interactivity.

6. **Conditional Rendering and Looping:** Evo introduces conditional directives like $if and $switch for flexible and efficient conditional rendering. It also supports looping through data arrays with the $for directive. These features empower developers to create dynamic user interfaces with ease.

7. **Community and Ongoing Development:** Evo has a growing community of developers and contributors who actively support its development. Regular updates and improvements ensure that Evo remains aligned with evolving web standards and best practices.

In summary, Evo provides a developer-friendly, high-performance solution for creating web components. Whether used independently to harness the full power of native web components or integrated into existing frameworks for enhanced flexibility, Evo simplifies the development process and contributes to the creation of efficient and maintainable web applications.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

Built in Raw JavaScript using JSDocs Types.

Our build time dependancies are:

* [fast-xml-parser](fast-xml-parser-url)
* [glob](glob-url)
* [html-minifier-terser](html-minifier-terser-url)

The run-time dependancies for running the demo server:)

* [express](express-url)
* [keypress](keypress-url)
* [micromatch](micromatch-url)
* [node-watch](node-watch-url)


> None of these dependencies are used at runtime by the generated components. The only code executed at runtime consists of your transpiled components and a base class that encapsulates all the common functionality shared by all of the components. Additionally, there are optional files available specifically for the Evo router.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

This is an example of how you may give instructions on setting up your project locally. To get a local copy up and running follow these simple example steps.

### Prerequisites

To use Evo-wc you will need NodeJs installed. We recommend LTS and have tested with versions between 18 and 20.

### Installation

To install and test Evo follow the steps below. `Evo init` will create a demo server that is great for development but _is not recommended for use in production_. It also creates a simple website that uses a series of demo web components and the built in `<wc-router>` element for SPA styled routing and the `<wc-a>` to navigate between the SPA pages.

1. **Install Nodejs if needed**<br>
  Download and install from [https://nodejs.org/](https://nodejs.org/).

    There are many good sites that describe the process in details. [Look here](https://www.google.com/search?q=best+way+to+install+node+js+on+Mac,+windows+and+Linux) for more details.

2. **Create a Project Folder:**<br>
  Create a new folder for your Evo project and change directory into it. This will be the root directory for your web components. Open your terminal application and enter the following commands:

    ```sh
    # Create the new folder
    mkdir evo1

    # Go into the newly created folder
    cd evo1
    ```

3. **Install Evo:**<br>
  Begin by initializing npm and then installing Evo. In your terminal run the following commands:

    ```sh
    # Initialize the npm project
    npm init

    # Press enter multiple times until the init has finished

    # install EvoWC in your project
    npm i "https://github.com/EvolvedWeb/evowc.git#v0.7.0"
    ```

4. **Initialize Evo:**<br>
  Let Evo know ceate a demo server and where your component template and the transpiled components will be placed.
    ```sh
    # Initialize EVOWC config and copy the helper files
    npx evowc init

    # Install the added repos for the demo server
    npm i

    # Transpile the demo Evo components and start the demo server
    npm run watch
    ```

5. **Browser to the demo server at http://localhost:12345**

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

Evo template files are easy to create. It is recommended that you create HTML files for your code because editors handle them better than XML files.

To create a new component you add a new template file into the components folder and then run `npm evowc` to transpile all of the template files.

Include the generated JavaScript file into your HTML file and add your tag into the HTML. That is it. Anything else you add will be based on the needs of your components.

You can learn more on the [Getting Started](https://www.evowc.com/get-started) page or the [Examples](https://www.evowc.com/examples) page.

You can read more about how to use Evo in the [Documentation](https://www.evowc.com/docs/intro). Or review the [Frequently Asked Questions](https://www.evowc.com/faq).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

- ☑ Release version 0.5.0
- ☑ Fix errors and enhancements for v0.6.0
  - ☑ Improve documentation.
- ☑ Release version 0.6.0
- ☑ Fix errors and enhancements for v0.7.0
  - ☑ Increase unit tests to over 40%
  - ☑ Add hot-transpile. Components will auto-transpile when changed in the Evo demo app.
  - ☑ Improve demo website.
    - ☑ Use the Evo router.
    - ☑ Add a couple demo pages.
    - ☑ Include several of the example components.
- ☑ Release version 0.7.0
- ☐ Fix all errors and enhancements for version 1.0.0
  - ☐ All docs up to date.
  - ☐ Unit tests over 60%.
  - ☐ Add hot-reload in browser.
- ☐ Release version 1.0.0

See the [open issues](https://github.com/EvolvedWeb/evowc/issues) for the current list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request.

1. Fork the Project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Create you amazing feature
4. Add unit testing _(80% or better coverage)_
5. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
6. Push to the branch (`git push origin feature/AmazingFeature`)
7. Open a Pull Request

You can also simply open an issue with the tag "enhancement".

> **Don't forget to give the project a star! Thanks again!**

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

Distributed under the MIT License. See [`LICENSE`](https://www.evowc.com/license) for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

Michael Collins:

* [Linked In](https://www.linkedin.com/in/michael-collins-92b514/)
* [The Evo Slack Workspace](https://join.slack.com/t/evo-ef36662/shared_invite/zt-23pdcq6td-~s0037B2_YN0vbHfd6G2xA)

Project Links:

* [https://github.com/EvolvedWeb/evowc](https://github.com/EvolvedWeb/evowc)
* [Documentation](https://www.evowc.com/docs/intro)
* [Examples](https://www.evowc.com/examples)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!--
## Acknowledgments

Use this space to list resources you find helpful and would like to give credit to. I've included a few of my favorites to kick things off!

* [Choose an Open Source License](https://choosealicense.com)
* [Malven's Flexbox Cheatsheet](https://flexbox.malven.co/)
* [Malven's Grid Cheatsheet](https://grid.malven.co/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
-->

<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/EvolvedWeb/evowc.svg?style=for-the-badge
[contributors-url]: https://github.com/EvolvedWeb/evowc/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/EvolvedWeb/evowc.svg?style=for-the-badge
[forks-url]: https://github.com/EvolvedWeb/evowc/network/members
[stars-shield]: https://img.shields.io/github/stars/EvolvedWeb/evowc.svg?style=for-the-badge
[stars-url]: https://github.com/EvolvedWeb/evowc/stargazers
[issues-shield]: https://img.shields.io/github/issues/EvolvedWeb/evowc.svg?style=for-the-badge
[issues-url]: https://github.com/EvolvedWeb/evowc/issues
[license-shield]: https://img.shields.io/github/license/EvolvedWeb/evowc.svg?style=for-the-badge
[license-url]: https://github.com/EvolvedWeb/evowc/blob/master/LICENSE
[product-screenshot]: images/screenshot.png
[fast-xml-parser-url]: https://www.npmjs.com/package/fast-xml-parser
[glob-url]: https://www.npmjs.com/package/glob
[html-minifier-terser-url]: https://www.npmjs.com/package/html-minifier-terser
[express-url]: https://www.npmjs.com/package/express
[keypress-url]: https://www.npmjs.com/package/keypress
[micromatch-url]: https://www.npmjs.com/package/micromatch
[node-watch-url]: https://www.npmjs.com/package/node-watch