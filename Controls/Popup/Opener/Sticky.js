define('Controls/Popup/Opener/Sticky',
   [
      'Controls/Popup/Opener/BaseOpener',
      'Core/core-merge'
   ],
   function(Base, coreMerge) {
      /**
       * Component that opens a popup that is positioned relative to a specified element. {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/wasaby/components/openers/#sticky See more}.
       * @class Controls/Popup/Opener/Sticky
       * @mixes Controls/interface/IStickyOptions
       * @control
       * @author Красильников А.С.
       * @category Popup
       * @public
       */
      var Sticky = Base.extend({

         /**
          * Open sticky popup.
          * @function Controls/Popup/Opener/Sticky#open
          * @param {PopupOptions[]} popupOptions Sticky popup options.
          * @returns {Undefined}
          * @remark {@link https://wi.sbis.ru/docs/js/Controls/interface/IStickyOptions#popupOptions popupOptions}
          * @example
          * wml
          * <pre>
          *    <Controls.Popup.Opener.Sticky name="sticky">
          *       <ws:popupOptions template="Controls-demo/Popup/TestDialog">
          *          <ws:verticalAlign side="bottom"/>
          *          <ws:horizontalAlign side="left"/>
          *          <ws:corner vertical="bottom" horizontal="left"/>
          *       </ws:popupOptions>
          *   </Controls.Popup.Opener.Sticky>
          *
          *   <div name="target">{{_text}}</div>
          *
          *   <Controls.Button name="openStickyButton" caption="open sticky" on:click="_open()"/>
          *   <Controls.Button name="closeStickyButton" caption="close sticky" on:click="_close()"/>
          * </pre>
          * js
          * <pre>
          *    Control.extend({
          *       ...
          *
          *       _open() {
          *          var popupOptions = {
          *              target: this._children.target,
          *              opener: this._children.openStickyButton,
          *              templateOptions: {
          *                  record: this._record
          *              }
          *          }
          *          this._children.sticky.open(popupOptions);
          *      }
          *
          *      _close() {
          *          this._children.sticky.close()
          *      }
          *      ...
          *    });
          * </pre>
          * @see close
          */
         open: function(config) {
            config.isDefaultOpener = config.isDefaultOpener !== undefined ? config.isDefaultOpener : true;
            this._setCompatibleConfig(config);
            Base.prototype.open.call(this, config, 'Controls/Popup/Opener/Sticky/StickyController');
         },

         _setCompatibleConfig: function(config) {
            config._type = 'sticky'; // for compoundArea
         }
      });

      Sticky.getDefaultOptions = function() {
         return coreMerge(Base.getDefaultOptions(), {});
      };
      return Sticky;
   });

/**
 * @name Controls/Popup/Opener/Sticky#targetTracking
 * @cfg {Boolean} targetTracking Determines whether popup position update when scrolling the area with the opener.
*/

/**
 * @name Controls/Popup/Opener/Sticky#closeOnTargetScroll
 * @cfg {Boolean} closeOnTargetScroll Determines whether closing of the popup when scrolling area with the opener.
 */

/**
 * @name Controls/Popup/Opener/Sticky#close
 * @description Close sticky popup.
 * @function
 * @returns {Undefined}
 * @example
 * wml
 * <pre>
 *    <Controls.Popup.Opener.Sticky name="sticky">
 *       <ws:popupOptions template="Controls-demo/Popup/TestDialog">
 *          <ws:verticalAlign side="bottom"/>
 *          <ws:horizontalAlign side="left"/>
 *          <ws:corner vertical="bottom" horizontal="left"/>
 *       </ws:popupOptions>
 *    </Controls.Popup.Opener.Sticky>
 *
 *    <div name="target">{{_text}}</div>
 *
 *    <Controls.Button name="openStickyButton" caption="open sticky" on:click="_open()"/>
 *    <Controls.Button name="closeStickyButton" caption="close sticky" on:click="_close()"/>
 * </pre>
 * js
 * <pre>
 *   Control.extend({
 *      ...
 *
 *      _open() {
 *          var popupOptions = {
 *              target: this._children.target,
 *              opener: this._children.openStickyButton,
 *              templateOptions: {
 *                  record: this._record
 *              }
 *          }
 *          this._children.sticky.open(popupOptions);
 *      }
 *
 *      _close() {
 *          this._children.sticky.close()
 *      }
 *      ...
 *  });
 *  </pre>
 *  @see open
 */

/**
 * @name Controls/Popup/Opener/Sticky#isOpened
 * @description Popup opened status.
 * @function
 */

/**
 * @name Controls/Popup/Opener/Sticky#autofocus
 * @cfg {Boolean} Determines whether focus is set to the template when popup is opened.
 */

/**
 * @name Controls/Popup/Opener/Sticky#modal
 * @cfg {Boolean} Determines whether the window is modal.
 */

/**
 * @name Controls/Popup/Opener/Sticky#className
 * @cfg {String} Class names of popup.
 */

/**
 * @name Controls/Popup/Opener/Sticky#closeOnOutsideClick
 * @cfg {Boolean} Determines whether possibility of closing the popup when clicking past.
 */

/**
 * @name Controls/Popup/Opener/Sticky#template
 * @cfg {String|Function} Template inside popup.
 */

/**
 * @name Controls/Popup/Opener/Sticky#templateOptions
 * @cfg {String|Function} Template options inside popup.
 */

/**
 * @name Controls/Popup/Opener/Sticky#minWidth
 * @cfg {Number} The minimum width of popup.
 */

/**
 * @name Controls/Popup/Opener/Sticky#maxWidth
 * @cfg {Number} The maximum width of popup.
 */

/**
 * @name Controls/Popup/Opener/Sticky#minHeight
 * @cfg {Number} The minimum height of popup.
 */

/**
 * @name Controls/Popup/Opener/Sticky#maxHeight
 * @cfg {Number} The maximum height of popup.
 */

/**
 * @name Controls/Popup/Opener/Sticky#corner
 * @cfg {Object} Sets the popup build point relative target.
 */

/**
 * @name Controls/Popup/Opener/Sticky#horizontalAlign
 * @cfg {Object} Sets the horizontal alignment of the popup.
 */

/**
 * @name Controls/Popup/Opener/Sticky#verticalAlign
 * @cfg {Object} Sets the vertical alignment of the popup.
 */

/**
 * @name Controls/Popup/Opener/Sticky#target
 * @cfg {Object} The target relative to which the popup is positioned.
 */

/**
 * @name Controls/Popup/Opener/Sticky#locationStrategy
 * @cfg {Object} A method of adjusting the popup panel to the free space next to the target.
 */
