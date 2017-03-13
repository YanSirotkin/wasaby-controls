define('js!SBIS3.CONTROLS.Action.OpenEditDialog', [
      'js!SBIS3.CONTROLS.Action.OpenDialog',
      'Core/EventBus',
      'Core/core-instance',
      'Core/core-merge',
      'Core/Indicator',
      'Core/IoC',
      'Core/Deferred',
      'Core/helpers/fast-control-helpers',
      'js!WS.Data/Entity/Record',
      'js!WS.Data/Di',
      'js!SBIS3.CONTROLS.Utils.OpenDialog',
      'js!SBIS3.CORE.Dialog',
      'js!SBIS3.CORE.FloatArea'
   ], function (OpenDialog, EventBus, cInstance, cMerge, cIndicator, IoC, Deferred, fcHelpers, Record, Di, OpenDialogUtil, Dialog, FloatArea) {
   'use strict';

   /**
    * Класс, описывающий действие открытия окна с заданным шаблоном. Применяется для работы с диалогами редактирования списков.
    * Подробнее об использовании класса вы можете прочитать в разделе <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/records-editing/editing-dialog/component-control/">Управление диалогом редактирования списка.</a>.
    * @class SBIS3.CONTROLS.OpenEditDialog
    * @extends SBIS3.CONTROLS.DialogActionBase
    * @author Крайнов Дмитрий Олегович
    *
    * @ignoreOptions validators independentContext contextRestriction extendedTooltip
    * @ignoreOptions visible tooltip tabindex enabled className alwaysShowExtendedTooltip allowChangeEnable
    *
    * @ignoreMethods activateFirstControl activateLastControl addPendingOperation applyEmptyState applyState clearMark
    * @ignoreMethods changeControlTabIndex destroyChild detectNextActiveChildControl disableActiveCtrl findParent
    * @ignoreMethods focusCatch getActiveChildControl getChildControlById getChildControlByName getChildControls
    * @ignoreMethods getClassName getContext getEventBusOf getEventHandlers getEvents getExtendedTooltip getOpener
    * @ignoreMethods getImmediateChildControls getLinkedContext getNearestChildControlByName getOwner getOwnerId
    * @ignoreMethods getReadyDeferred getStateKey getTabindex getUserData getValue hasActiveChildControl hasChildControlByName
    * @ignoreMethods hasEventHandlers isActive isAllReady isDestroyed isMarked isReady makeOwnerName setOwner setSize
    * @ignoreMethods markControl moveFocus moveToTop once registerChildControl registerDefaultButton saveToContext
    * @ignoreMethods sendCommand setActive setChildActive setClassName setExtendedTooltip setOpener setStateKey activate
    * @ignoreMethods setTabindex setTooltip setUserData setValidators setValue storeActiveChild subscribe unregisterChildControl
    * @ignoreMethods unregisterDefaultButton unsubscribe validate waitAllPendingOperations waitChildControlById waitChildControlByName
    * @ignoreMethods setVisible toggle show isVisible hide getTooltip isAllowChangeEnable isEnabled isVisibleWithParents
    *
    * @ignoreEvents onActivate onAfterLoad onAfterShow onBeforeControlsLoad onBeforeLoad onBeforeShow onChange onClick
    * @ignoreEvents onFocusIn onFocusOut onKeyPressed onReady onResize onStateChanged onTooltipContentRequest
    * @ignoreEvents onDragIn onDragMove onDragOut onDragStart onDragStop
    *
    * @control
    * @public
    * @category Actions
    * @initial
    * <component data-component="SBIS3.CONTROLS.OpenEditDialog">
    * </component>
    */
   var OpenEditDialog = OpenDialog.extend(/** @lends SBIS3.CONTROLS.OpenEditDialog.prototype */{
      /**
       * @event onUpdateModel Происходит при сохранении записи в источнике данных диалога.
       * @remark Событие используется, когда логика взаимодействия с источником диалога должна быть определена на стороне компонента, который инициировал открытие диалога.
       * При создании обработчика события существуют ограничения. Подробнее об этом вы можете прочитать в статье <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/records-editing/editing-dialog/synchronization/">Синхронизация изменений со списком</a>.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {WS.Data/Entity/Record} record Сохраняемая запись.
       * @param {String} key Первичный ключ сохраняемой записи.
       */
      /**
       * @event onDestroyModel Происходит при удалении записи из источника данных диалога.
       * @remark Событие используется, когда логика взаимодействия с источником диалога должна быть определена на стороне компонента, который инициировал открытие диалога.
       * При создании обработчика события существуют ограничения. Подробнее об этом вы можете прочитать в статье <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/records-editing/editing-dialog/synchronization/">Синхронизация изменений со списком</a>.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {WS.Data/Entity/Record} record Запись, которая была удалена из источника данных диалога.
       */
      /**
       * @event onCreateModel Происходит при создании записи в источнике данных диалога.
       * @remark Событие используется, когда логика взаимодействия с источником диалога должна быть определена на стороне компонента, который инициировал открытие диалога.
       * При создании обработчика события существуют ограничения. Подробнее об этом вы можете прочитать в статье <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/records-editing/editing-dialog/synchronization/">Синхронизация изменений со списком</a>.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {WS.Data/Entity/Record} record Запись, которая была создана в источнике данных диалога.
       */
      /**
       * @event onReadModel Происходит при чтении записи из источника данных диалога.
       * @remark Событие используется, когда логика взаимодействия с источником диалога должна быть определена на стороне компонента, который инициировал открытие диалога.
       * При создании обработчика события существуют ограничения. Подробнее об этом вы можете прочитать в статье <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/records-editing/editing-dialog/synchronization/">Синхронизация изменений со списком</a>.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {WS.Data/Entity/Record} record Запись, полученная из источника данных диалога.
       */
      $protected: {
         _options: {
            /**
             * @cfg {*|SBIS3.CONTROLS.DSMixin|WS.Data/Collection/IList} Устанавливает связанный с диалогом список.
             * @remark
             * Опция применятся при работе со <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/">списками</a>, чтобы производить <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/dialogs/synchronization/">синхронизацию изменений</a>.
             * Для списка, с которым производится связывание, устанавливается ограничение: в класс списка должы быть добавлены миксины ({@link SBIS3.CONTROLS.DSMixin} или {@link WS.Data/Collection/IList}).
             * @see setLinkedObject
             */
            linkedObject: undefined,
            /**
             * @cfg {String} Устанавливает способ инициализации данных диалога.
             * @remark
             * Описание значений опции вы можете найти в разделе <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/dialogs/initializing-way/">Способы инициализации данных диалога</a>.
             * @variant local
             * @variant remote
             * @variant delayedRemote
             */
            initializingWay: 'remote',
            /**
             * @cfg {String} Поле записи, в котором лежит url, по которому откроется новая вкладка при вызове execute при зажатой клавише ctrl
             */
            urlProperty: ''
         },
         /**
          * Ключ модели из связного списка
          * Отдельно храним ключ для модели из связного списка, т.к. он может не совпадать с ключом редактируемой модели
          * К примеру в реестре задач ключ записи в реестре и ключ редактируемой записи различается, т.к. одна и та же задача может находиться в нескольких различных фазах
          */
         _linkedModelKey: undefined,
         _overlay: undefined,
         _showedLoading: false,
         _openInNewTab: false
      },
      init: function () {
         OpenEditDialog.superclass.init.apply(this, arguments);
         $(document).bind('keydown keyup', this._setOpeningMode.bind(this));
      },
      /**
       * Устанавливает связанный список, с которым будет производиться синхронизация изменений диалога.
       * @param {*|SBIS3.CONTROLS.DSMixin|WS.Data/Collection/IList} linkedObject Экземпляр класса <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/">списка</a>.
       * @see linkedObject
       */
      setLinkedObject: function(linkedObject){
         this._options.linkedObject = linkedObject;
      },
      /**
       * Должен вернуть ключ записи, которую редактируем в диалоге
       */
      _getEditKey: function(item){
      },
      _setOpeningMode: function(event){
         this._openInNewTab = event.ctrlKey;
      },
      _needOpenInNewTab: function(){
         return this._openInNewTab;
      },

      _openComponent:function(meta, mode) {
         var openUrl = meta.item && meta.item.get(this._options.urlProperty);

         if (this._isExecuting){
            //Если execute уже был вызван, а панель еще не открылась, игнорируем этот вызов execute, пока не отработает открытие панели из первого вызова.
         }
         else if (this._needOpenInNewTab() && openUrl) {
            window.open(openUrl);
         }
         else if (this._isNeedToRedrawDialog()) {
            this._saveRecord().addCallback(function () {
               OpenEditDialog.superclass._openComponent.call(this, meta, mode);
            }.bind(this));
         }
         else {
            OpenEditDialog.superclass._openComponent.call(this, meta, mode);
         }
      },

      _saveRecord: function(){
         var
             self = this,
             args = arguments,
             resultDeferred = new Deferred(),
             templateComponent,
             currentRecord;

         templateComponent = this._dialog._getTemplateComponent();
         currentRecord = templateComponent ? templateComponent.getRecord() : null;
         if (currentRecord && currentRecord.isChanged()){
            require(['js!SBIS3.CONTROLS.Utils.InformationPopupManager'], function(InformationPopupManager){
               InformationPopupManager.showConfirmDialog({
                     message: rk('Сохранить изменения?')
                  },
                  self._confirmDialogHandler.bind(self, true, resultDeferred, templateComponent, args),
                  self._confirmDialogHandler.bind(self, false, resultDeferred, templateComponent, args)
               );
            });
            return resultDeferred;
         }
         else{
            return resultDeferred.callback();
         }
      },

      _confirmDialogHandler: function(result, resultDeferred, templateComponent){
         if (result){
            templateComponent.update({hideQuestion: true}).addCallback(function(){
               resultDeferred.callback();
            });
         }
         else {
            resultDeferred.callback();
         }
      },

      _setModelId: function(meta){
         this._linkedModelKey = meta.id;
         //Производим корректировку идентификатора только в случае, когда идентификатор передан
         if (meta.hasOwnProperty('id')) {
            //Если передали ключ из getEditKey - значит FC будет работать с новой записью,
            //вычитанной по этому ключу
            meta.id = this._getEditKey(meta.item) || meta.id;
         }

      },

      _createComponent: function(config, meta, mode){
         var initializingWay = config.componentOptions.initializingWay,
             dialogComponent = config.template,
             self = this;

         function wayRemote(templateComponent) {
            return self._initTemplateComponentCallback(config, meta, mode, templateComponent).addCallback(function () {
               OpenEditDialog.superclass._createComponent.call(self, config, meta, mode);
            });
         }

         function wayDelayedRemove(templateComponent) {
            var def = self._getRecordDeferred(config, meta, mode, templateComponent);
            OpenEditDialog.superclass._createComponent.call(self, config, meta, mode);
            return def;
         }

         if(initializingWay == OpenEditDialog.INITIALIZING_WAY_REMOTE || initializingWay == OpenEditDialog.INITIALIZING_WAY_DELAYED_REMOTE) {
            this._showLoadingIndicator();
            require([dialogComponent], function(templateComponent) {
               var def;
               if(initializingWay == OpenEditDialog.INITIALIZING_WAY_REMOTE) {
                  def = wayRemote(templateComponent);
               } else {
                  def = wayDelayedRemove(templateComponent);
               }
               def.addErrback(function (error) {
                  //Не показываем ошибку, если было прервано соединение с интернетом. просто скрываем индикатор и оверлей
                  if (!error._isOfflineMode) {
                     OpenDialogUtil.errorProcess(error);
                  }
                  return error;
               }).addBoth(function (record) {
                  self._hideLoadingIndicator();
                  return record;
               });
            })
         } else {
            OpenEditDialog.superclass._createComponent.call(this, config, meta, mode)
         }
      },

      _getRecordDeferred: function(config, meta, mode, templateComponent){
         var getRecordProtoMethod = templateComponent.prototype.getRecordFromSource,
            def = getRecordProtoMethod.call(templateComponent.prototype, config.componentOptions);
         //TODO Условие в рамках совместимости. убрать как все перейдут на установку dataSource с опций
         if (!cInstance.instanceOfModule(def, 'Core/Deferred')){
            return new Deferred().callback();
         }
         config.componentOptions._receiptRecordDeferred = def;
         return def;
      },

      _initTemplateComponentCallback: function (config, meta, mode, templateComponent) {
         var self = this,
            options,
            isNewRecord = (meta.isNewRecord !== undefined) ? meta.isNewRecord : !config.componentOptions.key,
            def;
         var getRecordProtoMethod = templateComponent.prototype.getRecordFromSource;
         if (getRecordProtoMethod) {
            def = getRecordProtoMethod.call(templateComponent.prototype, config.componentOptions);

            //TODO Условие в рамках совместимости. убрать как все перейдут на установку dataSource с опций
            if (!cInstance.instanceOfModule(def, 'Core/Deferred')){
               return new Deferred().callback();
            }

            def.addCallback(function (record) {
               config.componentOptions.record = record;
               config.componentOptions.isNewRecord = isNewRecord;
               if (isNewRecord){
                  config.componentOptions.key = record.getId();
                  options = OpenDialogUtil.getOptionsFromProto(templateComponent, 'getComponentOptions', config.componentOptions);
                  config.componentOptions.key = self._getRecordId(record, options.idProperty);
               }
               return record;
            });
            return def;
         }
         else {
            return new Deferred().callback();
         }
      },

      _showLoadingIndicator: function() {
         this._toggleOverlay(true);
         cIndicator.setMessage('Загрузка...', true);
      },

      _hideLoadingIndicator: function() {
         this._toggleOverlay(false);
         cIndicator.hide();
      },

      _toggleOverlay: function(show){
         //При вызове execute, во время начала асинхронных операций при выставленной опции initializingWay = 'remote' || 'delayedRemote',
         //закрываем оверлеем весь боди, чтобы пользователь не мог взаимодействовать с интерфейсом, пока не загрузится диалог редактирования,
         //иначе пока не загрузилась одна панель, мы можем позвать открытие другой, что приведет к ошибкам.
         if (!this._overlay) {
            this._overlay = $('<div class="controls-OpenDialogAction-overlay ws-hidden"></div>');
            this._overlay.css({
               position: 'absolute',
               top: 0,
               left: 0,
               right: 0,
               bottom: 0,
               'z-index': 9999,
               opacity: 0
            });
            this._overlay.appendTo('body');
         }
         this._overlay.toggleClass('ws-hidden', !show);
      },

      _buildComponentConfig: function (meta) {
         this._setModelId(meta);
         //Если запись в meta-информации отсутствует, то передаем null. Это нужно для правильной работы DataBoundMixin с контекстом и привязкой значений по имени компонента
         var record = (cInstance.instanceOfModule(meta.item, 'WS.Data/Entity/Record') ? meta.item.clone() : meta.item) || null,
             componentConfig = {
               isNewRecord: !!meta.isNewRecord,
               source: meta.source,
               record: record,
               handlers: this._getFormControllerHandlers(),
               initializingWay: meta.initializingWay || this._options.initializingWay
            };

         //Если этих опций нет в meta - не добавляем их, т.к. они могут быть объявлены на опциях FC. Иначе опции FC перетрутся пустыми значениями при получении записи с прототипного метода.
         if (meta.readMetaData){
            componentConfig.readMetaData = meta.readMetaData;
         }
         if (meta.id){
            componentConfig.key = meta.id;
         }
         if (meta.filter){
            componentConfig.initValues = meta.filter;
         }
         if (meta.dataSource){
            componentConfig.dataSource = meta.dataSource;
         }
         cMerge(componentConfig, meta.componentOptions);
         //Мы передаем клон записи из списка. После того, как мы изменим ее поля и сохраним, запись из связного списка будет помечена измененной,
         //т.к. при синхронизации мы изменили ее поля. При повторном открытии этой записи на редактирование, она уже будет помечена как измененная =>
         //ненужный вопрос о сохранении, если пользователь сразу нажмет на крест.
         //Делам так, чтобы отслеживать изменения записи только в момент работы FC.
         if (record) {
            record.acceptChanges();
         }
         return componentConfig;
      },
      /**
       * Возвращает обработчики на события formController'a
       */
      _getFormControllerHandlers: function(){
         return {
            onReadModel: this._actionHandler.bind(this),
            onUpdateModel: this._actionHandler.bind(this),
            onDestroyModel: this._actionHandler.bind(this),
            onCreateModel: this._actionHandler.bind(this)
         }
      },

      /**
       * Переопределяемый метод
       * В случае, если все действия выполняются самостоятельноно, надо вернуть OpenEditDialog.ACTION_CUSTOM, чтобы
       * не выполнялась базовая логика
       * @param model Запись, с которой работаем
       * @returns {String|Deferred} Сообщаем, нужно ли выполнять базовую логику. Если не нужно, то возвращаем OpenEditDialog.ACTION_CUSTOM
       */
      _onUpdateModel: function(model){
      },
      /**
       * Базовая логика при событии ouUpdate. Обновляем рекорд в связном списке
       */
      _updateModel: function (model, additionalData) {
         if (additionalData.isNewRecord){
            this._createRecord(model, 0, additionalData);
         }
         else{
            this._mergeRecords(model, null, additionalData);
         }
      },

      /**
       * Переопределяемый метод
       * В случае, если все действия выполняются самостоятельноно, надо вернуть OpenEditDialog.ACTION_CUSTOM, чтобы
       * не выполнялась базовая логика
       * @param model Запись, с которой работаем
       * @returns {String|Deferred} Сообщаем, нужно ли выполнять базовую логику. Если не нужно, то возвращаем OpenEditDialog.ACTION_CUSTOM
       */
      _onReadModel: function(model){
      },
      _readModel: function(model){
      },

      /**
       * Переопределяемый метод
       * В случае, если все действия выполняются самостоятельноно, надо вернуть OpenEditDialog.ACTION_CUSTOM, чтобы
       * не выполнялась базовая логика
       * @param model Запись, с которой работаем
       * @returns {String|Deferred} Сообщаем, нужно ли выполнять базовую логику. Если не нужно, то возвращаем OpenEditDialog.ACTION_CUSTOM
       */
      _onDestroyModel: function(model){
      },
      /**
       * Базовая логика при событии ouDestroy. Дестроим рекорд в связном списке
       */
      _destroyModel: function(model, additionalData) {
         var collectionRecord = this._getCollectionRecord(model, additionalData),
            collection = this._options.linkedObject;
         if (!collectionRecord){
            return;
         }
         //Уберём удаляемый элемент из массива выбранных у контрола, являющегося linkedObject.
         if (cInstance.instanceOfMixin(collection, 'SBIS3.CONTROLS.MultiSelectable')) {
            collection.removeItemsSelection([this._getRecordId(collectionRecord, additionalData.idProperty)]);
         }
         if (cInstance.instanceOfModule(collection.getItems && collection.getItems(), 'WS.Data/Collection/RecordSet')) {
            collection = collection.getItems();
         }
         collection.remove(collectionRecord);
      },

      /**
       * Переопределяемый метод
       * В случае, если все действия выполняются самостоятельноно, надо вернуть OpenEditDialog.ACTION_CUSTOM, чтобы
       * не выполнялась базовая логика
       * @param model Запись, с которой работаем
       * @returns {String|Deferred} Сообщаем, нужно ли выполнять базовую логику. Если не нужно, то возвращаем OpenEditDialog.ACTION_CUSTOM
       */
      _onCreateModel: function(model){
      },
      /**
       * Обработка событий formController'a. Выполнение переопределяемых методов и notify событий.
       * Если из обработчиков событий и переопределяемых методов вернули не OpenEditDialog.ACTION_CUSTOM, то выполняем базовую логику.
       */
      _actionHandler: function(event, model) {
         var eventName = event.name,
            genericMethods = {
               onDestroyModel: '_destroyModel',
               onUpdateModel : '_updateModel',
               onReadModel: '_readModel'
            },
            args = Array.prototype.slice.call(arguments, 0),
            self = this,
            eventResult,
            actionResult,
            methodResult,
            genericMethod;

         args.splice(0, 1); //Обрежем первый аргумент типа EventObject, его не нужно прокидывать в события и переопределяемый метод
         eventResult = actionResult = this._notify.apply(this, [eventName].concat(args));

         genericMethod = genericMethods[eventName];
         if (eventResult !== OpenEditDialog.ACTION_CUSTOM) {
            methodResult  = this['_' + eventName].apply(this, args);
            actionResult = methodResult || eventResult;
         }
         if (actionResult === OpenEditDialog.ACTION_CUSTOM || !this._options.linkedObject) {
            return;
         }
         if (actionResult !== undefined){
            genericMethod = actionResult;
         }
         if (actionResult instanceof Deferred){
            actionResult.addCallback(function(result){
               if (self[genericMethod]){
                  self[genericMethod].apply(this, args);
               }
            })
         } else {
            if (this[genericMethod]){
               this[genericMethod].apply(this, args);
            }
         }
      },

      _createRecord: function(model, at, additionalData){
         var collection = this._options.linkedObject,
            rec;
         at = at || 0;
         if (cInstance.instanceOfModule(collection.getItems(), 'WS.Data/Collection/RecordSet')) {
            //Создаем новую модель, т.к. Record не знает, что такое первичный ключ - это добавляется на модели.
            rec = Di.resolve(collection.getItems().getModel(), {
               adapter: collection.getItems().getAdapter(),
               format: collection.getItems().getFormat(),
               idProperty: collection.getItems().getIdProperty()
            });
            this._mergeRecords(model, rec, additionalData);
         } else  {
            rec = model.clone();
         }
         if (cInstance.instanceOfMixin(collection, 'WS.Data/Collection/IList')) {
            collection.add(rec, at);
         }
         else {
            if (collection.getItems()){
               collection.getItems().add(rec, at);
            }
            else{
               if (collection.isLoading()){
                  collection.once('onItemsReady', function(){
                     this.getItems().add(rec, at);
                  });
               }
               else{
                  collection.setItems([rec]);
               }
            }
         }
      },

      /**
       * Мержим поля из редактируемой записи в существующие поля записи из связного списка.
       */
      _mergeRecords: function(model, colRec, additionalData){
         var collectionRecord = colRec || this._getCollectionRecord(model, additionalData),
            collectionData = this._getCollectionData(),
            recValue;
         if (!collectionRecord) {
            return;
         }

         if (additionalData.isNewRecord) {
            collectionRecord.set(collectionData.getIdProperty(), additionalData.key);
         }

         Record.prototype.each.call(collectionRecord, function (key, value) {
            recValue = model.get(key);
            if (model.has(key) && recValue != value && key !== model.getIdProperty()) {
               //клонируем модели, флаги, итд потому что при сете они теряют связь с рекордом текущим рекордом, а редактирование может еще продолжаться.
               if (recValue && (typeof recValue.clone == 'function')) {
                  recValue = recValue.clone();
               }
               //Нет возможности узнать отсюда, есть ли у свойства сеттер или нет
               try {
                  this.set(key, recValue);
               } catch (e) {
                  if (!(e instanceof ReferenceError)) {
                     throw e;
                  }
               }
            }
         });
      },
      _collectionReload: function(){
         this._options.linkedObject.reload();
      },
      /**
       * Получаем запись из связного списка по ключу редактируемой записи
       */
      _getCollectionRecord: function(model, additionalData){
         var collectionData = this._getCollectionData(),
            index;

         if (collectionData && cInstance.instanceOfMixin(collectionData, 'WS.Data/Collection/IList') && cInstance.instanceOfMixin(collectionData, 'WS.Data/Collection/IIndexedCollection')) {
            index = collectionData.getIndexByValue(collectionData.getIdProperty(), this._linkedModelKey ||
               this._getRecordId(model, additionalData.idProperty));
            return collectionData.at(index);
         }
         return undefined;
      },

      _getRecordId: function(record, idProperty){
         if (idProperty) {
            return record.get(idProperty);
         }
         return record.getId();
      },

      _getCollectionData:function(){
         var collection = this._options.linkedObject;
         if (cInstance.instanceOfMixin(collection, 'SBIS3.CONTROLS.ItemsControlMixin')) {
            collection = collection.getItems();
         }
         return collection;
      },

      _getDialogConfig: function () {
         var config = OpenEditDialog.superclass._getDialogConfig.apply(this, arguments),
            self = this;
         return cMerge(config, {
            handlers: {
               onAfterClose: function (e, meta) {
                  self._isExecuting = false;
                  self._notifyOnExecuted(meta, this._record);
                  self._dialog = undefined;
               }
            }
         });
      }
   });

   OpenEditDialog.ACTION_CUSTOM = 'custom';
   OpenEditDialog.ACTION_MERGE = '_mergeRecords';
   OpenEditDialog.ACTION_ADD = '_createRecord';
   OpenEditDialog.ACTION_RELOAD = '_collectionReload';
   OpenEditDialog.ACTION_DELETE = '_destroyModel';
   OpenEditDialog.INITIALIZING_WAY_LOCAL = 'local';
   OpenEditDialog.INITIALIZING_WAY_REMOTE = 'remote';
   OpenEditDialog.INITIALIZING_WAY_DELAYED_REMOTE = 'delayedRemote';
   return OpenEditDialog;
});