# Updates to EVO-WC

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
* Shank the names of the helper functions in the base class file
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
