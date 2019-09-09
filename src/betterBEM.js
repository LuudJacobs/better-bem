import { isString, isPlainObject } from 'typechecker';

/**
 * betterBEM factory function.
 * Creates function which returns classname string
 *
 * @param {string} blockClassName   base classname for block element
 * @param {Object} cssModuleStyle   CSS modules style object
 *
 * @since 1.0.0
 * @return {function} bemify function
 */
const betterBEM = (blockClassName = null, cssModuleStyle = {}) => {

    return (elementClassName = null, modifiers = [], extraClassNames = []) => {
        /** blockClassName is valid when its a non empty string. */
        const blockClassNameIsValid = isString(blockClassName) && blockClassName;
        /** elementClassName is valid when its a non empty string. */
        const elementClassNameIsValid = isString(elementClassName) && elementClassName;

        const baseClassName = blockClassNameIsValid && elementClassNameIsValid ?
            `${blockClassName}__${elementClassName}` :
                blockClassNameIsValid ? blockClassName :
                    elementClassNameIsValid ? elementClassName : null;

        if (typeof modifiers === 'string') {
            modifiers = modifiers.split(/\s+/g);
        }

        const modifierClassNames = modifiers
            // first get valid modifiers
            .reduce((acc, modifier) => {
                if (isPlainObject(modifier)) {
                    // if modifier is an Object check, add modifier classnames
                    // from keys for which value is thruthy
                    const modifiers = Object.keys(modifier)
                        .filter((modifierName) => modifier[modifierName]); // filter only thruthy values
                    return [ ...acc, ...modifiers ];
                } else if (isString(modifier) && modifier) {
                    // if modifier is a non empty string, add it to modifiers accumulator
                    return [ ...acc, modifier ];
                }
                // else just return current modifiers accumulator
                return acc;
            }, []);

        const bemClassNames = isString(baseClassName) ?
            modifierClassNames.map((modifier) => `${baseClassName}--${modifier}`) :
                modifierClassNames.slice();

        if (isPlainObject(cssModuleStyle) && !isEmptyObject(cssModuleStyle)) {

        }
    }
};

export { betterBEM };

function cnFactory(localStyles = {}) {
    const styles = { ...globalStyles, ...localStyles };
    return function(classNames = [], modifiers = [], extraClassNames = []) {
        classNames = [classNames].flat();
        modifiers = [modifiers].flat();
        extraClassNames = [extraClassNames].flat();

        return classNames
            .concat(modifiers.map(modifier => classNames.map(baseClassName => `${baseClassName}--${modifier}`)).flat())
            .map(cn => styles[cn])
            .concat(extraClassNames)
            .filter(cn => cn)
            .join(' ');
    };
};
