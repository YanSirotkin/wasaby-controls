/**
 * Created by am.gerasimov on 10.04.2015.
 */
define('js!SBIS3.CONTROLS.CustomFilterMenu',
   [
      'js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS.PickerMixin',
      'js!SBIS3.CONTROLS.DSMixin',
      'js!SBIS3.CONTROLS.MultiSelectable',
      'js!SBIS3.CONTROLS.DataBindMixin',
      'js!SBIS3.CONTROLS.DropdownListMixin',
      'html!SBIS3.CONTROLS.CustomFilterMenu',
      'html!SBIS3.CONTROLS.CustomFilterMenu/CustomFilterMenuItem'

   ],

   function(Control, PickerMixin, DSMixin, MultiSelectable, DataBindMixin, DropdownListMixin, dotTplFn, dotTplFnForItem) {


      'use strict';

      var CustomFilterMenu = Control.extend([PickerMixin, DSMixin, MultiSelectable, DataBindMixin, DropdownListMixin], {
         $protected: {
            _options: {
               itemTemplate: dotTplFnForItem
            },
            _dotTplFn: dotTplFn,
            _dotTplFnForItem: dotTplFnForItem,
            _caption: null,
            _pickerCaption: null,
            _pickerListContainer: null,
            _resetButton: null,
            _pickerResetButton: null,
            _defaultId: null
         },
         $constructor: function() {
            if (!this._options.displayField) {
               //По умолчанию отображаемое поле - 'title'
               this._options.displayField = 'title';
            }
            this._container.bind('mouseenter', this.showPicker.bind(this));
         },

         _initComplete : function() {
            CustomFilterMenu.superclass._initComplete.apply(this, arguments);
            //Проинициализируем пикер, чтобы был готов dataSet
            this._initializePicker();
         },

         _setPickerContent : function () {
            var self = this,
                header = $('<div class="controls-CustomFilterMenu__header"/>'),
                list = $('<div class="controls-CustomFilterMenu__list"/>'),
                pickerContainer = this._picker.getContainer();

            header.append(this._container.clone().removeAttr('style'));
            pickerContainer.append(header, list);

            this._setVariables();
            this.reload();
            this._bindItemSelect();
            this._pickerResetButton.mouseup(function() {
               self.setSelectedItems([]);
            });
            header.bind('mouseleave', this._pickerMouseLeaveHandler.bind(this, false));
            list.bind('mouseleave', this._pickerMouseLeaveHandler.bind(this, true));
         },

         _getItemClass: function(){
            return 'controls-CustomFilterMenu__item';
         },

         setSelectedItems: function(items) {
            CustomFilterMenu.superclass.setSelectedItems.apply(this, [items]);
            this.hidePicker();
         },

         _pickerMouseLeaveHandler: function(toHeader, e) {
            if(!$(e.toElement).closest('.controls-CustomFilterMenu__' + (toHeader ? 'header' : 'list')).length) {
               this.hidePicker();
            }
         },

         _dataLoadedCallback: function() {
            this._defaultId = this._dataSet.at(0).getKey();
         },

         _setVariables: function() {
            var pickerContainer = this._picker.getContainer();

            this._caption = this._container.find('.controls-CustomFilterMenu__caption');
            this._resetButton = this._container.find('.controls-CustomFilterMenu__crossIcon');
            this._pickerCaption  = pickerContainer.find('.controls-CustomFilterMenu__caption');
            this._pickerResetButton = pickerContainer.find('.controls-CustomFilterMenu__crossIcon');
            this._pickerListContainer = pickerContainer.find('.controls-CustomFilterMenu__list')
         },

         _drawSelectedItems : function(id) {
            var textValues = [],
                len = id.length,
                self = this,
                pickerContainer,
                def;

            if(len) {
               def = new $ws.proto.Deferred();

               if(this._dataSet) {
                  for(var i = 0; i < len; i++) {
                     textValues.push(this._dataSet.getRecordByKey(id[i]).get(this._options.displayField));
                  }
                  def.callback(textValues);
               } else {
                  //TODO переделать, когда БЛ научится отдавать несколько записей при чтении
                  this._dataSource.read(id[0]).addCallback(function(record) {
                     def.callback([record.get(self._options.displayField)]);
                  })
               }

               def.addCallback(function(textValue) {
                  pickerContainer = self._picker.getContainer();

                  pickerContainer.find('.controls-CustomFilterMenu__item__selected').removeClass('controls-CustomFilterMenu__item__selected');
                  pickerContainer.find('[data-id="' + id[0] + '"]').addClass('controls-CustomFilterMenu__item__selected');
                  self._setCaptionText(textValue.join(', '));
               });
               self._setResetButtonVisibility(id[0] === this._defaultId);
            }
         },

         _setCaptionText: function(text) {
            if(typeof text === 'string') {
               this._caption.text(text);
               this._pickerCaption.text(text);
            }
         },

         _setResetButtonVisibility: function(show) {
            this._resetButton.toggleClass('ws-hidden', show);
            this._pickerResetButton.toggleClass('ws-hidden', show);
         },

         _getItemsContainer : function () {
            return this._pickerListContainer;
         },

         _setPickerConfig: function () {
            return {
               corner: 'tl',
               verticalAlign: {
                  side: 'top',
                  offset: -1
               },
               horizontalAlign: {
                  side: 'left',
                  offset: -1
               },
               closeByExternalOver: true,
               targetPart: true
            };
         },

         //Переопределяю, чтобы элементы чистились в пикере
         _clearItems : function() {
            if (this._picker) {
               CustomFilterMenu.superclass._clearItems.call(this, this._pickerListContainer);
            }
         }
      });

      return CustomFilterMenu;
   });
