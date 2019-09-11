# better-BEM

## Todo

- README.md
- Finish JSDoc

## Usage

```javascript
import { BEM } from 'better-bem';

const block = BEM('block-classname');
document.querySelector('#target').className = block.cn; // block-classname

const element = b.el('element');
document.querySelector('#target > *').className = element.cn; // block-classname__element

const modifiedBlock = b.mod(['size-large', 'color-red']);
document.querySelector('#target').className = modifiedBlock.cn; // block block--size-large block--color-red
```
