# Input Markup

## Modules

    ## module

    Description and examples.

## Properties

    ### someClass.someProperty | module.someProperty

    * Type

    The indication of what someProperty is.

## Functions

    ### module.someFunction(x, y, [z=100])

    * `x` {String} the description of the string
    * `y` {Boolean} Should I stay or should I go?
    * `z` {Number} How many zebras to bring.

    A description of the function.

## Classes

    ## Class: SomeClass

    description of the class.

## Methods

    ### Method: SomeClass.classMethod(anArg)

    * `anArg` {Object}  Just an argument
      * `field` {String} anArg can have this field.
      * `field2` {Boolean}  Another field.  Default: `false`.
    * Return: {Boolean} `true` if it worked.

    Description of the method for humans.

## Class Methods

    ### Class Method: SomeClass.classMethod(anArg)

    * `anArg` {Object}  Just an argument
      * `field` {String} anArg can have this field.
      * `field2` {Boolean}  Another field.  Default: `false`.
    * Return: {Boolean} `true` if it worked.

    Description of the method for humans.

## Events

    ### Event: 'grelb'

    * `isBlerg` {Boolean}

    This event is emitted on instances of SomeClass, not on the module itself.

## Stability Ratings

These can show up below any section heading, and apply to that section. Just add
a code block with `Stability: X - status`, as seen below.

There are six stability ratings, ranging from 0 to 5, in order of stability:

```
Stability: 0 - Deprecated.
```

This feature is known to be problematic, and changes are planned. Do not
rely on it. Use of the feature may cause warnings. Backwards compatibility
should not be expected.

```
Stability: 1 - Experimental.
```

This feature was introduced recently, and may change or be removed in
future versions. Please try it out and provide feedback. If it addresses a
use-case that is important to you, tell the dev team.

```
Stability: 2 - Unstable.
```

The API is in the process of settling, but has not yet had sufficient
real-world testing to be considered stable. Backwards-compatibility will be
maintained if reasonable.

```
Stability: 3 - Stable.
```

The API has proven satisfactory, but cleanup in the underlying code may
cause minor changes. Backwards-compatibility is guaranteed.

```
Stability: 4 - API Frozen.
```

This API has been tested extensively in production and is unlikely to ever
have to change.

```
Stability: 5 - Locked.
```

Unless serious bugs are found, this code will not ever
change.  Please do not suggest changes in this area, they will be refused.
