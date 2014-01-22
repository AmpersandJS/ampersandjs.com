# Documentation site for Human JavaScript

This isn't what powers docs.humanjavascript.com yet, but it will be soon.

Uses same doc parsing process as what builds nodejs.org docs. It's markdown with a bit more structured data for things like documenting events and method signatures.

## How to build

Make edits to `index.jade` file.

You can include/parse/process modules by adding lines that look like this to the jade file:

```
@gendoc human-view ../human-view/README.md
        
@gendoc human-model https://raw2.github.com/henrikjoreteg/human-model/master/README.md
```
The first is whatever label you want to give it for the module (used to generate the JSON doc file, etc). 

The second is either a relative file path or a URL to a markdown file. 

Then just do this:

```
npm run build
npm start
open index.html
```

## Why?

Then you can just include readme files from projects into a doc site. That way the official docs are kept with their code, but can still be aggregated into a nice doc site.

## Tricks

You may want something in your github readme that isn't rendered into the site.

Running this build will remove anything between `<!-- starthide -->` and `<!-- endhide -->` comments in the included readmes. This is useful for being able to link to the HTML docs from the readme, etc.

## Credit

<3 to [@lancestout](https://twitter.com/lancestout), [@latent_flip](https://twitter.com/philip_roberts) and node docs for the sweet structured markdown format/parsiing.
