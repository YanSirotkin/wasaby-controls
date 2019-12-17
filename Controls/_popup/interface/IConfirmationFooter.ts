import { IOpener } from 'Controls/_popup/interface/IBaseOpener';

/**
 * Интерфейс для опций футера диалога подтверждения.
 *
 * @interface Controls/_popup/interface/IConfirmation
 * @public
 * @author Красильников А.С.
 */

export interface IConfirmationFooterOptions {
    type?: string;
    yesCaption?: string;
    noCaption?: string;
    cancelCaption?: string;
    primaryAction?: string;
    okCaption?: string;
}

export interface IConfirmationFooter extends IOpener {
    readonly '[Controls/_popup/interface/IConfirmationFooter]': boolean;
}

/**
 * @name Controls/_popup/interface/IConfirmationFooter#type
 * @cfg {String} Тип диалогового окна. Определяет с каким результатом будет закрыто окно диалога.
 * @variant ok (Результат: undefined)
 * @variant yesno (Результат: true/false)
 * @variant yesnocancel (Результат: true/false/undefined)
 * @default yesno
 */

/**
 * @name Controls/_popup/interface/IConfirmationFooter#style
 * @cfg {String} Внешний вид диалога подтверждения.
 * @variant default
 * @variant success
 * @variant danger
 * @default default
 */

/**
 * @name Controls/_popup/interface/IConfirmationFooter#yesCaption
 * @cfg {String} Текст кнопки подтверждения.
 * @default Да
 */

/**
 * @name Controls/_popup/interface/IConfirmationFooter#noCaption
 * @cfg {String} Текст кнопки отрицания
 * @default Нет
 */

/**
 * @name Controls/_popup/interface/IConfirmationFooter#cancelCaption
 * @cfg {String} Текст кнопки отмены
 * @default Отмена
 */

/**
 * @name Controls/_popup/interface/IConfirmation#primaryAction
 * @cfg {String} Определяет, какая кнопка будет активирована по нажатию ctrl+enter
 * @variant yes
 * @variant no
 * @default yes
 */

/**
 * @name Controls/_popup/interface/IConfirmationFooter#okCaption
 * @cfg {String} Текст кнопки "принять"
 * @default ОК
 */
