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
| `"classname"` | `"classname"` |
| `" classname whitespace-separated "` | `"classname whitepsace-separated"` |
| `{ classname: true, otherClassname: false, anotherClassname: "truthy value" }` | `"classname anotherClassname"` |
| `["classname whitespace-separated", { "another and-another": true }]` | `"classname whitespace-separated another and-another"` |
| **`mod()` only:** `{ "property": "value" }` | `"property-value"` |

### classNameMap

**default value:** `{}`

**accepts:** _Object with input className to output className mapping_

### strictClassNameMap

**default value:** `true`

**accepts:** _Boolean_

When classNameMap is not empty and strictClassNameMap is `true` all inputted classNames which aren't in the classNameMap are ignored. When strictClassNameMap is `false` they will be outputted.

| classNames | classNameMap | strictClassNameMap | `.cn` output |
| :--- | :--- | :--- | :--- |
| `"first second"` | `{ first: "op-first' }` | `true` | `"op-first"` |
| `"first second"` | `{ first: "op-first' }` | `false` | `"op-first second"` |

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
