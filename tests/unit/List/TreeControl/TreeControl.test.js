define(['Controls/List/TreeControl'], function(TreeControl) {
   describe('Controls.List.TreeControl', function() {
      it('TreeControl.reload', function() {
         var
            treeControl = new TreeControl({});
         treeControl._loadedNodes = {
            1: true,
            2: true,
            3: true
         };
         treeControl._children = {
            baseControl: {
               reload: function() {}
            }
         };
         treeControl.reload();
         assert.deepEqual({}, treeControl._loadedNodes, 'Incorrect value "_loadedNodes" after call "treeControl.reload()".');
      });
   });
});
