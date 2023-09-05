# Updates to EVO-WC

## Version 0.5.0 - 2023-08-05 - *** REWROTE EVERYTHING - Breaking ***

* The code was getting too complex so I broke it up into smaller files and process the initial XML very differently. Much easier to maintain.
* Added min and max limiters for `int` and `num`. Example: `:rank="num(0,5):0"`.
* Changed from `<import>` tag to `<script root>` so editors work better.
* Added eslint
* Added limited testing
* Added: Code of Conduct, Contributing, License, and Security files
* Added Feature comparison list file between React and Evo
* Added ability to read evo config from package.json
  * Ability to change source and transpile paths
  * Specify minification or not of HTML and CSS
  * Add debug info or not - This is not supported in the code yet.
  * Ability to change the default output file extension.
* Updated several dependancies
* Started updating the Readme and breaking it up into multiple files.
* Added a tsconfig.json file. - Evo is not written in TypeScript, but I use its error checking with jsdocs typed
* To allow a component with just raw text and more elements I changed from
  * [...tempEl.children].forEach(el => this.#rootDom.appendChild(el)); to
  * [...tempEl.childNodes].forEach(el => this.#rootDom.appendChild(el));
* Changed based class to create comment els instead of making all of the component classes do it.
* Updated the default pipes to now take the dataset argument
* Improved Routing
* Created `<wc-a>` element
* Supporting most of the express style routing path styles
* Adding a Feature Comparison List
* Fixed generator to properly output the HTML when not minified.
* Added another link to EXAMPLES.md for other components/CSS that I can emulate with my built-in components.
* Fixed looping to work. - Conditionals in looping still does not work
* Made the build variables to be read-only members of the component
* Removed invalid comments and console.logs
* Improved the updates for a single item with :value in a loop.
* Improved the accuracy of setting a property, attribute, etc.
* Added code to generate JSDocs in the output source code.
* Added code to allow a Type for arrays and Object `:list="arr<Person>"
* Added the ability to add JSDoc types into the root script block
* andling setting CPA properties on looped elements
* Breaking out the bindings and events for loops
* Improved names of some constants to be more accurate.
* Dates and Objects now use the same compare routine.
* Now using default values on setting variables into element properties, attributes, etc.
* Fixed the command line code to use the newer code.
* Updated the ChangepwDialogElement to have two new password fields.
* the `extends` attribute now takes "tag:class" to allow for more flexible overrides
* Finished the compDate, compArray and compObject functions in EvoElement.js
* changed the old code to use el="name" instead of js="name"
* Added initial evo-pipes.js with toUpper and toLower() functions
* Fixed the cond() function to work with the new format that allows inclusion and exclusion of ranges of numerical values.
* Added more test components
* Added my Evo demonstration that I used with UtahJS meetups
* Resolves #5 - tag names with multiple - fail to create a valid class name (Component.js)
* Resolves #6 - Transpiled filename are now corrected.
* Resolved #7 - Developer can now set the transpiled file extension to `.ts` or anything else
* Resolves #9 - Evo improperly used URI encoding instead of Entity encoding.
* Resolves #11 - Include dataset values as the second parameter in pipe functions (Generator.js)
* Resolves #14 - Raw Text components can now be created.
* Resolves #15 - Now supports `-o` and setting in package.json to set output path.

## version 0.4.0 - 2023-05-01 - *** Breaking Changes ***

* Added SystemDialogs (alertwc, confirmwc and promptwc)
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
* Added bigint support
* Added error checking to make sure properties are defined in order to use them
* Added support for longer and shorter type names, like `num` and `number` or `str` and `string`
* Moved more startup data into the options object
* Correctly update/insert styles when component moves parents
* Updated to most recent dependancies

## version 0.3.0 - 2023-03-01 - *** Breaking Changes ***

* Changed the conditionals from `:if` and `:switch` to `$if` and `$switch` to allow `:if` and `:switch` to be used as bindings.
* Added ability to set attributes on the component by addint a `+` to the property definition attribute like `:+show`
* All property definition attribute must now be lower case or lower snake-case.
* `$if` and `$switch` can now use either the property definition attribute name or the property name. Like `$if="#dog-food"` or `$if="#dogFood"`
* Updated README.md to match changes

## version 0.2.0 - 2023-02-27 - *** Breaking Changes ***

Normally I would update the major version for breaking changes, but I am not ready to release version 1.0.0 yet. Please check all your components for the breaking changes below.

* For more consistency I converted `::text`, `::html`, and `::value` to `:text`, `:html`, and `:value` <-- **Breaking**
* Renamed DFElement base class to EvoElement. <-- **Breaking**
* Started the live creation page.
* Basic `:switch` support.
* Added other values in ATTRIBUTE_BASED_PROPS
* Updated README.md

## Version 0.1.2 - 2023-02-13

* The function `update` is now given the name of the propery that was changed just before calling `update`.
* Updated README.md


## Version 0.1.1 - 2023-02-13

* Fixed #2 - Provide proper encoding of `<`, `>` and `&` in the template
* Created example RoundProgressElement component
* Updated example Calendar to use fix for #2
* Fixed ATTRIBUTE_RS and HTML_ENTITIES_RS to work correctly


## Version 0.1.0 - 2023-02-11

* Added command `npm run build`
* Updated `README.md`
* Removed lots of `console.log`
* Created example calendar component
* Created `UPDATELOG.md`


## Version 0.0.1 - 2023-02-07

* Initial release with most features finished
