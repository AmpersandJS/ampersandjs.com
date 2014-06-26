# Documentation site for ampersand.js

This generates the static site that lives here: http://ampersandjs.com/

## How it works

The dynamic portions of the site are pulled down from The Internet™. 

Specifically, we use [module-details](https://github.com/HenrikJoreteg/module-details) to fetch and parse complete info about a module from the npm registry.

The specific modules that get include listed and read from the package.json file in this repository.

As of this writing the relevant portion looks like this:

```json
  ...
  "coreModules": [
    "ampersand",
    "ampersand-state",
    "ampersand-model",
    "ampersand-collection",
    "ampersand-rest-collection",
    "ampersand-view",
    "ampersand-view-switcher",
    "ampersand-router"
  ],
  "formModules": [
    "ampersand-form-view",
    "ampersand-input-view",
    "ampersand-checkbox-view",
    "ampersand-array-input-view",
    "ampersand-select-view"
  ],
  "featuredModules": [
    "bows",
    "emoji-images",
    "getusermedia"
  ],
  ...
```

The core and form modules are all fetched and dates compared to figure out which are in fact, the most "recent" for use in the home page "recently released" seciton. 

The featured modules are grabbed and rendered in order listed in the "featuredModules" section.

So, updating "recent" doesn't require anything other than running the build script.

Updating featured, just requires picking 3 modules, they will be shown in the order they're listed.


## The "docs" pages

These are built entirely from README.md files of the listed projects. They're run through a filter that removes hidden sections (such as "browser support" and "license"), and we also remove anything in between html comments in README's that look like this:

```html
<!-- starthide -->
This text will not show up in generated docs
<!-- endhide -->
```

It's then converted to HTML and rendered using the jade templates. 

Perhaps a bit convoluted, but works well enough.

## The "learn" pages

These are all in markdown in the `learn_markdown` directory. There's a bit of metadata at the top.

This is the page title (used to generate what the nav calls it) and an `order` value that will be used to sort them all. 

These don't have to be sequential and nothing will blow up if there are two that are the same or whatnot, they're simply run through a sorter that uses that value to attempt to sort them.

#### Adding a video

To add a video embed from Vimeo or YouTube, please wrap the `iframe` with a `div.video-container`.

Be sure the iframe does not have a set `width` or `height`.

## Running that fabled "build" script

```
npm run build
```

Using something like `http-server` from npm will make working on the docs a bit easiser, because links will work properly.

install it like so:

```
npm i -g http-server
```

There's a quick and dirty `-w` option that will rebuild if anything changes:

```
npm run build -w 
```

So you can have that in one terminal tab, and just run `http-server` in the root project directory in another tab and you're up and running.
