/*
 * better-BEM
 * (c) Luud Jacobs
 * @license ISC
 */

import { isString, isPlainObject, isEmptyObject, isNumber } from 'typechecker';
import { flatten } from "array-flatten";

const CLASSNAME_REGEX = /^(-[_a-zA-Z]|[_a-zA-Z][-_a-zA-Z0-9])[-_a-zA-Z0-9]*$/;
const GLUE_CHILD = '__';
const GLUE_MOD = '--';
const GLUE_PROP = '-';

/**
 * cleanClassNamesArray
 *
 * @param {string|array|Object} input               classnames which should be cleaned
 * @param {Boolean}             useKeyValuePairs    if true handle prop-value mod classnames
 *
 * @return {array} clean array clean classnames
 */
const cleanClassNamesArray = (input = [], useKeyValuePairs = false, keyValueGlue) => (
    // make sure input is an array
    flatten([input])
        // reduce into new array with classname strings
        .reduce((acc, classNames) => {
            // filter for strings only
            if (isString(classNames)) {
                return [ ...acc, classNames ];
            }

            if (isPlainObject(classNames)) {
                // only use object keys for which value is not false, null or undefined
                let enabledClassNames = Object.keys(classNames).filter((key) => ![false, null, undefined].includes(classNames[key]));

                // for modifiers support `--{prop}-{value}`
                if (useKeyValuePairs) {
                    enabledClassNames = enabledClassNames.map((key) => {
                        const value = classNames[key];
                        if (isString(value) || isNumber(value)) {
                            return `${key}${keyValueGlue}${value}`;
                        }
                        return key;
                    });
                }

                return [ ...acc, ...enabledClassNames ];
            }

            // ignore when not a string or object
            return acc;
        }, [])
        // turn whitespace splitted strings into arrays
        .reduce((acc, className) => ([...acc, ...className.split(/\s+/g)]), [])
        // filter for unique classnames only
        .filter((cn, index, allCn) => allCn.indexOf(cn) === index)
);

/**
 * combineClassNames
 *
 * @param {array}           baseClassNames      base classnames
 * @param {array}           extraClassNames     extra classnames to be added
 * @param {string}          glue                string to be used to glue the 2 together
 *
 * @return {array} array with combined classnames
 */
const combineClassNames = (baseClassNames = [], extraClassNames = [], glue = '') => {
    return flatten(extraClassNames.map((extraCn) => {
        if (!baseClassNames.length) {
            return extraCn;
        }

        return baseClassNames.map((baseCn) => `${baseCn}${baseCn && extraCn ? glue : ''}${extraCn}`);
    }));
};

/**
 * createElementClassNames
 * create an array with element classnames based on baseclassnames
 *
 * @param {array}           baseClassNames      base classnames
 * @param {array}           elementClassNames   element classnames
 * @param {string}          glue                string used to concat classnames
 *
 * @return {array} array with element classnames
 */
const createElementClassNames = (baseClassNames = [], elementClassNames = [], glue = GLUE_CHILD) => {
    baseClassNames = cleanClassNamesArray(baseClassNames);
    elementClassNames = cleanClassNamesArray(elementClassNames);

    if (!elementClassNames.length) {
        return [];
    }

    return combineClassNames(baseClassNames, elementClassNames, glue);
};

/**
 * addModifiedClassNames
 *
 * @param {array}           elementClassNames   element classnames to be modified
 * @param {array}           modifierClassNames  modifier classnames
 * @param {string}          glue                string used to concat classnames
 *
 * @return {array} array with element classnames and modified classnames
 */
const addModifiedClassNames = (elementClassNames = [], modifierClassNames = [], modGlue = GLUE_MOD, propGlue = GLUE_PROP) => {
    elementClassNames = cleanClassNamesArray(elementClassNames);
    modifierClassNames = cleanClassNamesArray(modifierClassNames, true, propGlue);

    if (!elementClassNames.length) {
        return [];
    }

    const modifiedClassNames = combineClassNames(elementClassNames, modifierClassNames, modGlue);

    return [ ...elementClassNames, ...modifiedClassNames ];
};

/**
 * bem classname generator.
 * Creates function which returns a chainable bem object.
 *
 * @param {string|array|Object} classNames      base classname(s)
 * @param {string|array|Object} mods            modifier classname(s)
 * @param {Object}              classNameMap    CSS modules style object
 * @param {Boolean}             strict          if true don't output classnames which don't appear in classNameMap
 * @param {Object}              glue            glue used for classname concatenation
 *
 * @return {Object} bem object
 */
const bem = (classNames = [], mods = [], classNameMap = {}, strict = true, glue = {}) => {
    return {
        get cn() {
            let outputtedClassNames = addModifiedClassNames(classNames, mods, glue.mod, glue.prop);
            outputtedClassNames = outputtedClassNames.filter((cn) => CLASSNAME_REGEX.test(cn));

            if (isPlainObject(classNameMap) && !isEmptyObject(classNameMap)) {
                switch (strict) {
                    case false: {
                        outputtedClassNames = outputtedClassNames
                            .map((className) => classNameMap[className] || className);
                        break;
                    }
                    // case true:
                    default: {
                        outputtedClassNames = outputtedClassNames
                            .map((className) => classNameMap[className])
                            .filter((moduleClassName) => moduleClassName !== undefined);
                    }
                }
            }

            return outputtedClassNames.join(' ');
        },
        el: (elements = []) => {
            const elementClassNames = createElementClassNames(classNames, elements, glue.el);
            return bem(elementClassNames, mods, classNameMap, strict, glue);
        },
        mod: (modifiers = []) => {
            const passedMods = flatten([mods]).concat(modifiers);
            return bem(classNames, passedMods, classNameMap, strict, glue);
        }
    };
};

export default bem;
