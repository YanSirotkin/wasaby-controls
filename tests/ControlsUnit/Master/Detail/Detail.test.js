define(['Controls/masterDetail'], function(masterDetail) {
   'use strict';
   describe('Controls.Container.MasterDetail', function() {
      it('selected master value changed', () => {
         let Control = new masterDetail.Base();
         let event = {
            stopPropagation: () => {}
         };
         Control._selectedMasterValueChangedHandler(event, 'newValue');
         assert.equal(Control._selected, 'newValue');
         Control.destroy();
      });

      it('update offset', () => {
         let Control = new masterDetail.Base();

         // base
         let options = {
            masterMinWidth: 100,
            masterWidth: 200,
            masterMaxWidth: 299
         };

         Control._canResizing = Control._isCanResizing(options);
         Control._afterMount(options);
         assert.equal(Control._minOffset, 100);
         assert.equal(Control._maxOffset, 99);
         assert.equal(Control._currentWidth, '200px');


         Control._beforeUpdate(options);
         assert.equal(Control._minOffset, 100);
         assert.equal(Control._maxOffset, 99);
         assert.equal(Control._currentWidth, '200px');

         // wrong maxWidth
         options = {
            masterMinWidth: 100,
            masterWidth: 200,
            masterMaxWidth: 150
         };
         Control._beforeUpdate(options);
         assert.equal(Control._minOffset, 50);
         assert.equal(Control._maxOffset, 0);
         assert.equal(Control._currentWidth, '150px');

         // wrong minWidth
         options = {
            masterMinWidth: 250,
            masterWidth: 200,
            masterMaxWidth: 299
         };
         Control._beforeUpdate(options);
         assert.equal(Control._minOffset, 0);
         assert.equal(Control._maxOffset, 99);
         assert.equal(Control._currentWidth, '250px');
         Control.destroy();
      });

      it('is can resizing', () => {
         let Control = new masterDetail.Base();
         let options = {
            masterMinWidth: 250,
            masterWidth: 200,
            masterMaxWidth: 299
         };
         assert.equal(Control._isCanResizing(options), true);

         delete options.masterMinWidth;
         assert.equal(Control._isCanResizing(options), false);

         options.masterMinWidth = options.masterMaxWidth;
         assert.equal(Control._isCanResizing(options), false);
         Control.destroy();
      });
   });
});
