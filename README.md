# Please upgrade to better-BEM 2.x

Better-BEM has been upgraded and the 1.x API is incompatible with the new API. Visit the project [here](https://github.com/LuudJacobs/better-bem#readme).

# better-BEM

In contrast to what the package name suggests, better-BEM **may not actually be better** than other packages handling BEM className generation. better-BEM does support className maps as imported with [CSS Modules](https://github.com/css-modules/css-modules).

## Why

A quick Google search for a package which handles dynamic className generation according to [BEM methodology](https://en.bem.info/methodology/quick-start/) (`block__element--modifier`) and which supports className maps didn't yield any results.

## Usage


```bash
# install
npm i better-bem
```

```javascript
// import
import BEM from 'better-bem';
```

```
BEM( classNames [, classNameMap [, strictClassNameMap ] ] )

// output:
{
	 cn,  // string className
	 el,  // function el( classNames )
	 mod, // function mod( classNames )
}
```

### parameters

#### classNames

**default value:** `[]`

**accepts:** _String, object or array of strings and/or objects_

| classNames | `.cn` output |
| :--- | :--- |
| `"foobar"` | `"foobar"` |
| `["foobar", "lorem ipsum"]` | `"foobar lorem ipsum"` |
| `" foo bar "` | `"foo bar"` |
| `{ foo: false, bar: "truthy value" }` | `"bar"` |
| `["foo bar", { lorem: true }, "ipsum"]` | `"foo bar lorem ipsum"` |
| **`mod()` only:** `{ property: "value" }` | `"property-value"` |

#### classNameMap

**default value:** `{}`

**accepts:** _Object with input className to output className mapping_

#### strictClassNameMap

**default value:** `true`

**accepts:** _Boolean_

When classNameMap is not empty and strictClassNameMap is `true` all inputted classNames which aren't in the classNameMap are ignored. When strictClassNameMap is `false` they will be outputted.

| classNames | classNameMap | strictClassNameMap | `.cn` output |
| :--- | :--- | :--- | :--- |
| `"foo bar"` | `{ foo: "output-foo" }` | `true` | `"output-foo"` |
| `"foo bar"` | `{ foo: "output-foo" }` | `false` | `"output-foo bar"` |

## Chaining

```javascript
// Block classname
const block = BEM('block');
block.cn;
// => "block"

// Underlying element classname
const element = block.el('element');
element.cn;
// => "block__element"

const modifiers = ['error', { color: 'red', valid: false }];

// Block classname with modifiers
const modifiedBlock = block.mod(modifiers);
modifiedBlock.cn;
// => "block block--error block--color-red"

const modifiedElement = element.mod(modifiers);
modifiedElement.cn;
// => "block__element block__element--error block__element--color-red"
```
