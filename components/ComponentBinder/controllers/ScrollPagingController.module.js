define('js!SBIS3.CONTROLS.ScrollPagingController', 
   [
      'js!SBIS3.StickyHeaderManager',
      'Core/Abstract',
      'Core/core-instance',
      'Core/WindowManager',
      'Core/helpers/Function/throttle',
      'css!SBIS3.CONTROLS.ScrollPagingController'
   ],
   function(StickyHeaderManager, cAbstract, cInstance, WindowManager, throttle) {

   var SCROLL_THROTTLE_DELAY = 200;
   
   var ScrollPagingController = cAbstract.extend({
      $protected: {
         _options: {
            view: null,
            zIndex: null
         },
         _viewHeight: 0,
         _viewportHeight: 0,
         _pagesCount: 0,
         _currentScrollPage: 1,
         _windowResizeTimeout: null,
         _zIndex: null
      },

      init: function() {
         ScrollPagingController.superclass.init.apply(this, arguments);
         this._options.paging.getContainer().css('z-index', this._options.zIndex || WindowManager.acquireZIndex());
         this._options.paging._zIndex = this._options.zIndex;
         //Говорим, что элемент видимый, чтобы WindowManager учитывал его при нахождении максимального zIndex
         WindowManager.setVisible(this._options.zIndex);
         // отступ viewport от верха страницы
         this._containerOffset = this._getViewportOffset();
         this._scrollHandler = throttle.call(this, this._scrollHandler.bind(this), SCROLL_THROTTLE_DELAY, true);
      },

      _getViewportOffset: function(){
         var viewport = this._options.view._getScrollWatcher().getScrollContainer();
         if (viewport[0] == window) {
            return 0;
         } else {
            return viewport.offset().top;
         }
      },

      bindScrollPaging: function(paging) {
         var view = this._options.view,
             isTree = cInstance.instanceOfMixin(view, 'SBIS3.CONTROLS.TreeMixin');
        
         paging = paging || this._options.paging;

         if (isTree){
            view.subscribe('onSetRoot', this._changeRootHandler.bind(this));

            view.subscribe('onNodeExpand', function(){
               this.updatePaging(true);
            }.bind(this));
         }

         paging.subscribe('onFirstPageSet', this._scrollToFirstPage.bind(this));

         paging.subscribe('onLastPageSet', this._scrollToLastPage.bind(this))
               .subscribe('onSelectedItemChange', this._pagingSelectedChange.bind(this));

         view._getScrollWatcher().subscribe('onScroll', this._scrollHandler);

         $(window).on('resize.wsScrollPaging', this._resizeHandler.bind(this));
      },

      _changeRootHandler: function(){
         var curRoot = this._options.view.getCurrentRoot();
         this._options.paging.setSelectedKey(1);
         this._options.paging.setPagesCount(1);
         this._currentScrollPage = 1;
         this.updatePaging(true);
      },

      _scrollHandler: function(event, scrollTop) {
         var page = scrollTop / this._viewportHeight;
         if (page % 1) {
            page = Math.ceil(page);
         }
         page += 1; //потому что используем нумерацию страниц с 1
         if (this._currentScrollPage !== page) {
            this._currentScrollPage = page;
            this._options.paging.setSelectedKey(page);
         }

      },

      _pagingSelectedChange: function(e, nPage, index){
         var scrollTop = this._viewportHeight * (nPage - 1);
         if (this._currentScrollPage !==  nPage) {
            this._currentScrollPage = nPage;
            this._options.view._getScrollWatcher().scrollTo(scrollTop);
         }
      },

      _scrollToLastPage: function(){
         this._options.view.setPage(-1);
      },

      _scrollToFirstPage: function(){
         this._options.view.setPage(0);
      },

      _isPageStartVisisble: function(page){
         var top;
         if (page.element.parents('html').length === 0) {
            return false;
         }

         if (this._options.view._getScrollWatcher().getScrollContainer()[0] == window) {
            top = page.element[0].getBoundingClientRect().bottom;
         } else {
            top = page.element.offset().top + page.element.outerHeight(true) - this._containerOffset;
         }
         return top >= 0;
      },

      _resizeHandler: function(){
         var windowHeight = $(window).height();
         clearTimeout(this._windowResizeTimeout);
         if (this._windowHeight != windowHeight){
            this._windowHeight = windowHeight;
            this._windowResizeTimeout = setTimeout(function(){
               this.updatePaging(true);
            }.bind(this), 200);
         }
      },


      getScrollPage: function(){
         return this._currentScrollPage;
      },

      getPagesCount: function() {
         return this._pagesCount
      },

      updatePaging: function() {
         this._updateCachedSizes();

         var pagesCount = this._viewportHeight ? Math.ceil(this._viewHeight / this._viewportHeight) : 0,
            view = this._options.view,
            pagingVisibility = pagesCount > 1 && view._getOption('infiniteScroll') !== 'up';

         /* Если пэйджинг скрыт - паддинг не нужен */
         view.getContainer().toggleClass('controls-ScrollPaging__pagesPadding', pagingVisibility);
         if (this._options.paging.getSelectedKey() > pagesCount){
            this._options.paging.setSelectedKey(pagesCount);
         }

         /* Для пэйджинга считаем, что кол-во страниц это:
          текущее кол-во загруженных страниц + 1, если в метаинформации рекордсета есть данные о том, что на бл есть ещё записи.
          Необходимо для того, чтобы в пэйджинге не моргала кнопка перехода к следующей странице, пока грузятся данные. */
         this._options.paging.setPagesCount(pagesCount + (view._hasNextPage(view.getItems().getMetaData().more) ? 1 : 0));
         //Если есть страницы - покажем paging

         this._options.paging.setVisible(pagingVisibility && !this._options.hiddenPager);
      },

      _updateCachedSizes: function(){
         var view, viewport;
         view = this._options.view;
         this._viewHeight = view.getContainer().get(0).scrollHeight;
         viewport = $(view._scrollWatcher.getScrollContainer());
         this._viewportHeight = viewport.get(0).offsetHeight;

      },

      destroy: function(){
         this._options.view._getScrollWatcher().unsubscribe('onScroll', this._scrollHandler);
         clearTimeout(this._windowResizeTimeout);
         $(window).off('resize.wsScrollPaging');
         WindowManager.releaseZIndex(this._options.zIndex);
         ScrollPagingController.superclass.destroy.apply(this, arguments);
      }

   });

   return ScrollPagingController;

});