# How to Contribute

## Report a problem or suggestion

Go to our [issue tracker](https://github.com/EvolvedWeb/evowc/issues) and check if your problem/suggestion is already reported.
If not, create a new issue with a descriptive title and detail your suggestion or steps to reproduce the problem.

If you are reporting a bug, please point the environment where you find it. (Node.js on GNU/Linux Distro, Firefox on windows, Electron on Mac, Chrome on Android,...) Describe if this is a problem with the transpiler or with a component it generated.
If you can, please include a copy of a minimum failing component template file.

## Filter Issues

You can help answering issue questions; maturing or voting on feature suggestions; confirming bug reports and adding more information to then. You can help a lot locating the bug source and proposing test code to prevent regression bug.

## Contribute to the code

If you know how to code, we welcome you to send fixes and new features, but in order to be efficient we ask you to follow the following procedure:

- Fork this repo;
- Clone your forked repo locally;
- Code your changes (if you want to implement many features do each one in a separated branch);
- Write tests to ensure your feature works as expected and protect its behavior on future changes;
- Test it! Ensure you don't crash Evo in Node.js or Browser environments;
  - Full test with `npm test` will also produce a coverage report.
  - For more option, see the "[Testing](#testing)" topic bellow.
- Push to your forked repo;
- Make your pull request.

> Evo is written in raw JavaScript and not in TypeScript, CoffeScript. Please do not submit any PRs with code other than JavaScript. We do utilize JSDocs types in the code to help editors provide quality assistance. Make sure to include JSDocs types in your PRs.

### Developing

You can create component template files in the Evo-WC project and incorporate them into yout test html file that are served in the test server. Or you can write your components in your own projects. If you are writing components inthe Evo-WC project then you can run the following command as you make changes and then refresh your browser.

```sh
npm build
```

### Testing

If you are making changes to Evo-wc or any of its library files then you will want to test to make sure you have not broken anything.

If you are adding a new feature you want to make sure that you also include new tests that test out that feature. You may also need to change existing tests depending on what you are adding.

The test framework runs at Node.js using Mocha and Chai. Just run `npm test` to test in node.

You can use the coverage report to help with missed tests, but you must be aware: it only shows if a line of code was evaluated while testing, not if all relevant test cases was done to protect the feature behavior.

While developing you may want to test only on node.js:

```sh
npm test
```

## Collaborators are Welcome
