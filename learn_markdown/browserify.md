---
pagetitle: Browserify & npm Quickstart
order: 2
---

# Browserify & npm Quickstart

You don't _have_ to use ampersand with browserify (or some other commonjs loader) but that's how we build everything, and we love it.

This is a quick run down of npm and browserify if you haven't used them before.

The below assumes you have [installed npm and node.js](http://nodejs.org/) on your system already.

## npm

[npm](http://npmjs.org) is the official package manager for node.js.

### Starting a new project

If you are starting a project from scratch, create a directory for it on your system somewhere, and run `npm init` from inside it, and follow the instructions (don't worry too much about the answers if you aren't sure yet).

```bash
mkdir my-new-project
cd my-new-project
npm init
```

Once you've done that you'll see a package.json file in your directory:

```json
{
  "name": "my-awesome-project",
  "version": "0.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}
```

This JSON file simply describes your project, and is where you can list any npm dependencies, and their versions, for your project. You'll also need this file if you want to publish your project to npm itself.

### Installing Dependencies

Installing dependencies with npm is really easy. To install ampersand-state run:

```bash
npm install ampersand-state --save
```

This will do a few things:

* Create a `node_modules` directory in your project (if one isn't there) and install `ampersand-state` into it, along with it's dependencies.
* Add a `dependencies` section to your package.json, and add ampersand-state to it:

    ```json
    "dependencies": {
      "ampersand-state": "^4.2.7"
    }
    ```

#### --save and --save-dev

`npm install` takes a number of options, two are `--save` and `--save-dev`.


