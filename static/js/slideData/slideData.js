export const SLIDES = [
  {
    heading: "Who am I?",
    sub: "Michael (Mike) Collins",
    content: `<ul>
          <li>I started coding on a TRS-80 Model 1 around 1978 in Junior High.</li>
          <li>I started coding professionally in 1981 and have coded in more than 7 assembly languages and 10 higher-level languages. <cy>I prefer JavaScript.</cy></li>
          <li>I wrote firmware for an <cp>undersea welding system</cp> in 83 &amp; a <cp>Basic compiler</cp> in 85.</li>
          <li>I wrote my first HTML for <cp>Netscape Navigator</cp> and <cp>IE3</cp>.</li>
          <li>I've worked for <cp>Software Toolworks</cp>, <cp>Brøderbund</cp>, <cp>Intel</cp>, <cp>FamilySearch</cp>, and many other companies.</li>
          <li>I currently work at <cp>Software Technology Group</cp> as a Senior developer.</li>
          <li>I have used most modern frameworks and still prefer writing in <cy>Vanilla JS</cy>.</li>
          <li><cy>I believe that, as a Senior Developer and architect, I need to make things easier, faster and smaller for both the end user and web developers.</cy></li>
          </ul>`
  },
  {
    heading: "Web Frameworks & Libraries",
    sub: "What do you use?",
    content: `<div class="fpimage" style="background-image: url('/img/Front-End-Frameworks.png')"></div>`
  },
  {
    heading: "Web Frameworks & Libraries",
    sub: "Trying to solve the hard things.",
    content: `<ul>
            <li>JavaScript before jQuery was extremely complicated with few standards.</li>
            <li>Frameworks &amp; libraries are designed to solve the hard things in web development.</li>
            <li>Often they do this at a steep cost.
              <ul>
              <li><cp>Complicated</cp> rules.</li>
              <li><cp>Non-standard</cp> terminology and technology.</li>
              <li><b>You often have to write code <cp>for the framework’s sake</cp>.</b></li>
              <li>Slow, complicated runtime engines that are <cp>hard to debug</cp>.</li>
              <li>They often go counter to the <cp>rule of least power</cp>.</li>
              </ul>
            </li>
            <li>The biggest cost is <cp>rewriting everything</cp> for the next shiny framework.</li>
            </ul>`
  },
  {
    heading: "Web Components",
    sub: "Have you heard of them?",
    content: `<div class="wclogo">
              <img src="/img/wclogo.svg" />
            </div>
            <div class="html5">
              <img src="/img/html5.png" />
              <h3>&lt;template>&lt;/template></h3>
              <h3>ES6 Modules</h3>
              <h3>Shadow DOM</h3>
            </div>
            <ul>
            </ul>`
  },
  {
    heading: "Web Components",
    sub: "So much promise & so hard to create.",
    content: `<ul>
            <li>The Web Component Specification was introduces in 2011.</li>
            <li>Version 0 and then Version 1 specification.</li>
            <li>By 2019 all new browsers supported the V1 (current) specification.</li>
            <li>Custom component written in HTML, CSS, and a JS Class</li>
            <li>Shadow DOM</li>
            <li>Web components can be difficult to write due to all of the boilerplate code.</li>
            <li>The code for native components can be large and complicated.</li>
            <li>It can be hard to act like a native element without a lot more boilerplate.</li>
            <li>There is no simple native data binding or event binding.</li>
            <li>Most built-in components use shadow DOM</li>
            </ul>`
  },
  {
    heading: "Web Components - Shadow DOM",
    sub: "<video> element shadow DOM",
    content: `<div class="fpimage" style="background-image: url('/img/shadowDOM.jpg')"></div>`
  },
  {
    heading: "Minimal Web Component",
    sub: "",
    content: `<code><pre style="font-size: 2.7rem">
class MinimalComponent extends HTMLElement {
&nbsp;&nbsp;connectedCallback() {
&nbsp;&nbsp;&nbsp;&nbsp;this.innerHTML = '&lt;style>h1 {color: blue;}&lt;/style>&lt;h1>Hello&lt;/h1>';
&nbsp;&nbsp;}
}
customElements.define('minimal-component', MinimalComponent);
<br/>
<br/>
class ShadowComponent extends HTMLElement {
&nbsp;&nbsp;constructor() {
&nbsp;&nbsp;&nbsp;&nbsp;super();
&nbsp;&nbsp;&nbsp;&nbsp;const sRoot = this.attachShadow({ mode: 'open' });
&nbsp;&nbsp;&nbsp;&nbsp;sRoot.innerHTML = '&lt;style>h1 {color: blue;}&lt;/style>&lt;h1>Hello&lt;/h1>';
&nbsp;&nbsp;}
}
customElements.define('shadow-component', ShadowComponent);
</pre></code>`
  },
  /*
  {
    example: true,
    header: 'Example Component',
    content: `<div class="left-right">
      <example-1></example-1>
      <code><pre>&lt;component tag="example-1"
&nbsp;&nbsp;:#message="str:Hello World"
&nbsp;&nbsp;shadow="none">
&nbsp;&nbsp;&lt;template>
&nbsp;&nbsp;&nbsp;&nbsp;&amp;lt;h3&amp;gt;&lt;h3>H3 Before Component&lt;/h3>&amp;lt;/h3&amp;gt;&lt;br/>
&nbsp;&nbsp;&nbsp;&nbsp;&amp;lt;minimal-component&amp;gt;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;minimal-component>&lt;/minimal-component>
&nbsp;&nbsp;&nbsp;&nbsp;&amp;lt;/minimal-component&amp;gt;&lt;br />
&nbsp;&nbsp;&nbsp;&nbsp;&amp;lt;h3&amp;gt;&lt;h3>H3 AfterComponent&lt;/h3>&amp;lt;/h3&amp;gt;
&nbsp;&nbsp;&lt;/template>
&nbsp;&nbsp;&lt;script root>
&nbsp;&nbsp;&nbsp;&nbsp;class MinimalComponent extends HTMLElement {
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;connectedCallback() {
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;this.innerHTML =
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'&lt;'+'style>h3 {color: blue;font-size:5rem;margin:0}&lt;'+
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'/style>&lt;h3>H3 inside&lt;/h3>';
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}
&nbsp;&nbsp;&nbsp;&nbsp;}
 
&nbsp;&nbsp;&nbsp;&nbsp;customElements.define('minimal-component',
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MinimalComponent);
&nbsp;&nbsp;&lt;/script>
&lt;/component></pre></code>
    </div>`
  },
  */
  {
    heading: "WC Projects/ Frameworks",
    sub: "They are many. They are legion.",
    content: `<p>Most add as much complexity as they solve.</p><ul>
      <li><cp>Polymer</cp> was designed to bridge the gap between V0 spec, V1 spec and browsers with no support. It was supposed to fade away as the spec was adopted.</li>
      <li>Others are:<ul>
        <li><cp>Lightning Web Components</cp></li>
        <li><cp>Slim.Js</cp></li>
        <li><cp>Stencil</cp> - <span class="smaller">Also a compiler</span></li>
        <li><cp>LitElement</cp>.</li>
        </ul>
      </li>
      <li><cp>BayJS</cp> is one of the newest and was some of the inspiration for <cy>Evo</cy>.</li>
      <li>These systems all have their pros and cons but they perform all of their work at runtime in the browser.</li>
      <li><cy>I started writing Evo towards the end of January 2023</cy></li>
    </ul>`
  },
  {
    heading: "Evo Web Components",
    sub: "Write what you need and compile.",
    content: `<ul>
      <li>Evo is planned to be a series of features. Evo-wc is the first part.</li>
      <li>The main objectives with Evo are:<ul>
        <li>To be very easy for developers: <cy>Write only what you need</cy>.</li>
        <li>To be <cp>standards based</cp> (everywhere possible).</li>
        <li>To <cp>remove boilerplate</cp> as much as possible.</li>
        <li>To provide <cp>Data Binding</cp>, <cp>Event Binding</cp>, and <cp>Conditional Directives</cp>.</li>
        <li>To be a <cp>very fast</cp> and <cp>very small</cp> runtime.</li>
        <li>To use <cp>minimal memory</cp>, <cp>CPU</cp>, and <cp>battery</cp>.</li>
        <li>To move as much work as possible to <cp>compile time</cp>.</li>
        <li>To be and stay <cp>really light weight</cp>.</li>
        </ul>
      </li>
    </ul>`
  },
  {
    heading: "Minimal EVO Web Component",
    sub: "Betcha you can't write just one...",
    content: `<p>Create a component template file (HTML file is easiest)<br/>
  Add a <cp><code>&lt;component></code></cp> element.<br/>
  Set the <cp>tag</cp> attribute to the desired element name.<br/>
  Add <cp><code>&lt;template></code></cp> for HTML, <cp><code>&lt;style></code></cp> for CSS, and <cp><code>&lt;script></code></cp> for JS.</p>
  <code><pre>&lt;component tag="mini-mum">
&nbsp;&nbsp;&lt;template>
&nbsp;&nbsp;&nbsp;&nbsp;&lt;h3>Hello World&lt;/h3>
&nbsp;&nbsp;&lt;/template>
&nbsp;&nbsp;&lt;style>
&nbsp;&nbsp;&nbsp;&nbsp;h3{color:red;font-size:7rem;}
&nbsp;&nbsp;&lt;/style>
&lt;/component></pre></code>`
  },
  {
    example: true,
    content: `<div class="left-right"><div><example-2></example-2><hr/><h2><cy>Source:</cy></h2><code><pre>&lt;component tag="mini-mum">
&nbsp;&nbsp;&lt;template>
&nbsp;&nbsp;&nbsp;&nbsp;&lt;h3>Hello World&lt;/h3>
&nbsp;&nbsp;&lt;/template>
&nbsp;&nbsp;&lt;style>
&nbsp;&nbsp;&nbsp;&nbsp;h3 {
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;color: red;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;font-size: 7rem;
&nbsp;&nbsp;&nbsp;&nbsp;}
&nbsp;&nbsp;&lt;/style>
&lt;/component></pre></code></div>
  <div>
    <h2 style="font-size:4rem;margin-top:0"><cy>Example compiled code:</cy></h2>
    <code><pre>import { EvoElement } from '../EvoElement.js';
export const componentName = 'MiniMumElement';
export const tagName = 'mini-mum';

const template = \`&lt;h3>Hello world!</h3>\`;
const styles = \`h3{color:red;font-size:7rem}\`;

export class MiniMumElement extends EvoElement() {
&nbsp;&nbsp;&nbsp;&nbsp;constructor() {
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;super();
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;this.createDom({template,styles,componentName});
&nbsp;&nbsp;&nbsp;&nbsp;}

&nbsp;&nbsp;&nbsp;&nbsp;get _buildDate() {
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return new Date('2023-11-22T13:43:21.122Z');
&nbsp;&nbsp;&nbsp;&nbsp;}

&nbsp;&nbsp;&nbsp;&nbsp;get _buildVersion() {
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return '1.0.1';
&nbsp;&nbsp;&nbsp;&nbsp;}
}

customElements.define(tagName, MiniMumElement);</pre></code></div></div>`
  },
  {
    heading: "EVO: Setup",
    sub: "Just in case you might want to use it.",
    content: `<ul>
      <li>Evo was made public by the end of August. (v0.5.0)</li>
      <li>Evo is currently (March 2024) on version 1.1.1</li>
      <li>You can:
        <ul>
      <li>Install Evo from NPM</li>
      <li>Copy base class file & router file to your static JS folder</li>
      <li>Create a folder for your template files & add/write your template files</li>
      <li>Add a single entry in your package.json file to build the components<br/><cp><code>"build": "evowc components/*.html -o src/js/components"</code></cp></li>
      <li>Import your components into your HTML page</li>
        </ul>
      </li>
      <li><cy>If you are interested, help can be provided over Utah-JS Slack.</cy></li>
      <li>Evo can also create a sample app for your evaluation and experimentation.</li>
      <li>For more info: <wc-a href="https://www.evowc.com/get-started" show-ext="1">Getting Started Page</wc-a>.</li>
      </ul>`
  },
  {
    heading: "Evo: Parts of a component file",
    sub: "Simple XML/HTML file.",
    content: `<ul>
      <li>Evo components are defined as XML that closely resembles HTML.</li>
      <li>Start off by using the <cp>&lt;component></cp> element.</li>
      <li>Add the attribute <cp>tag</cp> into <cp>&lt;component></cp>.</li>
      <li>Inside <cp>&lt;component></cp> the following elements are used:
        <ul>
        <li><cp>&lt;template>&lt;/template></cp> - Your HTML goes here</li>
        <li><cp>&lt;style>&lt;/style></cp> - Your CSS goes here</li>
        <li><cp>&lt;script>&lt;/script></cp> - Class methods and properties go here.</li>
        <li><cp>&lt;script <cc>root</cc>>&lt;/script></cp> - Code here will be placed at the top of the file</li>
        </ul>
      </li>
      <li>I use the .html file extension since editors support those better.</li>
      <li>I am working on a VSCode plugin that will better support any differences in the Evo files.</li>
      </ul>`
  },
  {
    heading: "Evo: CPAs",
    sub: "Component Property Attributes.",
    content: `<ul>
      <li>Developers define Component Properties as attributes in the <cp><code>&lt;component></code></cp> tag.</li>
      <li>You add attributes to the <cp><code>&lt;component></code></cp> tag to define a CPA, its data type and default value. CPAs default to an empty string.</li>
      <li>CPAs are transpiled into the properties and attributes of your custom element.</li>
      <li>CPAs are used for data binding in the template.</li>
      </ul>
      <code><pre>&lt;component tag="my-el" :message="str:Hello Evo" >
&nbsp;&nbsp;&lt;template>
&nbsp;&nbsp;&nbsp;&nbsp;&lt;h1 :text="message">&lt;/h1>
&nbsp;&nbsp;&lt;/template>
&lt;/component></pre></code>
Usage:
<code><pre>&lt;my-el message="Hi everyone">&lt;/my-el></pre></code>`
  },
  /*
  {
    heading: "Evo: CPAs",
    sub: "Component Property Attributes.",
    content: `
<code><pre>&lt;my-el message="Hi everyone">&lt;/my-el></pre></code>
<my-el message="Hi everyone"></my-el>
<code><pre>&lt;my-el message="Hello World">&lt;/my-el></pre></code>
<my-el message="Hello World"></my-el>
<code><pre>&lt;my-el message="Evo makes Web Components easier.">&lt;/my-el></pre></code>
<my-el message="Evo makes Web Components easier."></my-el>
`
  },*/
  {
    heading: "Evo: Defining CPAs",
    sub: "Supported data types and private values.",
    content: `<ul>
      <li>CPAs are defined using kebab-case.</li>
      <li>Evo supports most standard data types for its CPAs</li>
      <li class="li-table">
        <cell><cp>string</cp> / <cp>str</cp></cell>
        <cell><cp>boolean</cp> / <cp>bool</cp></cell>
        <cell><cp>number</cp> / <cp>num</cp>,</cell>
        <cell><cp>integer</cp> / <cp>int</cp></cell>
        <cell><cp>bigint</cp></cell>
        <cell><cp>date</cp></cell>
        <cell><cp>array</cp> / <cp>arr</cp></cell>
        <cell><cp>object</cp> / <cp>obj</cp></cell>
      </li>
      <li><cp>str</cp> in the default data type</li>
      <li><cp>int</cp>, <cp>bigint</cp>, and <cp>num</cp> can have an optional <cy>min</cy> and/or <cy>max</cy> limits applied.</li>
      <li><cp>arr</cp> and <cp>obj</cp> can use a <cy>JSDOC @typedef</cy> that is defined in a <cp><code>&lt;script root></code></cp> block.</li>
      <li>Start with "<cy>:</cy>" to define public CPAs - <cp>:public-name</cp>.</li>
      <li>Public CPAs can change the component's attribute. Add a "<cy>+</cy>" - <cp><code>:+some-attr</code></cp></li>
      <li>Start with "<cy>:#</cy>" to define private CPAs - <cp>:#private-name</cp></li>
      <li>Private CPAs are not tied to the component's attribute.</li>
      <li>Standard JavaScript private members start with "<cy>#</cy>"&nbsp;&nbsp;&nbsp;<cp><code>this.#privateVar=10;</code></cp></li>
      </ul>`
  },
  {
    heading: "Evo: Using CPAs in your template",
    sub: "One way data binding.",
    content: `<ul>
            <li>CPAs are compiled into property <cp>getters</cp>/<cp>setters</cp> in your component</li>
            <li><cp>Setters</cp> attempt to convert data into the defined type (if possible)</li>
            <li>Public CPAs can also be set through the component’s <cp>attributes</cp>.</li>
            <li>All CPAs can be data bound in your templates.</li>
          </ul>
          <code><pre>&lt;component tag="mini-mum"
&nbsp;&nbsp;:message="str:Hello Evo"
&nbsp;&nbsp;:title
>
&nbsp;&nbsp;&lt;template>
&nbsp;&nbsp;&nbsp;&nbsp;&lt;h1 :title="title" :text="message">&lt;/h1>
&nbsp;&nbsp;&lt;/template>
&lt;/component></pre></code>
Usage:
<code><pre>&lt;mini-mum title="Welcome" message="We are glad you are here."></mini-mum>`
  },
  {
    heading: "Evo: Data binding - CPAs only",
    sub: "Regular Accountants just don't cut it.",
    content: `<ul>
            <li>When you add data binding in your templates you can only bind to a CPA.</li>
            <li>You can not add any javascript in the data binding attribute value.</li>
            <li>For example, this is not allowed: <cp><code>&lt;img :src="img + '.jpg'" /></code></cp></li>
            <li>Instead all values need to be calculated in your code and placed into a different CPA or use a <cy>pipe</cy> to change the value.</li>
          </ul>
          <code><pre>&lt;img :src="#imgUrl"/></pre></code>
          or
          <code><pre>&lt;img :src="img | addEnding" /></pre></code>`
  },
  {
    example: true,
    content: `<div class="left-right"><example-4></example-4>
          <code><pre>&lt;component tag="hello-age"
&nbsp;&nbsp;:message="str:Howdee Evo!"
&nbsp;&nbsp;:age="int:7"
&nbsp;&nbsp;:#ageStr>
&nbsp;&nbsp;&lt;template>
&nbsp;&nbsp;&nbsp;&nbsp;&lt;h4 :text="message">&lt;/h4>
&nbsp;&nbsp;&nbsp;&nbsp;&lt;p :text="#ageStr">&lt;/p>
&nbsp;&nbsp;&lt;/template>
&nbsp;&nbsp;&lt;style>
&nbsp;&nbsp;&nbsp;&nbsp;:host {
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;display: block;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;outline: 3px dashed white;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;padding: 5px;
&nbsp;&nbsp;&nbsp;&nbsp;}

&nbsp;&nbsp;&nbsp;&nbsp;h4:empty {display:none;}
&nbsp;&nbsp;&lt;/style>
&nbsp;&nbsp;&lt;script>
&nbsp;&nbsp;&nbsp;&nbsp;update() {
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;this.#ageStr = \`You are \${this.age} months old\`;
&nbsp;&nbsp;&nbsp;&nbsp;}
&nbsp;&nbsp;&lt;/script>
&lt;/component></pre></code>`
  },
  {
    heading: "Evo: Data binding - Options",
    sub: "Binding to more than just setters.",
    content: `<ul>
            <li>CPAs are created using kebab-case.</li>
            <li>CPAs are used in the template and JavaScript as camelCase.</li>
            <li>Data binding is <i>normally</i> done through property setters.</li>
            <li>Existing elements and components may support an attribute and not a property.</li>
            <li>You may need to control an attribute independently from its property. Think about the <cp><code>value</code></cp> attribute and the <cp><code>value</code></cp> property of the <cp><code>&lt;input></code></cp> element.</li>
            <li>You can bind to an attribute - <cp><code>:attr.showing="cpaVar"</code></cp><br/>If <cp>this.cpaVar === null</cp> the attribute will be removed.</li>
            <li>You can bind to an aria attribute - <cp><code>:aria.label="#ariaLabel"</code></cp></li>
            <li>You can bind to the dataset - <cp><code>:data.thing="someDataThing"</code></cp></li>
            <li>You can bind to textContent - <cp><code>:text="#cpaTextVar"</code></cp></li>
            <li>You can bind to innerHTML - <cp><code>:html="htmlVariable"</code></cp></li>
          </ul>`
  },
  {
    heading: "Evo: Data binding",
    sub: "Fast, reactive data binding.",
    content: `<ul>
            <li>When you use data binding in your template the properties or attributes are changed when the CPA value changes. This is done by using the transpiled setter for the CPA. The setter knows what it is bound to. The setter will only change the values in the DOM that need to be changed, saving time.</li>
          </ul>
          <div class="left-right">
            <code><pre>&lt;component tag="mini-mum"
&nbsp;&nbsp;:message="str:Hello!"
>
&nbsp;&nbsp;&lt;template>
&nbsp;&nbsp;&nbsp;&nbsp;&lt;h1 :text="message">&lt;/h1>
&nbsp;&nbsp;&lt;/template>
&lt;/component></pre></code><code><pre>set message(newVal) {
&nbsp;&nbsp;newVal = newVal == null ? null : ''+newVal;
&nbsp;&nbsp;const oldVal = this.#message;
&nbsp;&nbsp;if(oldVal !== newVal) {
&nbsp;&nbsp;&nbsp;&nbsp;this.#message = newVal;
&nbsp;&nbsp;&nbsp;&nbsp;this.#els.el0.textContent = newVal ?? null;
&nbsp;&nbsp;&nbsp;&nbsp;this.#callUpdate('message', oldVal, newVal);
&nbsp;&nbsp;}
}</pre></code>
          </div>`
  },
  {
    heading: "Evo: Two-way data binding",
    sub: "Make sure to look both ways.",
    content: `<ul>
      <li>Evo auto two-way binds to your CPA when you bind to the <cp>:value</cp> or <cp>:checked</cp> properties of an element in your template.
        <ul>
          <li><cp>:value</cp> will set the <cp>element.value</cp> property every time the CPA changes and it auto includes an event handler for the <cp>input</cp> event. This updates the CPA every time the value of the input field changes.</li>
          <li><cp>:checked</cp> will set the element.checked property every time the CPA changes and it auto includes an event handler for the <cp>change</cp> event. This updates the CPA every time the checkbox/radio button is checked or unchecked.</li>
        </ul>
      </li>
      <li>Your components can support 2-way binding by using the <cp>value</cp> property and dispatching an <cp>input</cp> event every time things change. </li>
    </ul>`
  },
  {
    heading: "Evo: Two-way binding",
    sub: "Sharing is caring",
    content: `<div class="left-right">
            <two-way></two-way>
            <code><pre>&lt;component tag="two-way" :#value>
&nbsp;&nbsp;&lt;template>
&nbsp;&nbsp;&nbsp;&nbsp;&lt;div>Type here: &lt;input :value="#value"/>&lt;/div>
&nbsp;&nbsp;&nbsp;&nbsp;&lt;div>&nbsp;&nbsp;or here: &lt;input :value="#value"/>&lt;/div>
&nbsp;&nbsp;&nbsp;&nbsp;&lt;div :text="#value">&lt;/div>
&nbsp;&nbsp;&lt;/template>
&lt;/component>
&nbsp;
&nbsp;
set #value(newVal) {
&nbsp;&nbsp;newVal = newVal == null ? null : ''+newVal;
&nbsp;&nbsp;const oldVal = this.#_value;
&nbsp;&nbsp;if(oldVal !== newVal) {
&nbsp;&nbsp;&nbsp;&nbsp;this.#_value = newVal;
&nbsp;&nbsp;&nbsp;&nbsp;this.#els.el1.value = newVal ?? null;
&nbsp;&nbsp;&nbsp;&nbsp;this.#els.el3.value = newVal ?? null;
&nbsp;&nbsp;&nbsp;&nbsp;this.#els.el4.textContent = newVal ?? null;
&nbsp;&nbsp;&nbsp;&nbsp;this.#callUpdate('#value', oldVal, newVal);
&nbsp;&nbsp;}
}</pre></code>
          </div>`
  },
  {
    heading: "Evo: Data binding - Pipes",
    sub: "Transform your display data on the fly",
    content: `<ul>
      <li>Evo supports data transformation pipes. Similar to Angular pipes.</li>
      <li>When you add a pipe the data is altered by the pipe before it is put into the DOM.</li>
      <li>The original data is not changed.</li>
      <li>Pipe functions receive the dataset to be used for options.</li>
      <li><cy>Avoid using the same pipe over and over. Instead calculate the changed value once.</cy></li>
      <li>Pipes can be chained &amp; can be written in your code or imported from an external file.
        <ul class="smaller-li">
        <li><cp>:text="message | ^toUpper"</cp> - the value of message is passed through the <cy>imported pipe</cy> function called <cp>toUpper</cp>.</li>
        <li><cp>:html="message | #sanitize"</cp> - the value of message is passed through the <cy>private pipe</cy> function called <cp>#sanitize</cp>.</li>
        <li><cp>:html="message | sanitize | ^toUpper"</cp> - the value of message is passed through a <cy>public pipe</cy> function called <cp>sanitize</cp> then through the <cy>imported pipe</cy> function called <cp>toUpper</cp>.</li>
        </ul>
      </li>
    </ul>`
  },
  {
    heading: "Evo: Data binding - Pipes",
    sub: "Mario may still get lost",
    content: `<div class="left-right">
      <pipe-me></pipe-me>
      <code><pre>&lt;component tag="pipe-me" :#val>
&nbsp;&nbsp;&lt;template>
&nbsp;&nbsp;&nbsp;&nbsp;&lt;input :value="#val">
&nbsp;&nbsp;&nbsp;&nbsp;&lt;div>Upper: &lt;span :text="#val|#upper">&lt;/span>&lt;/div>
&nbsp;&nbsp;&nbsp;&nbsp;&lt;div>Lower: &lt;span :text="#val|lower">&lt;/span>&lt;/div>
&nbsp;&nbsp;&nbsp;&nbsp;&lt;div>Reverse: &lt;span :text="#val|reverse|lower">&lt;/span>&lt;/div>
&nbsp;&nbsp;&lt;/template>
&nbsp;&nbsp;&lt;style>
&nbsp;&nbsp;&nbsp;&nbsp;div, input {
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;font-size: 2.5rem;
&nbsp;&nbsp;&nbsp;&nbsp;}
&nbsp;&nbsp;&lt;/style>
&nbsp;&nbsp;&lt;script>
&nbsp;&nbsp;&nbsp;&nbsp;lower(str) {
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return str.toLowerCase();
&nbsp;&nbsp;&nbsp;&nbsp;}
&nbsp;&nbsp;&nbsp;&nbsp;#upper(str) {
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return str.toUpperCase();
&nbsp;&nbsp;&nbsp;&nbsp;}
&nbsp;&nbsp;&nbsp;&nbsp;reverse(str) {
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return [...str].reverse().join("");
&nbsp;&nbsp;&nbsp;&nbsp;}
&nbsp;&nbsp;&lt;/script>
&lt;/component></pre></code>
    </div>`
  },
  {
    heading: "Evo: Event Binding",
    sub: "Handling user actions",
    content: `<ul>
        <li>Evo provides a simple way to handle events.</li>
        <li>Unlike most other frameworks, Evo uses native DOM events.</li>
        <li>To handle the click event on a button add <cp><code>.click="handlerName"</code></cp> and add the associated event handler function in your <cp><code>&lt;script></code></cp> block.</li>
      </ul>
      <code><pre>&lt;component tag="my-el" :#count="int:0">
&nbsp;&nbsp;&lt;template>
&nbsp;&nbsp;&nbsp;&nbsp;&lt;h1 :text="#count">&lt;/h1>
&nbsp;&nbsp;&nbsp;&nbsp;&lt;button .click="#onClick">Click Me&lt;/button>
&nbsp;&nbsp;&lt;/template>
&nbsp;&nbsp;&lt;script>
&nbsp;&nbsp;&nbsp;&nbsp;#onClick(event, data) {
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;this.#count++;
&nbsp;&nbsp;&nbsp;&nbsp;}
&nbsp;&nbsp;&lt;/script>
&lt;/component></pre></code>`
  },
  {
    heading: "Evo: Event Handlers",
    sub: "Arguments passed to event handler",
    content: `<ul>
        <li>Evo automatically passes the <cp>event</cp> and the <cp>element.dataset</cp> to your event handler.</li>
      </ul>
      <code><pre>&lt;template>
&nbsp;&nbsp;&lt;span :text="#localeStr">&lt;/span>
&nbsp;&nbsp;&lt;button .click="#onClick" data-locale="en">EN&lt;/button>
&lt;/template>
&lt;script>
&nbsp;&nbsp;#onClick(event, data) {
&nbsp;&nbsp;&nbsp;&nbsp;if (data.locale) {
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;this.#localeStr = data.locale;
&nbsp;&nbsp;&nbsp;&nbsp;}
&nbsp;&nbsp;}
&lt;/script></pre></code>`
  },
  {
    heading: "Evo: Event Handlers",
    sub: "Passing your own values to event handler",
    content: `<ul>
      <li>You can set standard dataset attributes with hard coded values:<br/><cp><code>&lt;span data-name="Snoopy"></code></cp>.</li>
      <li>Or, you can bind data attributes using a CPA:<br/><cp><code>&lt;span :data.name="#playerName"></code></cp>.</li>
      <li>Either way these data values are available in your event handler.</li>
    </ul>`
  },
  {
    example: true,
    content: `<div class="left-right">
      <locale-date style="font-size:2.5rem"></locale-date>
      <code><pre class="smaller">&lt;component tag="locale-date" shadow="closed"
&nbsp;&nbsp;:format="object:{weekday:'long',year:'numeric',month:'long',day:'numeric'}"
&nbsp;&nbsp;:timestamp="date:var:today" :locale :#localeTime>
&nbsp;&nbsp;&lt;template>
&nbsp;&nbsp;&nbsp;&nbsp;&lt;button .click="#setLocale" data-locale="en">EN&lt;/button>
&nbsp;&nbsp;&nbsp;&nbsp;&lt;button .click="#setLocale" data-locale="fr">FR&lt;/button>
&nbsp;&nbsp;&nbsp;&nbsp;&lt;button .click="#setLocale" data-locale="ru">RU&lt;/button>
&nbsp;&nbsp;&nbsp;&nbsp;&lt;button .click="#setLocale" data-locale="es">ES&lt;/button>
&nbsp;&nbsp;&nbsp;&nbsp;&lt;button .click="#setLocale" data-locale="cs">CS&lt;/button>
&nbsp;&nbsp;&nbsp;&nbsp;&lt;button .click="#setLocale" data-locale="ja">JA&lt;/button>&lt;br/>
&nbsp;&nbsp;&nbsp;&nbsp;&lt;span :text="#localeTime">&lt;/span>
&nbsp;&nbsp;&lt;/template>
&nbsp;&nbsp;&lt;style>
&nbsp;&nbsp;&nbsp;&nbsp;:host { display: inline-block; }
&nbsp;&nbsp;&lt;/style>
&nbsp;&nbsp;&lt;script root>
&nbsp;&nbsp;&nbsp;&nbsp;const today = new Date();
&nbsp;&nbsp;&lt;/script>
&nbsp;&nbsp;&lt;script>
&nbsp;&nbsp;&nbsp;&nbsp;update() {
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if (this.format != null && this.timestamp != null) {
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;const locale = this.locale || document.documentElement.lang || navigator.language;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;const format = this.format || { month: '2-digit', day: '2-digit', year: 'numeric' };
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;const formatter = new Intl.DateTimeFormat(locale, format);
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;this.#localeTime = formatter.format(this.timestamp);
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}
&nbsp;&nbsp;&nbsp;&nbsp;}

&nbsp;&nbsp;&nbsp;&nbsp;#setLocale(event, data) {
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;this.locale = data.locale;
&nbsp;&nbsp;&nbsp;&nbsp;}
&nbsp;&nbsp;&lt;/script>
&lt;/component></pre></code>
    </div>`
  },
  {
    heading: "Evo: Conditionals",
    sub: "Should it hide or should it show?",
    content: `<ul>
      <li>Evo can conditionally hide and show sections of your DOM.</li>
      <li>There are two conditional directives: <cp><code>$if</code></cp> and <cp><code>$switch</code></cp>.</li>
      <li>The <cp><code>$switch</code></cp> directive is functional. <span class="smaller"><i>I am not happy with it and may change how it works.</i></span></li>
      <li><cp><code>$if</code></cp> works very well and very fast. The element is either in the DOM or held in a variable outside of the DOM.</li>
    </ul>
    <code><pre>&lt;template>
&nbsp;&nbsp;&lt;span $if="found">&lt;span :text="#count">&lt;/span> items were found.&lt;/span>
&nbsp;&nbsp;&lt;span $if="!found">Nothing was found.&lt;/span>
&lt;/template></pre></code>`
  },
  {
    example: true,
    content: `<div class="left-right">
      <example-3></example-3>
    <code><pre>
&lt;component tag="if-one" :state="bool:true">
&nbsp;&nbsp;&lt;template>
&nbsp;&nbsp;&nbsp;&nbsp;&lt;div>this.state is currently set to &lt;span :text="state">&lt;/span>&lt;/div>
&nbsp;&nbsp;&nbsp;&nbsp;&lt;button .click="#toggleState">Toggle&lt;/button>
&nbsp;&nbsp;&nbsp;&nbsp;&lt;div class="red" $if="state">Shows if this.state is set to true.&lt;/div>
&nbsp;&nbsp;&nbsp;&nbsp;&lt;div class="blue" $if="!state">Shows when this.state is set to false.&lt;/div>
&nbsp;&nbsp;&lt;/template>
&nbsp;&nbsp;&lt;style>
&nbsp;&nbsp;&nbsp;&nbsp;.red { background-color: #F00; margin: 20px; padding: 20px; }
&nbsp;&nbsp;&nbsp;&nbsp;.blue { background-color: #00F; color: #FFF; margin: 20px; padding: 20px; }
&nbsp;&nbsp;&lt;/style>
&nbsp;&nbsp;&lt;script root>
&nbsp;&nbsp;&nbsp;&nbsp;export const MY_VAL = 10;
&nbsp;&nbsp;&lt;/script>
&nbsp;&nbsp;&lt;script>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#toggleState(event) {
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;this.state = !this.state;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}
&nbsp;&nbsp;&lt;/script>
&lt;/component>
  </pre></code></div>`
  },
  {
    heading: "Evo: Looping",
    sub: "The code in the app goes round and round...",
    content: `<ul>
      <li>Evo allows looped output based on data in an array.</li>
      <li>Use the <cp></code>$for="cpaVar as item.key"</code></cp></li>
    </ul>
    <code><pre>&lt;component tag="my-looper"
&nbsp;&nbsp;:items="arr&lt;MyThing>"
>
&nbsp;&nbsp;&lt;template>
&nbsp;&nbsp;&nbsp;&nbsp;&lt;div $for="items as item.uid">
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;span :text="item.count">&lt;/span> &lt;span :text="item.name">&lt;/span>
&nbsp;&nbsp;&nbsp;&nbsp;&lt;/div>
&nbsp;&nbsp;&lt;/template>
&nbsp;&nbsp;&lt;script root>
&nbsp;&nbsp;&nbsp;&nbsp;/**
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;* @typedef {Object} MyThing
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;* @property {number} uid - Unique Id for this item
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;* @property {string} name - The name of the item
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;* @property {number} count - Number of items
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*/
&nbsp;&nbsp;&lt;/script>
&lt;/component></pre></code>`
  },
  {
    example: true,
    content: `<wc-loop></wc-loop>`
  },
  /*
  {
    heading: "Evo: Lifecycle Methods",
    sub: "Code when and where it is needed",
    content: `<ul>
    <li>Evo has a limited number of lifecycle methods.
      <ul>
      <li><cp>init()</cp> - Called at the end of the constructor.</li>
      <li><cp>update({cpa, oldVal, newVal})</cp> - Called every time any property is updated and when the component is connected to the DOM.</li>
      <li><cp>connected()</cp> - This is called by the base class <cp>connectedCallback</cp> function.</li>
      <li><cp>disconnected()</cp> - This is called by the base class <cp>disconnectedCallback</cp> function.</li>
      <li><cp>adopted()</cp> - This is called by the base class <cp>adoptedCallback</cp> function.</li>
      <li><cp>attrChanged(attr, oldVal, newVal)</cp> - Called when an attribute has changed. This is called by the base class <cp>attributeChangedCallback</cp> function.</li>
      <li>I will be adding <cp>this.onUpdate(cpa, handler)</cp> and <cp>this.onUpdate([cpa1, cpa2, ...], handler)</cp> that you can call in the init function.<ul>
        <li>This will allow granular update functions.</li>
        </ul>
      </li>
      </ul>
    </li>
  </ul>`
  },
  */
  {
    heading: "Evo: Referencing elements",
    sub: "Mom... He's touching me!",
    content: `<ul>
      <li>Evo automatically identifies all elements in a template that it needs to reference.</li>
      <li>Evo does this by adding the <cp>el</cp> attribute to the tags:<br/><cp><code>&lt;div el="el0">&lt;/div></code></cp></li>
      <li>You can set the <cp>el</cp> attribute to a specific name:<br/><cp><code>&lt;input el="username" :value="#name" /></code></cp></li>
      <li>Then you access it in your JavaScript like this:<br/><cp><code>this.#els.username.focus();</code></cp></li>
      <li><cy>Do not repeat the same value in different <cp>el</cp> attributes.</cy></li>
      <li>This can get complicated with looping. <i class="smaller">I can explain outside of this presentation.</i></li>
    </ul>`
  },
  /*
  {
    heading: "Evo: Binding Examples",
    sub: "Evo sets the correct property or attribute automatically",
    content: `<table>
      <tr>
        <td>:title="val"</td>
        <td>element.title = this.val</td>
      </tr>
      <tr>
        <td>:title="#val"</td>
        <td>element.title = this.#val</td>
      </tr>
      <tr>
        <td>:data.title="#val"</td>
        <td>element.dataset.title = this.#val</td>
      </tr>
      <tr>
        <td>:attr.state="#state"</td>
        <td>element.setAttribute('state', this.#state)
          <br/>
          <br/>
          <cw>or, if the value of</cw> this.#state <cw>is</cw> null: element.removeAttribute('state')"</td>
      </tr>
      <tr>
        <td>:aria.label="val"</td>
        <td>element.setAttribute('aria-label', this.val)/element.removeAttribute</td>
      </tr>
      <tr>
        <td>:html="value"</td>
        <td>element.innerHTML = this.value</td>
      </tr>
      <tr>
        <td>:text="name"</td>
        <td>element.textContext = this.name</td>
      </tr>
      <tr>
        <td>:class="name"</td>
        <td>element.className = this.name</td>
      </tr>
      <tr>
        <td>:style="#styleVal"</td>
        <td>element.setAttribute('style', this.#styleVal)/element.removeAttribute</td>
      </tr>
    </table>
    <p>The HTML spec is huge and I don't know if I have caught everything. If you find something that is not working, enter an issue on GitHub.</p>`
  },
  */
  {
    heading: "Standards and Ideals",
    sub: "How Evo can change the world",
    content: `<div>My goals with Evo are:</div>
    <ul>
      <li>Follow as many native web standards as possible.</li>
      <li>Simplify the developers job without hurting the user.</li>
      <li>Reduce code and memory while improving runtime speed.</li>
      <li>Help teach best practices.</li>
      <li>Make Evo components act like native, built in components.</li>
      <li>Reduce the amount of code that needs to be rewritten every time a new framework comes along.</li>
      <li>Continue to improve Evo-wc and the other, future, aspects of Evo.</li>
      <li>Create a thriving community of Evo developers.</li>
      <li>Create an online repo where developers can share their public components.</li>
      <li>Provide the transpiler in JS, C#, PHP, Python, Rust, &amp; Java for any build stack.</li>
    </ul>`
  },
  {
    center: true,
    heading: "Questions?",
    content: `<div class="contact"><h1>Contact Me</h1>
      <div><cp>UtahJS Slack:</cp> mike-collins</div>
      <div><cp>Email:</cp> intervalia+evo@gmail.com</div>
      <br/><br/>
      <h1>More Information</h1>
      <div><cp>Website:</cp> <wc-a href="https://www.evowc.com" show-ext="1">https://www.evowc.com</wc-a></div>
      <div><cp><wc-a href="https://github.com/EvolvedWeb/evowc" show-ext="1">Github Repo</wc-a></cp></div>
      <div>Issues and PRs desired and accepted</div>
    </div>`
  },
  {
    heading: "Is it Evo?",
    sub: "What was this presentation written in?",
    content: `<p style="padding-top:8rem">Yes, this presentation was written in Evo.<p>
      <p>I started out using Apple Keynote. But I didn't like jumping between apps. So, I <cp>hacked</cp> together a few components, transferred all of my text, and added some of my example components.</p>
      <p>This presentation will be included in the Evo repo once it is public.</p>
      <p class="smaller"><i>The font <cy><span style="font-family: kingvoon">Kingvoon</span></cy>, is not included, but is available <a href="https://www.creativefabrica.com/product/kingvoon/" target="_blank">here.</a></i></p>`
  },
  {
    heading: "Example Evo Component?",
    sub: "Stencil is probably the closest thing to Evo.",
    content: `<div class="left-right">
      <div class="stencil">
        <h4 style="margin:0">Stencil</h4>
        <code><pre class="smaller">import { Component, State, h } from '@stencil/core';
  @Component({tag: 'custom-clock'})
  export class CustomClock {
  &nbsp;&nbsp;timer: number;
  &nbsp;&nbsp;@State() time: number = Date.now();
  &nbsp;&nbsp;connectedCallback() {
  &nbsp;&nbsp;&nbsp;&nbsp;this.timer = setInterval(() => {
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;this.time = Date.now();
  &nbsp;&nbsp;&nbsp;&nbsp;}, 1000);
  &nbsp;&nbsp;}
  &nbsp;&nbsp;disconnectedCallback() {
  &nbsp;&nbsp;&nbsp;&nbsp;clearInterval(this.timer);
  &nbsp;&nbsp;}
  &nbsp;&nbsp;render() {
  &nbsp;&nbsp;&nbsp;&nbsp;const time = new Date(this.time).toLocaleTimeString();
  &nbsp;&nbsp;&nbsp;&nbsp;return (&lt;span>{ time }&lt;/span>);
  &nbsp;&nbsp;}
  }</pre></code>
      </div>
      <div class="Evo">
        <h4 style="margin:0">Evo</h4>
        <code><pre class="smaller">&lt;component tag="custom-clock" :#time>
  &nbsp;&nbsp;&lt;template>
  &nbsp;&nbsp;&nbsp;&nbsp;&lt;span :text="#time">&lt;/span>
  &nbsp;&nbsp;&lt;/template>
  &nbsp;&nbsp;&lt;script>
  &nbsp;&nbsp;&nbsp;&nbsp;#timer;
  &nbsp;&nbsp;&nbsp;&nbsp;connected() {
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;this.#timer = setInterval(() => {
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;this.#time = new Date().toLocaleTimeString();
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}, 1000);
  &nbsp;&nbsp;&nbsp;&nbsp;}
  &nbsp;&nbsp;&nbsp;&nbsp;disconnected() {
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;clearInterval(this.#timer);
  &nbsp;&nbsp;&nbsp;&nbsp;}
  &nbsp;&nbsp;&lt;/script>
  &lt;/component></pre></code>
        </div>
      </div>`
  }
];
