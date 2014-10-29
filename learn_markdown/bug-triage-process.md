---
pagetitle: Bug triage process
order: 11
---

# Bug Triage Process

We use github issues for bugs, issues, concerns, questions from users. We also have a [public trello board](https://trello.com/b/UxylNzHr/ampersand-js-roadmap) to track higher level items and to let people vote on issues.

When reporting bugs, they should be opened as a new issue *on the individual repository where the issue is believed to be.*

Those with contributor access can all help triage bugs and they'll follow these steps:

1. Read it thoroughly.
1. Add relevant labels from list below.
1. Has this been brought up before? 
    - nicely point out that there's an existing discussion
    - add a link to relevant issue (open or closed)
    - close
1. Is this security related?
    - label accordingly
    - file a vulnerability report to: [http://nodesecurity.io/](http://nodesecurity.io/)
1. Think hard about whether this is something that would be good for a new contributor, if it is, add as much detail as you can to help, then label it as such.

Most importantly, **bug triagers should always be nice**. We're grateful to know about issues, so if anybody responds rudely, please contact Henrik by email [henrik@andyet.net](mailto:henrik@andyet.com). We're committed to making this whole process as inclusive and friendly as possible.


## Pull requests

It's recommended, though not required, to [jump into chat](https://gitter.im/AmpersandJS/AmpersandJS) or open an issue before you take the time to write a pull request.

PRs are issues too and thus will receive a similar treatment.

Changes to repos should all happen via pull requests, even from core contributors.

All PRs should have 2 +1's from core contributors unless:

- They're for documentation or typo fixes
- They're just adding tests
- They're updating dev dependencies

In which case a judgement call will be made by core team whether to just merge them.

## Releases

We do our best to adhere strictly to [semver](http://semver.org/) throughout the project. This is crucial to the architectural approach we're taking with Ampersand.

Most merged pull requests will be published to [npm](http://npmjs.org/) immediately unless we're bundling up a few fixes for releases.

Many small documentation fixes don't justify a release, in which case we'll just merge them to the master branch and leave them there. We'll leave a comment with the version number of the npm release that contains the merged code.


## Issue labels we use

We use the following labels on issues, these will get programmatically applied by a bot to all projects in the [AmpersandJS organization](https://github.com/ampersandjs) on github:


`breaking changes`: Will change existing behavior, necessistates a major version bump per semver conventions

`bug`: It's broke, yo.

`dependency`: Changes/updates a dependency

`discussion`: Needs discussion or was opened for discussion.

`documentation`: Improves docs (we love this).

`enhancement`: Adds feature or improves functionality.

`example`: Adds example.

`help wanted`: We'd love help with this one, open for contributions and it's not yet been assigned.

`new contributor`: This is a good one for a new contributor to tackle. (note to contributors, if triaging and adding this label, please try to add as much detail/instruction as possible to help new contributor be successful).

`non-issue`: Assumed that this behavior isn't actually an issue.

`question`: This is a question, not a bug.

`release notes`: Related to adding or needing release notes.

`request`: This is a request for help or a for a feature.

`security`: This is a security related fix or concern.

`test`: Fixing/improving test coverage

