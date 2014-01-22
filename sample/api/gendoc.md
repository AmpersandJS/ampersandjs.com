# GenDoc

    Stability: 2 - Unstable.


## gendoc(filePath, pkgInfo, format, [template])

* `filePath` {String} The file path of the file being transformed (for finding includes).
* `pkgInfo`  {Object} A description of the project, such as `package.json`.
  * `name`    {String} The name of the project.
  * `version` {String} The current version of the project.
* `format`   {String} Either `html` or `json`.
* `template` {String} The template string to use for the final HTML rendering.
* Return: {Promise String}

Use `var gendoc = require('gendoc');` to use this module.

The GenDoc module allows you to convert markdown documention into
either templatized HTML or JSON.


## Command Line Usage

    Stability: 2 - Unstable.

To run `gendoc` from the command line:

    $ gendoc filename [--template=templatefilename] \
                      [--format=html|json] \
                      [--package=packagefilename]
