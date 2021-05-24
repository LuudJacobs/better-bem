/*
 * better-BEM
 * (c) Luud Jacobs
 * @license ISC
 */

import { isString, isPlainObject, isEmptyObject, isNumber } from 'typechecker';
import { flatten } from 'array-flatten';

type ClassName = string | Record<string, any>;
type ClassNames = ClassName | ClassName[];
type CSSModulesObject = Record<string, any>;

type BEM = {
  el: (elements: ClassNames) => BEM,
  mod: (modifiers: ClassNames) => BEM,
  cn: string
}

type Glue = {
  mod?: string;
  el?: string;
  prop?: string;
}

const CLASSNAME_REGEX = /^(-[_a-zA-Z]|[_a-zA-Z][-_a-zA-Z0-9])[-_a-zA-Z0-9]*$/;
const GLUE_CHILD = '__';
const GLUE_MOD = '--';
const GLUE_PROP = '-';

/**
 * cleanClassNamesArray
 *
 * @param input               classnames which should be cleaned
 * @param useKeyValuePairs    if true handle prop-value mod classnames
 *
 * @return clean array clean classnames
 */
const cleanClassNamesArray = (input: ClassNames = [], useKeyValuePairs = false, keyValueGlue = ''): string[] => (
    // make sure input is an array
    flatten([input])
        // reduce into new array with classname strings
        .reduce<string[]>((acc, classNames) => {
            // filter for strings only
            if (isString(classNames) && typeof classNames == 'string') {
                return [ ...acc, classNames ];
            }

            if (isPlainObject(classNames) && typeof classNames == 'object') {
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
        .reduce<string[]>((acc, className) => ([...acc, ...className.split(/\s+/g)]), [])
        // filter for unique classnames only
        .filter((cn, index, allCn) => allCn.indexOf(cn) === index)
);

/**
 * combineClassNames
 *
 * @param baseClassNames      base classnames
 * @param extraClassNames     extra classnames to be added
 * @param glue                string to be used to glue the 2 together
 *
 * @return array with combined classnames
 */
const combineClassNames = (baseClassNames: string[] = [], extraClassNames: string[] = [], glue = ''): string[] => {
    return flatten(extraClassNames.map((extraCn) => {
        if (!baseClassNames.length) {
            return extraCn;
        }

        return baseClassNames.map((baseCn) => `${baseCn}${baseCn && extraCn ? glue : ''}${extraCn}`);
    }));
};

/**
 * createElementClassNames
 * create an array with element classnames based on baseClassNames
 *
 * @param baseClassNames      base classnames
 * @param elementClassNames   element classnames
 * @param glue                string used to concat classnames
 *
 * @return array with element classnames
 */
const createElementClassNames = (baseClassNames: ClassNames = [], elementClassNames: ClassNames = [], glue = GLUE_CHILD): string[] => {
    const cleanBaseClassNames = cleanClassNamesArray(baseClassNames);
    const cleanElementClassNames = cleanClassNamesArray(elementClassNames);

    if (!elementClassNames.length) {
        return [];
    }

    return combineClassNames(cleanBaseClassNames, cleanElementClassNames, glue);
};

/**
 * addModifiedClassNames
 *
 * @param elementClassNames   element classnames to be modified
 * @param modifierClassNames  modifier classnames
 * @param modGlue             string used to concat modifiers
 * @param propGlue            string used to concat classnames
 *
 * @return array with element classnames and modified classnames
 */
const addModifiedClassNames = (
  elementClassNames: ClassNames = [],
  modifierClassNames: ClassNames = [],
  modGlue = GLUE_MOD,
  propGlue = GLUE_PROP
): string[] => {
    const cleanElementClassNames = cleanClassNamesArray(elementClassNames);
    const cleanModifierClassNames = cleanClassNamesArray(modifierClassNames, true, propGlue);

    if (!elementClassNames.length) {
        return [];
    }

    const modifiedClassNames = combineClassNames(cleanElementClassNames, cleanModifierClassNames, modGlue);

    return [ ...cleanElementClassNames, ...modifiedClassNames ];
};

/**
 * bem classname generator.
 * Creates function which returns a chainable bem object.
 *
 * @param classNames      base classname(s)
 * @param mods            modifier classname(s)
 * @param classNameMap    CSS modules style object
 * @param strict          if true don't output classnames which don't appear in classNameMap
 * @param glue            glue used for classname concatenation
 *
 * @return bem object
 */
const bem = (
  classNames: ClassNames = [],
  mods: ClassNames = [],
  classNameMap: CSSModulesObject = {},
  strict = true,
  glue: Glue = {}
): BEM => {
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
