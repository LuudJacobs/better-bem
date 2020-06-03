# better-BEM 2.x

better-BEM is a dynamic classname generator using [BEM methodology](https://en.bem.info/methodology/quick-start/) (`.block__element--modifier`) which supports [CSS Modules](https://github.com/css-modules/css-modules). better-BEM is [chainable](#Chaining-and-modifier-inheritance) and allows [modifier inheritance](#Chaining-and-modifier-inheritance). **Disclaimer:** In contrast to what the package name suggests, better-BEM _might not actually be better_ than other packages handling BEM classname generation. It definitely is better than better-BEM 1.x.

## Getting Started

### Installing

```shell
# install
npm i better-bem
```

```javascript
// import
import bem from 'better-bem';
```


## Usage

> bem( [_classNames_ [, _mods_ [, _classNameMap_ [, _strict_ [, _glue_ ] ] ] ] ] )

```javascript
const className = bem('article').el('header').mod('large').el('title').mod('red').cn;

document.querySelector('h1').className = className;
// => <h1 class="article__header__title article__header__title--large article__header__title--red"> ...
```

Jump to [examples](#Examples).

### Parameters

#### classNames

Classname(s) which will form the 'block' part of the generated classname(s).

**Optional**

**Default:** `[]`

**Accepts:** _String_, _object_ or _array_ of _strings_ and/or _objects_

Please refer to the [ClassName parameter usage](#ClassName-parameter-usage) section for details on how this parameter works.

#### mods

Modifiers for the generated classnames. Modifiers are passed down the chain, see the section on [Chaining and modifier inheritance](#Chaining-and-modifier-inheritance).

**Optional**

**Default:** `[]`

**Accepts:** _String_, _object_ or _array_ of _strings_ and/or _objects_

See [ClassName parameter usage](#ClassName-parameter-usage) for more details.

#### classNameMap

Object which maps input classnames to output classnames.

**Optional**

**Default:** `{}`

**Accepts:** _Object_

See [using className maps](#Using-CSS-Modules)

#### strict

When strict is true _and_ when classNameMap isn't empty, classnames which aren't mapped in classNameMap will be ignored.

**Optional**

**Default:** `true`

**Accepts:** _Boolean_

See [using className maps](#Using-CSS-Modules)

#### glue

Object with strings which will be used to concat classnames. If not set these fall back to `--` for modifiers, `__` for element classnames and `-` for key-value modifiers. See [examples](#Custom-glue-strings).

**Optional**

**Default:** `{}`

**Accepts:** _Object_

### Return value

> _Object_ { _string_ cn, _function_ el, _function_ mod }

#### cn

Outputted classname string for current BEM chain. **Note:** All classnames are checked for valid characters using the following regular expression: `/^(-[_a-zA-Z]|[_a-zA-Z][-_a-zA-Z0-9])[-_a-zA-Z0-9]*$/`

#### el

> _function_ el( [ _elementClassNames_ ] )

Function to push a new element on the BEM chain. See [chaining](#Chaining-and-modifier-inheritance) for examples.

##### elementClassNames

**Default:** `[]`

**Accepts:** _String_, _object_ or _array_ of _strings_ and/or _objects_

See [ClassName parameter usage](#ClassName-parameter-usage) for more details.

#### mod

> _function_ mod( [ _modifiers_ ] )

Function to add a modifier the current BEM className and all descendants. See [Chaining and modifier inheritance](#Chaining-and-modifier-inheritance) for examples.

##### modifiers

**Default:** `[]`

**Accepts:** _String_, _object_ or _array_ of _strings_ and/or _objects_

See [ClassName parameter usage](#ClassName-parameter-usage) for more details.


## ClassName parameter usage

`bem()`, `el()` and `mod()` all accept the same types of parameters. These types are:

* a _string_ containing a single classname or modifier
* a _string_ containing multiple classnames or modifiers separated by spaces
* an _object_ where the keys are used as classnames or modifiers when the related value is thruthy
  * for `mod()` key-value pairs are mapped as a `key-value` string when the value is a string or a number
* an _array_ containing any of the above

| Parameter value | classnames | modifiers |
| :--- | :--- | :--- |
| `"foobar"` | `"foobar"` | `"--foobar"` |
| `"foo bar"` | `"foo bar"` | `"--foo"`, `"--bar"` |
| `{ foo: true, bar: 0, prop: "value" }` | `"foo mod"` | `"--foo"`, `"--bar-0"`, `"--prop-value"` |
| `[ "foo bar", { prop: "value" } ]` | `"foo bar mod"` | `"--foo"`, `"--bar"`, `"--prop-value"` |


## Examples

### Chaining and modifier inheritance

```javascript
const header = bem('header');
console.log(header.cn); // "header"

const title = header.el('text title');
console.log(title.cn); // "header__text header__title"

const blueTitle = title.mod({ color: 'blue' });
console.log(blueTitle.cn);
// "header__text header__text--color-blue header__title header__title--color-blue"

const emphasizedText = blueTitle.el('emp').mod('bold');
console.log(emphasizedText.cn);
// "header__text__emp header__title__emp header__text__emp--color-blue
//   header__title__emp--color-blue header__text__emp--bold header__title__emp--bold"

// note that modifiers are inherited by child elements
```

### Using CSS Modules

```css
/* styles.css */
.header {
	font-size: 2em;
}

.header__title {
	font-weight: bold;
}

.header__title--blue {
	color: blue;
}
```

```javascript
import styles from './styles.css';

const header = bem('header', 'blue', styles);
console.log(header.cn); // "header"
// note that "header--blue" is omitted from the output, because it's not defined in styles.css

const title = header.el('title');
console.log(title.cn); // "header__title header__title--blue"
// both the base classname and modified classname are outputted, since they are defined in styles.css
// note that the 'blue' modifier is still inherited

const nonStrictHeader = bem('header', 'blue', styles, false);
console.log(nonStrictHeader.cn); // "header header--blue"
// now strict is set to `false`, all classnames will be outputted
```

### Custom glue strings

```javascript
const defaultGlue = bem('element', [{ color: 'blue' }], {}, true).el('child');
console.log(defaultGlue.cn); // "element__child element__child--color-blue"

const customGlue = bem('element', [{ color: 'blue' }], {}, true, { el: '_', mod: '-', prop: '--' }).el('child');
console.log(customGlue.cn); // "element_child element_child-color--blue"
```


## Built With

* [typechecker](https://github.com/bevry/typechecker)
* [array-flatten](https://github.com/blakeembrey/array-flatten)


## Versioning

better-BEM uses [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/LuudJacobs/better-bem/tags).


## Authors

* **Luud Jacobs** [GitHub](https://github.com/LuudJacobs) - [Website](https://luud.dev)


## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details


## Related

* [React-Better-BEM](https://github.com/LuudJacobs/React-Better-BEM) - React component using better-BEM
