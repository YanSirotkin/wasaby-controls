/**
 * Created by iv.cheremushkin on 28.08.2014.
 */

define('js!SBIS3.CONTROLS.PasswordTextBox', [
   "Core/compatibility",
   "js!SBIS3.CONTROLS.TextBox",
   "tmpl!SBIS3.CONTROLS.PasswordTextBox/resources/showPasswordTemplate",
   'css!SBIS3.CONTROLS.PasswordTextBox'
], function (compatibility, TextBox, showPasswordTemplate) {

   'use strict';
   /**
    * Поле ввода пароля.
    * @class SBIS3.CONTROLS.PasswordTextBox
    * @extends SBIS3.CONTROLS.TextBox
    * @author Крайнов Дмитрий Олегович
    * @demo SBIS3.CONTROLS.Demo.MyPasswordTextBox
    *
    * @ignoreOptions independentContext contextRestriction isContainerInsideParent owner stateKey subcontrol textTransform
    * @ignoreOptions element linkedContext handlers parent autoHeight autoWidth horizontalAlignment verticalAlignment
    *
    * @ignoreMethods applyEmptyState applyState findParent getAlignment getEventHandlers getEvents getExtendedTooltip
    * @ignoreMethods getId getLinkedContext getMinHeight getMinSize getMinWidth getOwner getOwnerId getParentByClass
    * @ignoreMethods getParentByName getParentByWindow getStateKey getTopParent getUserData hasEvent hasEventHandlers
    * @ignoreMethods isDestroyed isSubControl makeOwnerName once sendCommand setOwner setStateKey setUserData setValue
    * @ignoreMethods subscribe unbind unsubscribe
    *
    * @ignoreEvents onDragIn onDragMove onDragOut onDragStart onDragStop onStateChanged onTooltipContentRequest onChange
    * @ignoreEvents onReady
    *
    * @public
    * @category Input
    * @control
    */
   var PasswordTextBox;
   PasswordTextBox = TextBox.extend(/** @lends SBIS3.CONTROLS.PasswordTextBox.prototype */ {
      $protected: {
         _options: {
            afterFieldWrapper: showPasswordTemplate,
            type: "password",
            /**
             * @cfg {Boolean} Определяет режим просмотра введенного пароля
             * * true Показать иконку просмотра пароля.
             * * false Скрыть иконку просмотра пароля.
             */
            showPassword: false
         }
      },

      init: function() {
         PasswordTextBox.superclass.init.apply(this, arguments);
         //Инициализируем событие просмотра пароля
         if (this._options.showPassword) {
            this._initEventChangeType();
         }
      },

      /**
       * Инициализирует событие для функционала отображения пароля
       */
      _initEventChangeType: function() {
         var self = this;
         this._passwordIcon = $('.controls-PasswordTextBox__showPassword', this.getContainer());
         this.getContainer().on(compatibility.touch ? 'touchend' : 'click', function(e) {
            if (e.target === self._passwordIcon[0]) {
               self._changeType();
            }
         })
      },

      /**
       * Изменяет тип поля с password на text и обратно 
       */
      _changeType: function () {
         this._options.type = this._options.type === "password" ? "text" : "password";
         this._inputField.attr("type", this._options.type);
         this._passwordIcon.attr('title', this._options.type === 'password' ? rk('Показать') : rk('Скрыть'));
         this._passwordIcon.toggleClass('icon-Show', this._options.type === 'password');
         this._passwordIcon.toggleClass('icon-Hide', this._options.type === 'text');
      }
   });

   return PasswordTextBox;

});