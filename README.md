# Documentation site for ampersand.js

Uses same doc parsing process as what builds nodejs.org docs. It's markdown with a bit more structured data for things like documenting events and method signatures.

## How to build

Make edits to `index.jade` file.

You can include/parse/process modules by adding lines that look like this to the jade file:

```
@gendoc ampersand-view ../ampersand-view/README.md
        
@gendoc ampersand-model https://raw.githubusercontent.com/AmpersandJS/ampersand-model/master/README.md
```
The first is whatever label you want to give it for the module (used to generate the JSON doc file, etc). 

The second is either a relative file path or a URL to a markdown file. 

Then just do this:

```
npm run build
npm start
open index.html
```

**Important**
To build this site, you will need the following repositories and place them in the same directory as ampersandjs.com to be able to build:

- [ampersand-model](https://github.com/AmpersandJS/ampersand-model)
- [ampersand-state](https://github.com/AmpersandJS/ampersand-state)
- [ampersand-collection](https://github.com/AmpersandJS/ampersand-collection)
- [ampersand-rest-collection](https://github.com/AmpersandJS/ampersand-rest-collection)
- [ampersand-sync](https://github.com/AmpersandJS/ampersand-sync)
- [ampersand-view](https://github.com/AmpersandJS/ampersand-view)
- [ampersand-router](https://github.com/AmpersandJS/ampersand-router)
- [ampersand-registry](https://github.com/AmpersandJS/ampersand-registry)

## Why?

Then you can just include readme files from projects into a doc site. That way the official docs are kept with their code, but can still be aggregated into a nice doc site.

## Tricks

You may want something in your github readme that isn't rendered into the site.

Running this build will remove anything between `<!-- starthide -->` and `<!-- endhide -->` comments in the included readmes. This is useful for being able to link to the HTML docs from the readme, etc.

## Credit

<3 to [@lancestout](https://twitter.com/lancestout), [@latent_flip](https://twitter.com/philip_roberts) and node docs for the sweet structured markdown format/parsiing.
