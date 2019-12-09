/**
 * Интерфейс редакторов propertyGrid.
 * @interface Controls/propertyGrid/IEditor
 * @author Герасимов А.М.
 */

/*
 * Interface of editor of PropertyGrid.
 * @interface Controls/propertyGrid/IEditor
 * @author Герасимов А.М.
 */

export default interface IEditor {
    /**
     * @event propertyValueChanged Происходит после изменения значения свойства.
     * @param {Event} event Дескриптор события.
     * @param {*} value Новое значение свойства.
     */

    /*
     * @event propertyValueChanged After property value changed.
     * @param {Event} event Event description.
     * @param {*} value New value of property.
     */
}

/**
 * @name Controls/propertyGrid/IEditor#propertyValue
 * @cfg {*} Текущее значение свойства.
 * 
 * @example
 * WML:
 * <pre>
 * <Controls.dropdown:Input on:selectedKeysChanged="_selectedKeysChanged()" selectedKeys="{{_options.propertyValue}}"/>
 * </pre>
 * 
 * TS:
 * <pre>
 * import { Control, TemplateFunction } from 'UI/Base';
 * import template = require('wmlMyEditor');
 *
 * class MyEditor extends Control implements IEditor {
 *    protected _template: Function = TemplateFunction;
 *
 *    _selectedKeysChanged(event: Event, selectedKeys: Array<number>): void {
 *       this._notify('propertyValueChanged', [selectedKeys], {bubbling: true});
 *    }
 * }
 * 
 * export = MyEditor ; 
 * </pre>
 */
