# Updates to EVO-WC

## Version 1.1.3 - 2024-04-05

* Resolves #96 - Updated dependencies
* Resolves #97 - Init and transpiler work correctly on Windows.
* Resolves #98 - Corrected exception in `WCAElement`
* Resolves #99 - Corrected exception in `WCRouterElement`
* Resolves #100 - Corrected CSS loading error `HighlightCodeElement`
* Added `CopyrightYearElement` component
* Updated to eslint 9.0.0 and fixed eslint config file

## Version 1.1.2 - 2024-03-21

* Resolves #18 - Added event binding `.click`, attributes `:attr.show`, aria attributes
`:aria.label`, and data attributes `:data.name` to the `<template>` tag.
* Resolves #52 - Evo now supports external CSS files in the `<style>` tag.
* Resolves #53 - Evo now supports external JS files for the `<script>` tag.
* Resolves #76 - Added support for using `adoptedStyleSheets` to save memory and parsing.
* Resolves #87 - Fixed the null exception that was thrown for using invalid `$switch` formatting
* Resolves #92 - Setting capture `.click:c` is now working correctly.
* Updating to version 1.1.2
* Updated fast-xml-parser to version 4.3.6
* Updated @types/node to version 20.11.30
* Updated express to version 4.19.1
* We now pass options into the Component class constructor for use to load external script and style files.
* Tags in the `<template>` can now be self closing.
* Created `ExtStuff.html`, `ExtStuff.css`, `ExtStuffCode.js`, and `ExtStuffRoot.js` to test external loading.
* Added the file `parseInterpolation.js` to get ready for adding interpolation to binding attribute values and to element textContent.
* Updated test to test new code changes.
* Added docs for the new `createStyles` function.
* Removed old, unused, example files.
* Updated the Copyright dates in the `LICENSE` file.
* Updated several links, layout, and content in the `README.md` file.
* Updated `UPDATELOG.md`
* Updated `npm run prep` to include more things to do before deploy.
* Dug through my original files and found the first data on a file was Jan 28, 2023

## Version 1.1.1 - 2024-03-11

* Resolves #78 - Callbacks registered through `EvoElement.onUpdate` are now getting called at the right times.
* Resolves #79 - Added a Deploy Prep process to make sure that all updated files are in the right place.
* Resolves #80 - `adoptedCallback` now works like `connectedCallback` to insert DOM and styles as needed.
* Revised how `#callUpdate` happens and moved it to the base class. This improves how we call this.update and any methods registered through onUpdate.
* Updated tests to properly test the changes for `#callUpdate`
* Added `npm run prep` and associated code to make sure that we do everything before deploying a new version to npm.
* Updated @types/node to version 20.11.26.

## Version 1.1.0 - 2024-03-06

* Resolves #12 - Handle `"c"` capture, `"p"` passive and `"1"` once for event handlers. Prevents `passive` & auto-calling `preventDefault()`
* Resolves #24 - Added onUpdate method in base class to allow a callback to be called when a specific CPA is changed
* Resolves #28 - New logo included. One for on dark background and one for on light backgrounds
* Resolves #48 - Added a way to define additional element tags that should not be minified.
* Resolves #61 - Added a filter to the router.onUpdate method
* Resolves #62 - We now pass in relevant information about the current route.
* Resolves #65 - `EvoRouter` now properly handles trailing `/`
* Resolves #66 - All the source files are not ESM based.
* Resolves #67 - Comments for a looped variable name are now accurate
* Resolves #68 - Now looped Event Handlers use the correct variable names
* Resolves #69 - All tests are now ESM
* Resolves #71 - We now pass in relevant information about the current route into the public method `navParams` if it exists.
* Resolves #73 - Unit tests are now over 80%
* Resolves #74 - `WcDialogElement` now has a common way to handle `busy`, `aria-busy`, and `inert`.
* Resolves #75 - Updated the default Evo pipes to include: `toUpper`, `toLower`, `toJson`, `toCurrency`, `toDate`, `toDecimal`, `toPercent`
* Added watch to the demo/test app
* Changed how the `SystemDialogElement` dialogs are loaded. The functions to open them now use ESM instead of adding them to `"window"`
* Removed `console.log` lines
* Added new logos
* Deprecated `"router.onUpdate"` and renamed it to `"router.onChange"`. `"router.onUpdate"` will still work until version 2.0.0
* Updates to README.md and UPDATELOG.md
* Changed from `tsconfig.json` to `jsconfig.json` since we use JSDoc types instead of TypeScript.
* Cleaned up the "selected" feature of the <wc-a> element
* Updated the RouteNotFoundElement.html file to include an SVG image.
* Added lost of comment from conversations with chatGPT on various improvements to the routing and dialogs.
* Added ability to remove/delete elements that are router targets when the developer adds the attribute `auto-delete` or `auto-delete="<minutes>"` to `<wc-route>` to help save memory
* Added parseQueryParams to EvoRouter.js file to convert query params into an object.
* Improved `Camel to Kebab` and `Kebab to Camel` routines to better handle i18n words.
* Lots of spelling corrections and updates to cspell.json
* Added several sections of `"// cspell disable"` for things that do not need to be spell checked
* Improved support for for loops in preparation to allow sub loops.
* Added router support for hashchange events
* Updated chai, eslint, fast-xml-parser, mocha, and express.
* Updated the slideshow and moved the slideshow pages into a separate file.
* Updated several components to use `this.onUpdate` instead of a generic `update` method.
* Updated some components to better use CSS variables.
* Added several flavors of the logo
* Added a common `getLocal` method in the pipes to default to the page or to the browser locale.
* Changed from `sinon` to `nock`
* Changed from `nyc` to `c8`
* Changed from `proxyquire` to `esmock`

## Version 1.0.0 - 2023-11-20

* Resolved #60 - Improved Docs on Evowc.com website.
* Resolves #59 - Corrected and Improved `evowc update` command line.
* Resolves #63 - Got unit testing to over 60%.
* Many small fixes based on added tests.
* Removed lots of `console.log` from codebase.
* Removed the inaccurate CSS minifier code that could have produced invalid CSS.
* Fixed `EvoRouter.js` to properly perform pathToRegex based on testing.
* Moved dependencies to devDependencies that are not needed when Evowc is loaded as a dependency in another project.
* Change the package name from "@evo/wc" to "@evolvedweb/wc" to avoid conflict with the many existing "@evo" projects on NPM.
* Added `.npmignore` file to prepare to deploying to npmjs.com.

## Version 0.7.0 - 2023-10-31

* Updated `EvoElement.js`
  * Resolves #17 - Each component now only identifies the elements that belong to that specific component. This is accomplished by each component adding, at runtime, a component ID (denoted by the `_cid` attribute) to each tag that has an `el` attribute. This ensures we only find the elements related to this component and not the child components.
  * Modified the conditional to operate with `truthy`/`falsy` values, not just `true`/`false`.
  * The `attributeChangedCallback` now sets properties within a `setTimeout` to avoid infinite loops.
  * Minor cleanup, added JSDOC types, and included `@ts-ignore`.
* Updated `WcAElement.html`
  * Set `target="_blank"` if it is not already set and we are linking to an external website.
  * Adopted the use of `--wc-a-color`, `--wc-a-bgcolor`, `--wc-a-decoration`, and `--wc-a-hover-decoration`. All other values can be adjusted using `wc-a::part(a)`.
  * Integrated an icon to represent an external link. Activate it by setting the attribute `show-ext="1"` or the property `el.showExt = true`.
  * We now only SET the selected attribute. It is set when the current URL matches the one in the `href` attribute or when the beginning of the current URL aligns with the one in the `starts-with` attribute.
  * We initiate the check for if this link is the selected link in `connected` and cease in `disconnected`.
* Fixed the slideshow to function correctly with v0.7.0
* Refined the event generation code for enhanced compatibility with PSI, including improved handling of `PreventDefault`, `stopPropagation`, and `stopImmediatePropagation`.
* Corrected `Component.js` to support attributes in both uppercase and lowercase, aligning with SVG's flexibility.
* Removed outdated Docs files, which have been transferred to the `evowc.com` repository.
* Expanded the list of reserved names that are prohibited for CPA names.
* Broke the `Generator.js` code into smaller files to enable better testing.
* Partial for #21 - Incorporated additional unit tests.
* Changed the code to only compile the source files that have changed.
* Added exception handling to `lib/formatDate.js`
* Big fixes and some minor improvements to `lib/pathToRegEx.js` based on adding tests for that file.
* Added the min and max value specifications for the `BigInt` CPA type: `:num="BigInt(0n,1234567890n)"` (The trailing `n` is optional).
* Resolves #27 - Added `evowc watch` command to start server and watch for changes. Currently does a recompile, but does not auto reload the browser.
* Resolves #19 - Added versioning that creates a folder called `Evo-1.2.3` in which the `Evo*.js` files are placed. The value for `1.2.3` will be the current version of Evo.
* Resolves #38 - Enhanced `evowc init` functionality to facilitate the creation of a comprehensive example website with integrated routing.
* Resolves #39 - Added `evowc update` to supply new versions of the Evo*.js files.
* Updated all dependencies.
* Updated version to 0.7.0

## Version 0.6.0 - 2023-09-27 - *** Breaking Changes ***

* Resolves #42 - The `$for` index value is `_index` and that can be used inside the `$for` section of the code. (Started code to allow developer to define the name of the index variable, but that was getting complicated. So I will finish it later.)
* Resolves #40 - `ael` is now imported if it is only used within a `$for` section of code.
* Resolves #36 - Changed from `update(field, oldVal, newVal)` to `update( { cpa, oldVal, newVal } )` to allow future upgrades and to allow getting only the arguments you want.
* Resolves #34 - Comments are no longer stored in `this.#els`
* Resolves #33 - `this.#els` is frozen making it read-only.
* Resolves #32 - Changed the names of the private storage variables from `#_varName` to `#__varName` and from `#varName` to `#_varName` to avoid name collision.
* Resolves #13 - Added code to support the new (PSI) event options:
  * `p`: 'evt.preventDefault()',
  * `s`: 'evt.stopPropagation()',
  * `i`: 'evt.stopImmediatePropagation()'
* Resolves #10 - Supporting `:checked` in addition to `:value`
* Created a new `README.md` based on https://github.com/othneildrew/Best-README-Template and renamed the previous readme to `oldREADME.md`
* Minor cleanup of some of the example components
* Updated all demo components to handle #36 changes
* Updated EvoElement.js to handle #36 changes
* Updated the `README.md` to include a link to the Evo Slack Workspace.
* Updated the feature compare list
* Added NoShadowElement.html to test the failings of bug 17. Still needs to be fixed.
* Corrected the test app to load the correct code.
* Modified AlertBoxElement.html to test the new event handler (PSI) options
* Added additional exports and JSDocs types into the generator code.
* Updated version to 0.6.0

## Version 0.5.0 - 2023-08-05 - *** REWROTE EVERYTHING - Breaking Changes ***

* The code was getting too complex so I broke it up into smaller files and process the initial XML very differently. Much easier to maintain.
* Added min and max limiters for `int` and `num`. Example: `:rank="num(0,5):0"`.
* Changed from `<import>` tag to `<script root>` so editors work better.
* Added `eslint`
* Added limited testing
* Added: `Code of Conduct`, `Contributing`, `License`, and `Security` files
* Added Feature comparison list file between React and Evo
* Added ability to read evo config from `package.json`
  * Ability to change source and transpile paths
  * Specify minification or not of HTML and CSS
  * Add debug info or not - This is not supported in the code yet.
  * Ability to change the default output file extension.
* Updated several dependencies
* Started updating the Readme and breaking it up into multiple files.
* Added a `tsconfig.json` file. - Evo is not written in TypeScript, but I use its error checking with JSDoc types
* To allow a component with just raw text and more elements I changed from
  * `[...tempEl.children].forEach(el => this.#rootDom.appendChild(el));` to<br/>
    `[...tempEl.childNodes].forEach(el => this.#rootDom.appendChild(el));`
* Changed based class to create comment els instead of making all of the component classes do it.
* Updated the default pipes to now take the dataset argument
* Improved Routing
* Created `<wc-a>` element
* Supporting most of the express style routing path styles
* Adding a Feature Comparison List
* Fixed generator to properly output the HTML when not minified.
* Added another link to EXAMPLES.md for other components/CSS that I can emulate with my built-in components.
* Fixed looping to work. - _Conditionals in looping still does not work_
* Made the build variables to be read-only members of the component
* Removed invalid comments and console.logs
* Improved the updates for a single item with `:value` in a loop.
* Improved the accuracy of setting a property, attribute, etc.
* Added code to generate JSDocs in the output source code.
* Added code to allow a Type for arrays and Object `:list="arr<Person>"`
* Added the ability to add JSDoc types into the `<script root>` block
* Handling setting CPA properties on looped elements
* Breaking out the bindings and events for loops
* Improved names of some constants to be more accurate.
* Dates and Objects now use the same compare routine.
* Now using default values on setting variables into element properties, attributes, etc.
* Fixed the command line code to use the newer code.
* Updated the `ChangepwDialogElement` to have two new password fields.
* the `extends` attribute now takes `"tag:class"` to allow for more flexible overrides
* Finished the `compDate`, `compArray` and `compObject` functions in `EvoElement.js`
* changed the old code to use `el="name"` instead of `js="name"`
* Added initial `evo-pipes.js` with `toUpper()` and `toLower()` functions
* Fixed the `cond()` function to work with the new format that allows inclusion and exclusion of ranges of numerical values.
* Added more test components
* Added my Evo demonstration that I used with UtahJS meetups
* Resolves #5 - tag names with multiple - fail to create a valid class name `Component.js`
* Resolves #6 - Transpiled filename are now corrected.
* Resolved #7 - Developer can now set the transpiled file extension to `.ts` or anything else
* Resolves #9 - Evo improperly used URI encoding instead of Entity encoding.
* Resolves #11 - Include dataset values as the second parameter in pipe functions `Generator.js`
* Resolves #14 - Raw Text components can now be created.
* Resolves #15 - Now supports `-o` and setting in `package.json` to set output path.

## version 0.4.0 - 2023-05-01 - *** Breaking Changes ***

* Added SystemDialogs (`alertwc`, `confirmwc` and `promptwc`)
* Added other test components
  * Button - Does not work on Safari
  * ButtonGroup
  * Dialog
  * Login Dialog
  * Change Password Dialog
  * Spinner
  * Star rank
* Shrank the names of the helper functions in the base class file
* Added ability to inject debug output to components
* Improved the creating of sub components to be valid at creation of the parent
* Minor updates to the creation page. Lots left to do.
* Added `bigint` support
* Added error checking to make sure properties are defined in order to use them
* Added support for longer and shorter type names, like `num` and `number` or `str` and `string`
* Moved more startup data into the options object
* Correctly update/insert styles when component moves parents
* Updated to most recent dependencies

## version 0.3.0 - 2023-03-01 - *** Breaking Changes ***

* Changed the conditionals from `:if` and `:switch` to `$if` and `$switch` to allow `:if` and `:switch` to be used as bindings.
* Added ability to set attributes on the component by adding a `+` to the property definition attribute like `:+show`
* All property definition attribute must now be lower case or lower snake-case.
* `$if` and `$switch` can now use either the property definition attribute name or the property name. Like `$if="#dog-food"` or `$if="#dogFood"`
* Updated `README.md` to match changes

## version 0.2.0 - 2023-02-27 - *** Breaking Changes ***

Normally I would update the major version for breaking changes, but I am not ready to release version 1.0.0 yet. Please check all your components for the breaking changes below.

* For more consistency I converted `::text`, `::html`, and `::value` to `:text`, `:html`, and `:value` <-- **Breaking**
* Renamed `DFElement` base class to `EvoElement`. <-- **Breaking**
* Started the live creation page.
* Basic `:switch` support.
* Added other values in `ATTRIBUTE_BASED_PROPS`
* Updated `README.md`

## Version 0.1.2 - 2023-02-13

* The function `update` is now given the name of the property that was changed just before calling `update`.
* Updated `README.md`


## Version 0.1.1 - 2023-02-13

* Fixed #2 - Provide proper encoding of `<`, `>` and `&` in the template
* Updated example Calendar to use fix for #2
* Created example RoundProgressElement component
* Fixed `ATTRIBUTE_RS` and `HTML_ENTITIES_RS` to work correctly


## Version 0.1.0 - 2023-02-11

* Added command `npm run build`
* Updated `README.md`
* Removed lots of `console.log`
* Created example calendar component
* Created `UPDATELOG.md`


## Version 0.0.1 - 2023-02-07

* Initial release with most features finished and transpiler generating simple components
