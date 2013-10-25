modules.define('i-bem__dom', ['jquery', 'next-tick', 'tick', 'idle'],
    function(provide, $, nextTick, tick, idle, DOM) {

var instances,
    update = function () {
        var instance, i = 0;
        while(instance = instances[i++]) instance.val(instance.elem('control').val());
    },
    getActiveElement = function (doc) {
        // В iframe в IE9: "Error: Unspecified error."
        try { return doc.activeElement } catch (e) {}
    };

/**
 * @namespace
 * @name Block
 */
provide(DOM.decl('input', /** @lends Block.prototype */ {

    onSetMod : {

        'js' : {

            'inited': function() {

                var _this = this,
                    input = _this.elem('control'),
                    activeElement = getActiveElement(_this.__self.doc[0]),
                    haveToSetAutoFocus =
                        _this.params.autoFocus &&
                            !(activeElement && $(activeElement).is('input, textarea'));

                _this._val = input.val();

                if (activeElement === input[0] || haveToSetAutoFocus) {
                    _this.setMod('focused', 'yes')._focused = true;
                }

                if(!instances) {
                    instances = [];
                    if (!idle.isIdle()) {
                        tick.on('tick', update);
                    }
                    idle.on({
                        'idle' : function() {
                            tick.un('tick', update);
                        },
                        'wakeup' : function() {
                            tick.on('tick', update);
                        }
                    });
                }

                // сохраняем индекс в массиве инстансов чтобы потом быстро из него удалять
                _this._instanceIndex = instances.push(
                    _this.bindTo(input, {
                        focus : _this._onFocus,
                        blur  : _this._onBlur
                    })
                ) - 1;

                _this
                    .on('change', _this._updateClear)
                    ._updateClear();
            },

            '' : function() {

                this.params.shortcut && this.unbindFromDoc('keydown');
                instances.splice(this._instanceIndex, 1);

                var i = this._instanceIndex,
                    instance;

                while(instance = instances[i++]) --instance._instanceIndex;
            }
        },

        'disabled' : function(modName, modVal) {

            this.elem('control').attr('disabled', modVal === 'yes');

        },

        'focused' : function(modName, modVal) {

            if(this.hasMod('disabled', 'yes'))
                return false;

            var focused = modVal == 'yes';

            focused?
                this._focused || this._focus() :
                this._focused && this._blur();

            var _this = this;
            nextTick(function() {
                _this.trigger(focused? 'focus' : 'blur');
            });

        }

    },

    // TODO: вынести в __message
    onElemSetMod : {

        'message' : {

            'visibility' : function(elem, modName, modVal) {

                var _this = this,
                    type = _this.getMod(elem, 'type');

                if(type) {
                    var needSetMod = true;
                    modVal || _this.elem('message', 'type', type).each(function() {
                        this != elem[0] && _this.hasMod($(this), 'visibility', 'visible') && (needSetMod = false);
                    });
                    needSetMod && _this.toggleMod('message-' + type, 'yes', '', modVal === 'visible');
                }

            }

        }

    },

    _onClearClick : function() {

        this.trigger('clear');
        this.removeInsets &&
            this.removeInsets();

        this
            .val('')
            .setMod('focused', 'yes');

    },

    _updateClear : function() {

        return this.toggleMod(this.elem('clear'), 'visibility', 'visible', '', !!this._val);

    },

    isDisabled : function() {

        return this.hasMod('disabled', 'yes');

    },

    /**
     * Возвращает/устанавливает текущее значение
     * @param {String} [val] значение
     * @param {Object} [data] дополнительные данные
     * @returns {String|BEM} если передан параметр val, то возвращается сам блок, если не передан -- текущее значение
     */
    val : function(val, data) {

        if(typeof val == 'undefined') return this._val;

        if(this._val != val) {
            var input = this.elem('control');
            input.val() != val && input.val(val);
            this._val = val;
            this.trigger('change', data);
        }

        return this;

    },

    /**
     * @see http://stackoverflow.com/questions/4185821#4186100
     * @return {Number} Позиция конца выделения. Если ничего не выделено, то возвращается 0.
     */
    getSelectionEnd : function() {
        var input = this.elem('control')[0],
            end = 0;
        if(typeof(input.selectionEnd) == 'number') {
            end = input.selectionEnd;
        } else {
            var range = document.selection.createRange();
            if(range && range.parentElement() == input) {
                var len = input.value.length,
                    textInputRange = input.createTextRange();
                textInputRange.moveToBookmark(range.getBookmark());

                var endRange = input.createTextRange();
                endRange.collapse(false);
                end = textInputRange.compareEndPoints('EndToEnd', endRange) > -1 ?
                    len :
                    -textInputRange.moveEnd('character', -len);
            }
        }
        return end;
    },

    name : function(name) {

        return this.elem('control').attr('name');

    },

    _onFocus : function() {

        this._focused = true;
        return this.setMod('focused', 'yes');

    },

    _onBlur : function() {

        this._focused = false;
        return this.delMod('focused');

    },

/**
     * Выставляем фокус для элемента control
     * @private
     */
    _focus : function() {
        this.elem('control').focus();
    },

    _blur : function() {

        this.elem('control').blur();

    }

}, {

    live : function() {

        this.liveBindTo('clear', 'leftclick', function() {
            this._onClearClick();
        });

        return false;

    }
}));

});
