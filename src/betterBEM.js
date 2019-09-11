import { isString, isPlainObject, isEmptyObject } from 'typechecker';

const objectKeysToClassNamesReducer = (acc, classNames) => {
    if (isPlainObject(classNames)) {
        // return object keys for which value is thruthy
        const enabledClassNames = Object.keys(classNames).filter((key) => classNames[key]);

        return [ ...acc, ...enabledClassNames ];
    }
    return [ ...acc, classNames ];
};

const generateClassNamesArray = (input = []) => (
    [input].flat()
        .reduce(objectKeysToClassNamesReducer, [])
        .reduce((acc, className) => (
            isString(className) ? [
                ...acc,
                ...className.split(/\s+/g).filter((str) => str)
            ] : acc
        ), [])
);

// not perfect yet
const combineClassNames = (baseClassNames, extraClassNames, concat = '__') => {
    if (!baseClassNames.length) {
        return extraClassNames;
    }
    if (!extraClassNames.length) {
        return baseClassNames;
    }
    return baseClassNames.reduce((acc, baseCn = '') => ([
        ...acc,
        ...extraClassNames.map((extraCn = '') => `${baseCn}${baseCn && extraCn ? concat : ''}${extraCn}`)
    ]), [])
};

/**
 * BEM classname generator.
 * Creates function which returns a chainable BEM object.
 *
 * @param {string|array}    baseClassName       base classname for block element
 * @param {Object}          classNameMap        CSS modules style object
 * @param {Boolean}         strictClassNameMap  if true drops classNames which don't appear in classNameMap
 *
 * @return {Object} BEM object
 */
const BEM = (baseClassName = [], classNameMap = {}, strictClassNameMap = true) => {
    const baseClassNames = generateClassNamesArray(baseClassName);

    return {
        get cn() {
            if (isPlainObject(classNameMap) && !isEmptyObject(classNameMap)) {
                let filteredClassNames;
                switch (strictClassNameMap) {
                    case false: {
                        filteredClassNames = baseClassNames
                            .map((className) => classNameMap[className] || className);
                        break;
                    }
                    // case true:
                    default: {
                        filteredClassNames = baseClassNames
                            .map((className) => classNameMap[className])
                            .filter((moduleClassName) => moduleClassName);
                    }
                }
                return filteredClassNames.join(' ');
            }

            return baseClassNames.join(' ');
        },
        el: (elementClassName = []) => {
            const elementClassNames = generateClassNamesArray(elementClassName);
            const allClassNames = combineClassNames(baseClassNames, elementClassNames);
            return BEM(allClassNames, classNameMap, strictClassNameMap);
        },
        mod: (modifiers = []) => {
            const modifierClassNames = generateClassNamesArray(modifiers);
            const allModifiedClassNames = combineClassNames(baseClassNames, modifierClassNames, '--');
            const allClassNames = [ ...baseClassNames, ...allModifiedClassNames ];
            return BEM(allClassNames, classNameMap, strictClassNameMap);
        }
    };
};

export { BEM };
