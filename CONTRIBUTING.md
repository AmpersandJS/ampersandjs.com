# Contributing to the docs site

Thanks for helping out! Just a couple things to know about how this site is put together:

1. Docs in the `/docs` page are pulled in by a script from each module. If you're reporting a documentation issue, please do so in the individual module's README.md rather than here. This helps us keep docs closer to code and since it pulls from last published npm, docs will be up-to-date with what you install from there.

2. The guides at `/learn/*` are built from the markdown files in the `learn_markdown` directory, so make edits there.

3. Other stuff is built from jade files in various folders. 

Don't worry about re-building anything, just send pull requests with edited markdown files, we'll rebuild when we merge and publish, thanks!

Thanks again for making the docs better <3!
