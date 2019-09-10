import { isString, isPlainObject } from 'typechecker';

const objectKeysToClassNamesReducer = (acc, classNames) => {
    if (isPlainObject(classNames)) {
        // return object keys for which value is thruthy
        const enabledClassNames = Object.keys(classNames)
        .filter((key) => classNames[key]);

        return [ ...acc, ...enabledClassNames ];
    }
    return [ ...acc, classNames ];
};

const generateClassNamesArray = (input = []) => (
    [input].flat()
        .reduce(objectKeysToClassNamesReducer, [])
        .reduce((acc, className) => (
            isString(className) ? [ ...acc, ...className.split(/\s+/g) ] : acc
        ), [])
);

const combineClassNames = (baseClassNames, extraClassNames, concat = '__') => (
    baseClassNames.reduce((acc, baseCn = '') => ([
        ...acc,
        ...extraClassNames.map((extraCn = '') => `${baseCn}${baseCn && extraCn ? concat : ''}${extraCn}`)
    ]), [])
);

/**
 * BEM classname generator.
 * Creates function which returns a chainable BEM object.
 *
 * @param {string|array}    baseClassName    base classname for block element
 * @param {Object}          cssModuleStyle   CSS modules style object
 *
 * @return {Object} BEM object
 */
const BEM = (baseClassName = [], cssModuleStyle = {}) => {
    const baseClassNames = generateClassNamesArray(baseClassName);

    return {
        get cn() {
            if (isPlainObject(cssModuleStyle) && !isEmptyObject(cssModuleStyle)) {
                const filteredClassNames = baseClassNames.filter((className) => cssModuleStyle[className]);
                return filteredClassNames.join(' ');
            }
            baseClassNames.join(' ');
        },
        el: (elementClassName) => {
            const elementClassNames = generateClassNamesArray(elementClassName);
            const allClassNames = combineClassNames(baseClassNames, elementClassNames);
            return BEM(allClassNames);
        },
        mod: (modifiers) => {
            const modifierClassNames = generateClassNamesArray(modifiers);
            const allClassNames = combineClassNames(baseClassNames, modifierClassNames, '--');
            return BEM(allClassNames);
        }
    };
};

export { BEM };
