import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import counterTemplate = require('wml!Controls/_heading/Counter/Counter');
import {descriptor as EntityDescriptor} from 'Types/entity';

export interface ICounterOptions extends IControlOptions {
    style?: 'primary' | 'secondary' | 'disabled';
    size?: 's' | 'm' | 'l';
}

/**
 * Счетчик с поддержкой различных стилей отображения и размеров.
 * @remark
 * Используется в составе сложных заголовков, состоящих из {@link Controls/heading:Separator} и {@link Controls/heading:Counter}.
 *
 * <a href="/materials/demo-ws4-header-separator">Демо-пример</a>.
 *
 * @class Controls/_heading/Counter
 * @extends Core/Control
 * @control
 * @public
 * @author Красильников А.С.
 *
 * @demo Controls-demo/Heading/Counters/Index
 */

/*
 * Counter with support different display styles and sizes. Used as part of complex headers(you can see it in Demo-example)
 * consisting of a <a href="/docs/js/Controls/_heading/?v=3.18.500">header</a>, a <a href="/docs/js/Controls/_heading/Separator/?v=3.18.500">header-separator</a> and a <a href="/docs/js/Controls/Button/Separator/?v=3.18.500">button-separator</a>.
 *
 * <a href="/materials/demo-ws4-header-separator">Demo-example</a>.
 *
 * @class Controls/_heading/Counter
 * @extends Core/Control
 * @control
 * @public
 * @author Красильников А.С.
 *
 * @demo Controls-demo/Heading/Counters/Index
 */

/**
 * @name Controls/_heading/Counter#size
 * @cfg {String} Размер счетчика.
 * @variant l Большой счетчик.
 * @variant m Средний счетчик.
 * @variant s Маленький счетчик.
 * @default m
 */

/*
 * @name Controls/_heading/Counter#size
 * @cfg {String} Size of Counter.
 * @variant l Large counter size.
 * @variant m Medium counter size.
 * @variant s Small counter size.
 * @default m
 */

/**
 * @name Controls/_heading/Counter#style
 * @cfg {String} Стиль отображения счетчика.
 * @variant primary
 * @variant secondary
 * @variant disabled
 * @default primary
 */

/*
 * @name Controls/_heading/Counter#style
 * @cfg {String} Counter displaying style.
 * @variant primary
 * @variant secondary
 * @variant disabled
 * @default primary
 */

class Counter extends Control<ICounterOptions> {
    protected _template: TemplateFunction = counterTemplate;

    static _theme: string[] = ['Controls/heading'];

    static getDefaultOptions(): object {
        return {
            style: 'primary',
            size: 'm'
        };
    }

    static getOptionTypes(): object {
        return {
            value: EntityDescriptor(Number),
            style: EntityDescriptor(String).oneOf([
                'primary',
                'secondary',
                'disabled'
            ]),
            size: EntityDescriptor(String).oneOf([
                'm',
                's',
                'l'
            ])
        };
    }
}

export default Counter;
