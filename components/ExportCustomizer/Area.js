/**
 * Контрол "Область редактирования настройщика экспорта"
 *
 * @public
 * @class SBIS3.CONTROLS/ExportCustomizer/Area
 * @extends SBIS3.CONTROLS/CompoundControl
 */
define('SBIS3.CONTROLS/ExportCustomizer/Area',
   [
      'Core/CommandDispatcher',
      'Core/core-merge',
      'Core/Deferred',
      'SBIS3.CONTROLS/CompoundControl',
      'SBIS3.CONTROLS/Utils/InformationPopupManager',
      'WS.Data/Collection/RecordSet',
      'tmpl!SBIS3.CONTROLS/ExportCustomizer/Area',
      'css!SBIS3.CONTROLS/ExportCustomizer/Area',
      'SBIS3.CONTROLS/Button',
      'SBIS3.CONTROLS/ScrollContainer'
   ],

   function (CommandDispatcher, cMerge, Deferred, CompoundControl, InformationPopupManager, RecordSet, tmpl) {
      'use strict';

      /**
       * @typedef {object} BrowserColumnInfo Тип, содержащий информацию о колонке браузера (SBIS3.CONTROLS/Browser и его наследники)
       * @property {string} id Идентификатор колонки (как правило, имя поля в базе данных или БЛ)
       * @property {string} title Отображаемое название колонки
       * @property {string} [group] Идентификатор или название группы, к которой относится колонка (опционально)
       * @property {boolean} [fixed] Обязательная колонка (опционально)
       * @property {object} columnConfig Конфигурация колонки в формате, используемом компонентом SBIS3.CONTROLS/DataGridView
       */

      /**
       * @typedef {object} ExportServiceParams Тип, содержащий информацию о прочих параметрах, необходимых для работы БЛ
       * @property {string} MethodName Имя списочного метода, результат раболты которого будет сохранён в эксель-файл
       * @property {WS.Data/Entity/Record} [Filter] Параметры фильтрации для списочного метода (опционально)
       * @property {WS.Data/Entity/Record} [Pagination] Навигация для списочного метода (опционально)
       * @property {string} [HierarchyField] Название поля иерархии (опционально)
       * @property {string} FileName Название результирующего эксель-файла
       */

      /**
       * @typedef {object} ExportResults Тип, содержащий информацию о результате редактирования
       * @property {string} MethodName Имя списочного метода, результат раболты которого будет сохранён в эксель-файл
       * @property {WS.Data/Entity/Record} [Filter] Параметры фильтрации для списочного метода (опционально)
       * @property {WS.Data/Entity/Record} [Pagination] Навигация для списочного метода (опционально)
       * @property {string} [HierarchyField] Название поля иерархии (опционально)
       * @property {string} FileName Название результирующего эксель-файла
       * @property {Array<string>} Fields Список полей для колонок в экспортируемом файле
       * @property {Array<string>} Titles Список отображаемых названий колонок в экспортируемом файле
       * @property {string} TemplateId Uuid шаблона форматирования эксель-файла
       */

      var _typeIfDefined = function (type, value) {
         // Если значение есть - оно должно иметь указанный тип
         return value !=/*Не !==*/ null && typeof value !== type ? new Error('Value must be a ' + type) : value;
      };

      /**
       * Константа (как бы) - Проверочная информация о типах данных опций
       *
       * @private
       * @type {object}
       */
      var _OPTION_TYPES = {
         dialogMode: _typeIfDefined.bind(null, 'boolean'),
         waitingMode: _typeIfDefined.bind(null, 'boolean'),
         dialogTitle: _typeIfDefined.bind(null, 'string'),
         dialogButtonTitle: _typeIfDefined.bind(null, 'string'),
         columnBinderTitle: _typeIfDefined.bind(null, 'string'),
         columnBinderColumnsTitle: _typeIfDefined.bind(null, 'string'),
         columnBinderFieldsTitle: _typeIfDefined.bind(null, 'string'),
         columnBinderEmptyTitle: _typeIfDefined.bind(null, 'string'),
         formatterTitle: _typeIfDefined.bind(null, 'string'),
         formatterMenuTitle: _typeIfDefined.bind(null, 'string'),
         serviceParams: function (value) {
            // Должно быть значение
            if (!value) {
               return new Error('Value required');
            }
            // и должна быть {@link ExportServiceParams}
            if (typeof value !== 'object' ||
               !(value.MethodName && typeof value.MethodName === 'string') ||
               !(value.Filter ==/*Не ===*/ null || typeof value.Filter === 'object') ||
               !(value.Pagination ==/*Не ===*/ null || typeof value.Pagination === 'object') ||
               !(value.HierarchyField ==/*Не ===*/ null || typeof value.HierarchyField === 'string') ||
               !(value.FileName && typeof value.FileName === 'string')
            ) {
               return new Error('Value must be an ExportServiceParams');
            }
            return value;
         },
         allFields: function (value) {
            // Должно быть значение
            if (!value) {
               return new Error('Value required');
            }
            // и быть не пустым массивом или рекодсетом
            if (!(Array.isArray(value) && value.length) && !(value instanceof RecordSet && value.getCount())) {
               return new Error('Value must be none empty array or recordset');
            }
            var isRecordSet = value instanceof RecordSet;
            var list = isRecordSet ? value.getRawData() : value;
            // И каждый элемент массива (или рекодсета) должен быть {@link BrowserColumnInfo}. Но проверить достаточно только на актуальные здесь свойства
            if (!list.every(function (v) { return (
                  typeof v === 'object' &&
                  (v.id && typeof v.id === 'string') &&
                  (v.title && typeof v.title === 'string')
               ); })) {
               return new Error((isRecordSet ? 'RecordSet' : 'Array') + ' items must be an BrowserColumnInfo');
            }
            return value;
         },
         fieldIds: function (value) {
            // Если значение есть
            if (value) {
               // оно должно быть массивом
               if (!Array.isArray(value)) {
                  return new Error('Value must be array');
               }
               // И каждый элемент массива должен быть не пустой строкой
               if (!value.every(function (v) { return !!v && typeof v === 'string'; })) {
                  return new Error('Array items must be none empty strings');
               }
               return value;
            }
         },
         fieldGroupTitles: _typeIfDefined.bind(null, 'object'),
         fileUuid: _typeIfDefined.bind(null, 'string')
      };

      /**
       * онстанта (как бы) - Значения опций по умолчанию
       *
       * @private
       * @type {object}
       */
      var _DEFAULT_OPTIONS = {
      };

      /**
       * Константа (как бы) - Список имён всех собственных опций компонента
       *
       * @private
       * @type {Array<string>}
       */
      var _OWN_OPTIONS_NAMES = [
         'dialogTitle',
         'dialogButtonTitle',
         'columnBinderTitle',
         'columnBinderColumnsTitle',
         'columnBinderFieldsTitle',
         'columnBinderEmptyTitle',
         'formatterTitle',
         'formatterMenuTitle',
         'serviceParams',
         'allFields',
         'fieldIds',
         'fieldGroupTitles',
         'fileUuid'
      ];

      var Area = CompoundControl.extend(/**@lends SBIS3.CONTROLS/ExportCustomizer/Area.prototype*/ {

         _dotTplFn: tmpl,
         $protected: {
            _options: {
               /**
                * @cfg {string} Отображать как часть диалога (опционально)
                */
               dialogMode: null,
               /**
                * @cfg {string} Отображать в режиме ожидания (опционально)
                */
               waitingMode: null,
               /**
                * @cfg {string} Заголовок диалога настройщика экспорта (опционально)
                */
               dialogTitle: null,//Определено в шаблоне
               /**
                * @cfg {string} Подпись кнопки диалога применения результата редактирования (опционально)
                */
               dialogButtonTitle: null,//Определено в шаблоне
               /**
                * @cfg {string} Заголовок под-компонента "columnBinder" (опционально)
                */
               columnBinderTitle: null,
               /**
                * @cfg {string} Заголовок столбца колонок файла в таблице соответствия под-компонента "columnBinder" (опционально)
                */
               columnBinderColumnsTitle: null,
               /**
                * @cfg {string} Заголовок столбца полей данных в таблице соответствия под-компонента "columnBinder" (опционально)
                */
               columnBinderFieldsTitle: null,
               /**
                * @cfg {string} Отображаемый текст при пустом списке соответствий в под-компоненте "columnBinder" (опционально)
                */
               columnBinderEmptyTitle: null,
               /**
                * @cfg {string} Заголовок под-компонента "formatter" (опционально)
                */
               formatterTitle: null,
               /**
                * @cfg {string} Заголовок меню выбора способа форматирования в под-компоненте "formatter" (опционально)
                */
               formatterMenuTitle: null,
               /**
                * @cfg {ExportServiceParams} Прочие параметры, необходимых для работы БЛ
                */
               serviceParams: null,
               /**
                * @cfg {Array<BrowserColumnInfo>|WS.Data/Collection/RecordSet<BrowserColumnInfo>} Список объектов с информацией о всех колонках в формате, используемом в браузере
                */
               allFields: null,
               /**
                * @cfg {Array<string>} Список привязки колонок в экспортируемом файле к полям данных
                */
               fieldIds: null,
               /**
                * @cfg {object} Список отображаемых названий групп полей (если используются идентификаторы групп)
                */
               fieldGroupTitles: null,
               /**
                * @cfg {string} Uuid шаблона форматирования эксель-файла
                */
               fileUuid: null
               // TODO: добавить валидаторы
            },
            // Список имён вложенных под-компонентов
            _SUBVIEW_NAMES: {
               preset: 'controls-ExportCustomizer-Area__preset',
               columnBinder: 'controls-ExportCustomizer-Area__body__columnBinder',
               formatter: 'controls-ExportCustomizer-Area__body__formatter'
            },
            // Ссылки на вложенные под-компоненты
            _views: {}
         },

         _modifyOptions: function () {
            var options = Area.superclass._modifyOptions.apply(this, arguments);
            if (!options.waitingMode) {
               this._processOptions(options);
            }
            return options;
         },

         /**
          * Провести обработку опций
          * @protected
          * @param {object} options Опции компонента
          */
         _processOptions: function (options) {
            this._resolveOptions(options);
            this._validateOptions(options, this._filterValidatedOptionNames.bind(this));
            this._reshapeOptions(options);
         },

         /**
          * Разрешить неустановленные собственные опции компонента их значениями по умолчанию из статического метода getDefaultOptions
          * @protected
          * @param {object} options Опции компонента
          */
         _resolveOptions: function (options) {
            var defaultOptions = Area.getDefaultOptions();
            for (var name in defaultOptions) {
               if (options[name] ==/*Не ===*/ null) {
                  options[name] = defaultOptions[name];
               }
            }
         },

         /**
          * Отобрать из указанных имён собственных опций только те, проверки для которых актуальны, учитывая значения других опций
          * @protected
          * @param {Array<string>} names Имена собственных опций компонента, для которых имеются валидаторы из статического метода getOptionTypes
          * @param {object} options Опции компонента
          * @param {Array<string>}
          */
         _filterValidatedOptionNames: function (names, options) {
            if (!options.waitingMode) {
               if (!options.dialogMode) {
                  var _remove = function (list) { Array.prototype.slice.call(arguments, 1).forEach(function (item) { var i = list.indexOf(item); if (i !== -1) { list.splice(i, 1); }; }); };
                  _remove(names, 'dialogTitle', 'dialogButtonTitle');
               }
               return names;
            }
         },

         /**
          * Проверить собственные опции компонента на допустимость их значений, используя валидаторы из статического метода getOptionTypes
          * @protected
          * @param {object} options Опции компонента
          * @param {function(Array<string>, object):Array<string>} [namesFilter] Фильт имён опций, которые подлежат проверке. Применяется при необходимости варьировать проверку в зависимости от значений других опций (опционально)
          */
         _validateOptions: function (options, namesFilter) {
            var typeValidators = Area.getOptionTypes();
            if (typeValidators) {
               var names = Object.keys(typeValidators);
               if (namesFilter) {
                  names = namesFilter.call(null, names, options);
               }
               if (names && names.length) {
                  for (var i = 0; i < names.length; i++) {
                     var name = names[i];
                     var validator = typeValidators[name];
                     if (validator) {
                        var err = validator(options[name]);
                        if (err instanceof Error) {
                           throw new Error('Wrong option "' + name + '": ' + err.message);
                        }
                     }
                  }
               }
            }
         },

         /**
          * Создать все необходимые дополнительные опции компонента
          * @protected
          * @param {object} options Опции компонента
          */
         _reshapeOptions: function (options) {
            options._scopes = {
               preset: {
               },
               columnBinder: {
                  title: options.columnBinderTitle || undefined,
                  columnsTitle: options.columnBinderColumnsTitle || undefined,
                  fieldsTitle: options.columnBinderFieldsTitle || undefined,
                  allFields: options.allFields,
                  fieldIds: options.fieldIds ? options.fieldIds.slice() : null
               },
               formatter: {
                  title: options.formatterTitle,
                  menuTitle: options.formatterMenuTitle,
                  allFields: options.allFields,
                  fieldIds: options.fieldIds ? options.fieldIds.slice() : null,
                  fileUuid: options.fileUuid,
                  serviceParams: options.serviceParams
               }
            };
         },

         $constructor: function () {
            if (this._options.dialogMode) {
               CommandDispatcher.declareCommand(this, 'complete', this._cmdComplete);
            }
            //CommandDispatcher.declareCommand(this, 'showMessage', Area.showMessage);
            this._publish('onComplete', 'onFatalError');
         },

         init: function () {
            Area.superclass.init.apply(this, arguments);
            this._init();
         },

         _init: function () {
            // Получить ссылки на имеющиеся под-компоненты
            this._collectViews();
            // Подписаться на необходимые события
            this._bindEvents();
         },

         /**
          * Собрать ссылки на все реально имеющиеся под-компоненты
          * @protected
          */
         _collectViews: function () {
            var subviewNames = this._SUBVIEW_NAMES;
            var views = {};
            for (var name in subviewNames) {
               views[name] = _getChildComponent(this, subviewNames[name]);
            }
            this._views = views;
         },

         _bindEvents: function () {
            for (var name in this._views) {
               this._bindSubviewEvents(name);
            }
         },

         _bindSubviewEvents: function (name) {
            var view = this._views[name];
            if (view && !view.isDestroyed()) {
               var handlers = {
                  preset: this._onChangePreset,
                  columnBinder: this._onChangeColumnBinder,
                  formatter: this._onChangeFormatter
               };
               this.subscribeTo(view, 'onCommandCatch', function (handler, evtName, command/*, args*/) {
                  if (command === 'subviewChanged') {
                     handler.apply(this, Array.prototype.slice.call(arguments, 3));
                     evtName.setResult(true);
                  }
               }.bind(this, handlers[name].bind(this)));
            }
         },

         /*
          * Обработчик "subviewChanged" для под-компонента "preset"
          *
          * @protected
          */
         _onChangePreset: function () {
         },

         /*
          * Обработчик "subviewChanged" для под-компонента "columnBinder"
          *
          * @protected
          */
         _onChangeColumnBinder: function () {
            // Изменилась область данных для импортирования
            var views = this._views;
            var values = views.columnBinder.getValues();
            var fieldIds = values.fieldIds;
            if (fieldIds) {
               this._options.fieldIds = fieldIds.slice();
               views.formatter.setValues({fieldIds:fieldIds.slice()});
            }
         },

         /*
          * Обработчик "subviewChanged" для под-компонента "formatter"
          *
          * @protected
          */
         _onChangeFormatter: function () {
            // Изменилась область данных для импортирования
            var values = this._views.formatter.getValues();
            var fileUuid = values.fileUuid;
            if (fileUuid) {
               this._options.fileUuid = fileUuid;
            }
         },

         /*
          * Проверить результаты
          *
          * @protected
          * @param {object} data Результирующие данные
          * @return {Core/Deferred}
          */
         _checkResults: function (data) {
            var validators = this._options.validators;
            var promise;
            if (validators && validators.length) {
               var errors = [];
               var warnings = [];
               var optionGetter = this._getOption.bind(this);
               for (var i = 0; i < validators.length; i++) {
                  var check = validators[i];
                  var args = check.params;
                  args = args && args.length ? args.slice() : [];
                  args.unshift(data, optionGetter);
                  var result = check.validator.apply(null, args);
                  if (result !== true) {
                     (check.noFailOnError ? warnings : errors).push(
                        result || check.errorMessage || rk('Неизвестная ошибка', 'НастройщикЭкспорта')
                     );
                  }
               }
               if (errors.length) {
                  promise = Area.showMessage('error', rk('Исправьте пожалуйста', 'НастройщикЭкспорта'), errors.join('\n'));
               }
               else
               if (warnings.length) {
                  promise = Area.showMessage('confirm', rk('Проверьте пожалуйста', 'НастройщикЭкспорта'), warnings.join('\n') + '\n\n' + rk('Действительно экспортировать так?', 'НастройщикЭкспорта'));
               }
            }
            return promise || Deferred.success(true);
         },

         /*
          * Реализация команды "complete"
          *
          * @protected
          */
         _cmdComplete: function () {
            // Сформировать результирующие данные из всего имеющегося
            // И сразу прроверить их
            this.getValues(true).addCallback(function (data) {
               // И если всё нормально - завершить диалог
               if (data) {
                  this._notify('onComplete', /*ExportResults:*/data);
               }
               /*else {
                  // Иначе пользователь продолжает редактирование
               }*/
            }.bind(this));
         },

         /**
          * Установить указанные настраиваемые значения компонента
          *
          * @public
          * @param {object} values Набор из нескольких значений, которые необходимо изменить
          */
         setValues: function (values) {
            if (!values || typeof values !== 'object') {
               throw new Error('Object required');
            }
            if (!Object.keys(values).length) {
               return;
            }
            // Если при установке значений надились в режиме ожидания - сбросить его
            var options = this._options;
            if (options.waitingMode) {
               options.waitingMode = null;
            }
            this._setOptions(values);
            if (!options.waitingMode) {
               this._processOptions(options);
            }
            var views = this._views;
            var needRebuild = !options.waitingMode ? !views.columnBinder || !views.formatter : !!views.columnBinder || !!views.formatter;
            if (needRebuild) {
               this.rebuildMarkup();
               this._init();
            }
            else {
               var scopes = options._scopes;
               for (var name in views) {
                  views[name].setValues(scopes[name]);
               }
            }
         },

         /*
          * Получить все результирующие данные
          *
          * @public
          * #param {boolean} withValidation Провести проверку данных перез возвратом
          * @return {Core/Deferred<ExportResults>}
          */
         getValues: function (withValidation) {
            var options = this._options;
            var data = cMerge({}, options.serviceParams);
            data.Fields = options.fieldIds;
            data.Titles = this._selectFields(options.allFields, options.fieldIds, function (v) { return v.title; });
            data.TemplateId = options.fileUuid;
            return withValidation
               ?
                  // Прроверить собранные данные
                  this._checkResults(data).addCallback(function (isSuccess) {
                     return isSuccess ? data : null;
                  })
               :
                  // Вернуть сразу
                  Deferred.success(data);
         },

         /**
          * Выбрать из списка всех колонок только объекты согласно указанным идентификаторам. Если указана функция-преобразователь, то преобразовать с её помощью каждый полученный элемент списка
          *
          * @protected
          * @param {Array<BrowserColumnInfo>|WS.Data/Collection/RecordSet<BrowserColumnInfo>} allFields Список объектов с информацией о всех колонках в формате, используемом в браузере
          * @param {Array<string>} fieldIds Список привязки колонок в экспортируемом файле к полям данных
          * @param {function} [mapper] Функция-преобразователь отобранных объектов (опционально)
          * @return {Array<*>}
          */
         _selectFields: function (allFields, fieldIds, mapper) {
            if (allFields && fieldIds && fieldIds.length) {
               var isRecordSet = allFields instanceof RecordSet;
               if (isRecordSet ? allFields.getCount() : allFields.length) {
                  var needMap = typeof mapper === 'function';
                  return fieldIds.map(function (id, i) {
                     var field;
                     if (!isRecordSet) {
                        allFields.some(function (v) { if (v.id === id) { field = v; return true; } });
                     }
                     else {
                        var model = allFields.getRecordById(id);
                        if (model) {
                           field = model.getRawData();
                        }
                     }
                     return field && needMap ? mapper(field) : field;
                  });
               }
            }
         }//,

         /*destroy: function () {
            Area.superclass.destroy.apply(this, arguments);
         }*/
      });



      // Public static methods:

      /**
       * Получить опции по умолчанию
       *
       * @public
       * @static
       * @return {object}
       */
      Area.getDefaultOptions = function () {
         return _DEFAULT_OPTIONS;
      };

      /**
       * Получить список имён всех собственных опций компонента
       *
       * @public
       * @static
       * @return {Array<string>}
       */
      Area.getOwnOptionNames = function () {
         return _OWN_OPTIONS_NAMES;
      };

      /**
       * Получить проверочную информацию о типах данных опций
       *
       * @public
       * @static
       * @return {object}
       */
      Area.getOptionTypes = function () {
         return _OPTION_TYPES;
      };

      /**
       * Показать сообщение пользователю
       *
       * @public
       * @static
       * @param {SBIS3.CONTROLS/SubmitPopup#SubmitPopupStatus} type Тип диалога (confirm, default, success, error)
       * @param {string} title Заголовок сообщения
       * @param {string} text Текст сообщения
       * @return {Core/Deferred}
       */
      Area.showMessage = function (type, title, text) {
         var isConfirm = type === 'confirm';
         var promise = new Deferred();
         var args = [{
            status: type,
            message: title,
            details: text
         }];
         if (isConfirm) {
            args.push(promise.callback.bind(promise, true), promise.callback.bind(promise, false));
         }
         else {
            args.push(promise.callback.bind(promise, null));
         }
         InformationPopupManager[isConfirm ? 'showConfirmDialog' : 'showMessageDialog'].apply(InformationPopupManager, args);
         return promise;
      };



      // Private methods:

      /**
       * Получить вложенный под-компонент, если он есть
       *
       * @private
       * @param {SBIS3.CONTROLS/ExportCustomizer/Area} self Этот объект
       * @param {string} name Имя вложенного под-компонента
       * @return {object}
       */
      var _getChildComponent = function (self, name) {
         if (self.hasChildControlByName(name)) {
            return self.getChildControlByName(name);
         }
      };



      return Area;
   }
);
