define('js!SBIS3.CONTROLS.SuggestTextBox', [
   'js!SBIS3.CONTROLS.TextBox',
   'js!SBIS3.CONTROLS.PickerMixin',
   'js!SBIS3.CONTROLS.SuggestMixin',
   'js!SBIS3.CONTROLS.ChooserMixin',
   'js!SBIS3.CONTROLS.SuggestTextBoxMixin',
   'js!SBIS3.CONTROLS.SearchMixin',
   'js!SBIS3.CONTROLS.SearchController',
   'html!SBIS3.CONTROLS.SuggestTextBox/resources/afterFieldWrapper',
   'Core/core-functions',
   'Core/CommandDispatcher'
], function (
    TextBox,
    PickerMixin,
    SuggestMixin,
    ChooserMixin,
    SuggestTextBoxMixin,
    SearchMixin,
    SearchController,
    afterFieldWrapper,
    cFunctions,
    CommandDispatcher) {
   'use strict';

   /**
    * Поле ввода с автодополнением
    * @class SBIS3.CONTROLS.SuggestTextBox
    * @extends SBIS3.CONTROLS.TextBox
    * @mixes SBIS3.CONTROLS.PickerMixin
    * @mixes SBIS3.CONTROLS.SuggestMixin
    * @mixes SBIS3.CONTROLS.ChooserMixin
    * @demo SBIS3.CONTROLS.Demo.MySuggestTextBox Поле ввода с автодополнением
    * @author Крайнов Дмитрий Олегович
    *
    * @control
    * @public
    * @category Inputs
    * @cssModifier controls-SuggestTextBox__withoutCross Скрыть крестик удаления значения.
    */
   var SuggestTextBox = TextBox.extend([PickerMixin, SuggestMixin, ChooserMixin, SuggestTextBoxMixin, SearchMixin], {
      $protected: {
         _options: {
            /**
             * @cfg {String} Имя параметр фильтрации для поиска
             */
            searchParam : '',
            afterFieldWrapper: afterFieldWrapper
         },
         _crossContainer: null,
         _searchController: null
      },
      $constructor: function() {
         var self = this;

         this.getContainer().addClass('controls-SuggestTextBox');
         this._crossContainer =  $('.js-controls-SuggestTextBox__reset', self.getContainer().get(0));


         this.subscribe('onTextChange', function(e, text) {
            this._crossContainer.toggleClass('ws-hidden', !text);
         });

         this._crossContainer.click(function() {
            self.setText('');
         });

         /* Если передали параметр поиска, то поиск производим через ComponentBinder */
         if(this._options.searchParam) {
            CommandDispatcher.declareCommand(this, 'changeSearchParam', function(paramName) {
               if(this._searchController) {
                  this._searchController.setSearchParamName(paramName);
               } else {
                  this._options.searchParam = paramName;
               }
            });

            this.subscribe('onSearch', function() {
               this._showLoadingIndicator();
            });

            this.once('onSearch', function () {
               this._searchController = new SearchController({
                  view: this.getList(),
                  searchForm: this,
                  searchParamName: this._options.searchParam,
                  doNotRespondOnReset: true
               });
               this._searchController.bindSearch();
            });

            this.subscribe('onReset', this._resetSearch.bind(this));
         }
      },

      _onListDataLoad: function() {
         SuggestTextBox.superclass._onListDataLoad.apply(this, arguments);

         if(this._options.searchParam) {
            /* В событии onDataLoad момент нельзя показывать пикер т.к. :
               1) Могут возникнуть проблемы, когда после отрисовки пикер меняет своё положение.
               2) Данных в рекордсете ещё нет.
               3) В onDataLoad приклданые программисты могу менять загруженный рекордсет.
               Поэтому в этом событии просто одинарно подпишемся на событие отрисовки данных и покажем автодополнение (если требуется). */
            this.subscribeOnceTo(this.getList(), 'onDrawItems', function() {
               if(this._checkPickerState(!this._options.showEmptyList)) {
                  this.showPicker();
               }
            }.bind(this));
         }
      },

      showPicker: function() {
         SuggestTextBox.superclass.showPicker.apply(this, arguments);
         this._setEqualPickerWidth();
      },

      destroy: function(){
         SuggestTextBox.superclass.destroy.apply(this, arguments);
         this._crossContainer.unbind('click');
         this._crossContainer = null;
      },

      _setEqualPickerWidth: function() {
         var textBoxWidth = this.getContainer()[0].clientWidth,
             pickerContainer = this._picker.getContainer()[0];

         if (this._picker && textBoxWidth !== pickerContainer.clientWidth) {
            /* Почему установлен maxWidth и width ?
               popup в текущей реализации не понимает, что ему размер кто-то установил извне и
               при пересчётах может спокойно перетирать эти размеры. Поэтому, для того чтобы зафиксировать ширину,
               устанавливаем maxWidth (maxWidth не стирается при пересчётах popup'a).
               Но учитываем, что maxWidth не будет учитываться, если автодополнение меньше поля ввода, и поэтому после
               расчётов позиции устанавливаем width - чтобы гаррантировать одинаковую ширину поля ввода и автодополнения.
               Прикладной программист может увеличить ширину автодополнения установив min-width. */
            pickerContainer.style.maxWidth = textBoxWidth + 'px';
            this._picker.recalcPosition(true);
            pickerContainer.style.width = textBoxWidth + 'px';
         }
      },

      _resetSearch: function() {
         SuggestTextBox.superclass._resetSearch.apply(this, arguments);

         if(this._options.searchParam) {
            /* Т.к. при сбросе поиска в саггесте запрос отправлять не надо (саггест скрывается),
               то просто удалим параметр поиска из фильтра */
            var listFilter = cFunctions.clone(this.getList().getFilter()); /* Клонируем фильтр, т.к. он передаётся по ссылке */

            delete listFilter[this._options.searchParam];
            this.setListFilter(listFilter, true);
         }
      }
   });

   return SuggestTextBox;
});
