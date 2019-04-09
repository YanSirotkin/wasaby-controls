import Control = require('Core/Control');
import template = require('wml!Controls/_propertyGrid/defaultEditors/String');

import IEditorOptions from 'Controls/_propertyGrid/IEditorOptions';
import IEditor from 'Controls/_propertyGrid/IEditor';

// @ts-ignore
class StringEditor extends Control implements IEditor {
    protected _template: Function = template;
    protected _options: IEditorOptions;

    private value: string = '';
    private initialValue: string = '';

    _beforeMount(options: IEditorOptions): void {
        this.value = options.propertyValue;
        this.initialValue = options.propertyValue;
    }

    _inputCompleted(event: Event, value: string): void {
        if (this.initialValue !== value) {
            this._notify('propertyValueChanged', [value], {bubbling: true});
        }
    }
}

export = StringEditor;
