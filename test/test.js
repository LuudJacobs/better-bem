const assert = require('chai').assert;
const BEM = require('../');


describe('BEM', function() {
    it('Should return an object with an function `el()`, function `mod()` and string `cn`', function() {
        const { el, mod, cn } = BEM();
        assert.typeOf(el, 'function');
        assert.typeOf(mod, 'function');
        assert.typeOf(cn, 'string');
    });
    describe('#cn', function() {
        it('Should return a "clean" className string.', function() {
            const _a = BEM('cn second-cn');
            assert.strictEqual(_a.cn, 'cn second-cn');
            const _b = BEM({ 'cn': true, 'second-cn': false, 'third-cn': '_' });
            assert.strictEqual(_b.cn, 'cn third-cn');
            const _c = BEM(['cn', 'second-cn', 'third-cn', { 'fourth-cn': true, 'fifth-cn': 0, 'sixth-cn': '_' }]);
            assert.strictEqual(_c.cn, 'cn second-cn third-cn fourth-cn sixth-cn');
            const _d = BEM(' cn   second-cn        third-cn    ');
            assert.strictEqual(_d.cn, 'cn second-cn third-cn')
        });
        it('Should ignore other types than strings, arrays and objects.', function() {
            const _b = BEM([null, false, { 'cn': true }, 0, [], undefined, 'second-cn']);
            assert.strictEqual(_b.cn, 'cn second-cn');
        });
        it('Should return an empty string when no input is given.', function() {
            const _b = BEM();
            assert.strictEqual(_b.cn, '');
        });
        it('Should return only mapped classNames when classNameMap is given', function() {
            const _b = BEM('cn second-cn third-cn', { 'cn': 'classname', 'third-cn': 'third-classname'});
            assert.strictEqual(_b.cn, 'classname third-classname');
        });
        it('Should return mapped classNames and input classNames when classNameMap is given and strictClassNameMap is false', function() {
            const _b = BEM('cn second-cn third-cn', { 'cn': 'classname', 'third-cn': 'third-classname'}, false);
            assert.strictEqual(_b.cn, 'classname second-cn third-classname');
        });
    });
    describe('#el()', function() {
        it('Should return an object with an function `el()`, function `mod()` and string `cn`', function() {
            const { el, mod, cn } = BEM().el();
            assert.typeOf(el, 'function');
            assert.typeOf(mod, 'function');
            assert.typeOf(cn, 'string');
        });
        describe('#cn', function() {
            it('Should return a element className for each className given to `el()`.', function() {
                const _b = BEM('block-classname').el(['first-element', 'second-element']);
                assert.strictEqual(_b.cn, 'block-classname__first-element block-classname__second-element');
                const _e = BEM().el({ 'first-element': true, 'second-element': false, 'third-element': true });
                assert.strictEqual(_e.cn, 'first-element third-element');
            });
        });
    });
    describe('#mod()', function() {
        it('Should return an object with an function `el()`, function `mod()` and string `cn`', function() {
            const { el, mod, cn } = BEM().mod();
            assert.typeOf(el, 'function');
            assert.typeOf(mod, 'function');
            assert.typeOf(cn, 'string');
        });
        describe('#cn', function() {
            it('Should return the unmodified className and a modified className for each className given to `mod()`', function() {
                const _b = BEM('block').mod(['mod_1', 'mod_2']);
                assert.strictEqual(_b.cn, 'block block--mod_1 block--mod_2');
                const _e = BEM('block').el('element').mod({ 'modifier': true });
                assert.strictEqual(_e.cn, 'block__element block__element--modifier');
                const _v = BEM('block').mod(['mod_1', { 'mod_2': false, 'mod_3': 'value' }]);
                assert.strictEqual(_v.cn, 'block block--mod_1 block--mod_3-value');
            });
        });
    })
});
