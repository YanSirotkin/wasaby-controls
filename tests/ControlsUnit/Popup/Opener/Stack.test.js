define(
   [
      'Controls/_popupTemplate/Stack/Opener/StackStrategy',
      'Controls/popup',
      'Controls/popupTemplate',
      'Controls-demo/Popup/TestMaximizedStack',
      'Controls/_popupTemplate/BaseController',
      'Controls/_popupTemplate/Stack/Opener/StackContent'
   ],
   (StackStrategy, popupMod, popupTemplate, TestMaximizedStack, BaseController, StackContent) => {
      'use strict';

      describe('Controls/_popupTemplate/Stack/Opener/StackContent', () => {
         it('canResize', () => {
            let stackC = new StackContent.default();
            assert.equal(false, stackC._canResize(1, 2, 3, null));
            assert.equal(false, stackC._canResize(1, 2, null, 4));
            assert.equal(false, stackC._canResize(1, null, 3, 4));
            assert.equal(false, stackC._canResize(null, 2, 3, 4));
            assert.equal(false, stackC._canResize(1, 2, 3, 3));
            assert.equal(true, stackC._canResize(1, 2, 3, 4));
            stackC.destroy();
         });
      });

      describe('Controls/_popup/Opener/Stack', () => {
         StackStrategy.getMaxPanelWidth = () => 1000;
         popupTemplate.StackController._private.getContainerWidth = function(items) {
            return items.templateWidth;
         };
         let item = {
            popupOptions: {
               minWidth: 600,
               maxWidth: 800
            }
         };

         it('Opener: getConfig', () => {
            let getStackConfig = popupMod.Stack._private.getStackConfig;
            let config = getStackConfig();
            assert.equal(config.isDefaultOpener, true);

            config = getStackConfig({ isDefaultOpener: false });
            assert.equal(config.isDefaultOpener, false);
         });

         it('stack with config sizes', () => {
            var position = StackStrategy.getPosition({
               top: 0,
               right: 0
            }, item);
            assert.isTrue(position.maxWidth === item.popupOptions.maxWidth);
            assert.isTrue(position.top === 0);
            assert.isTrue(position.right === 0);
            assert.isTrue(position.bottom === 0);
            assert.isTrue(position.position === 'fixed');
         });

         it('stack getAvailableMaxWidth', () => {
            let itemMaxWidth = null;
            let maxPanelWidth = 100;
            assert.equal(StackStrategy._private.getAvailableMaxWidth(itemMaxWidth, maxPanelWidth), 100);
            itemMaxWidth = 10;
            assert.equal(StackStrategy._private.getAvailableMaxWidth(itemMaxWidth, maxPanelWidth), 10);
            itemMaxWidth = 110;
            assert.equal(StackStrategy._private.getAvailableMaxWidth(itemMaxWidth, maxPanelWidth), 100);
         });

         it('stack shadow', () => {
            let baseGetItemPosition = popupTemplate.StackController._private.getItemPosition;
            popupTemplate.StackController._private.getItemPosition = items => (items.position);
            popupTemplate.StackController._stack.add({
               position: { width: 720 },
               popupOptions: { stackClassName: '' }
            });
            popupTemplate.StackController._stack.add({
               containerWidth: 600,
               popupOptions: { stackClassName: '' }
            });
            popupTemplate.StackController._stack.add({
               position: { width: 600 },
               popupOptions: { stackClassName: '' }
            });
            popupTemplate.StackController._stack.add({
               position: { width: 1000 },
               popupOptions: { stackClassName: '' }
            });
            popupTemplate.StackController._stack.add({
               position: { width: 840 },
               popupOptions: { stackClassName: '' }
            });
            popupTemplate.StackController._stack.add({
               containerWidth: 600,
               popupOptions: { stackClassName: '' }
            });
            popupTemplate.StackController._stack.add({
               containerWidth: 720,
               popupOptions: { stackClassName: '' }
            });
            popupTemplate.StackController._stack.add({
               containerWidth: 200,
               popupState: 'destroying',
               popupOptions: { stackClassName: '' }
            });
            popupTemplate.StackController._stack.add({
               containerWidth: 200,
               popupOptions: { stackClassName: '' }
            });

            popupTemplate.StackController._update();
            assert.isTrue(popupTemplate.StackController._stack.at(0).popupOptions.hidden);
            assert.isTrue(popupTemplate.StackController._stack.at(1).popupOptions.hidden);
            assert.isTrue(popupTemplate.StackController._stack.at(2).popupOptions.hidden);
            assert.isFalse(popupTemplate.StackController._stack.at(3).popupOptions.hidden);
            assert.isFalse(popupTemplate.StackController._stack.at(4).popupOptions.hidden);
            assert.isTrue(popupTemplate.StackController._stack.at(5).popupOptions.hidden);
            assert.isFalse(popupTemplate.StackController._stack.at(6).popupOptions.hidden);
            // 7 индекс не интересен, потому что popupState: 'destroying'. Проверяем, что не повлиял на 8 индекс
            //assert.isTrue(popupTemplate.StackController._stack.at(7).popupOptions.hidden);
            assert.isFalse(popupTemplate.StackController._stack.at(8).popupOptions.hidden);


            popupTemplate.StackController._stack.add({
               containerWidth: 1100,
               popupOptions: { stackClassName: '' }
            });
            popupTemplate.StackController._stack.add({
               containerWidth: 850,
               popupOptions: { stackClassName: '' }
            });
            popupTemplate.StackController._stack.add({
               containerWidth: 950,
               popupOptions: { stackClassName: '' }
            });
            popupTemplate.StackController._stack.add({
               containerWidth: 1100,
               popupOptions: { stackClassName: '' }
            });
            popupTemplate.StackController._stack.add({
               containerWidth: 850,
               popupOptions: { stackClassName: '' }
            });
            popupTemplate.StackController._stack.add({
               containerWidth: 950,
               popupOptions: { stackClassName: '' }
            });
            popupTemplate.StackController._stack.add({
               position: {},
               templateWidth: 711,
               containerWidth: '',
               popupOptions: { stackClassName: '' }
            });

            popupTemplate.StackController._update();
            popupTemplate.StackController._update();
            popupTemplate.StackController._private.getItemPosition = baseGetItemPosition;

            assert.isTrue(popupTemplate.StackController._stack.at(0).popupOptions.hidden);
            assert.isTrue(popupTemplate.StackController._stack.at(1).popupOptions.hidden);
            assert.isTrue(popupTemplate.StackController._stack.at(2).popupOptions.hidden);
            assert.isTrue(popupTemplate.StackController._stack.at(3).popupOptions.hidden);
            assert.isTrue(popupTemplate.StackController._stack.at(4).popupOptions.hidden);
            assert.isTrue(popupTemplate.StackController._stack.at(5).popupOptions.hidden);
            assert.isTrue(popupTemplate.StackController._stack.at(6).popupOptions.hidden);
            // 7 индекс не интересен, потому что popupState: 'destroying'. Проверяем, что не повлиял на 8 индекс
            //assert.isTrue(popupTemplate.StackController._stack.at(7).popupOptions.hidden);
            assert.isTrue(popupTemplate.StackController._stack.at(8).popupOptions.hidden);
            assert.isTrue(popupTemplate.StackController._stack.at(9).popupOptions.hidden);
            assert.isTrue(popupTemplate.StackController._stack.at(10).popupOptions.hidden);
            assert.isTrue(popupTemplate.StackController._stack.at(11).popupOptions.hidden);
            assert.isFalse(popupTemplate.StackController._stack.at(12).popupOptions.hidden);
            assert.isTrue(popupTemplate.StackController._stack.at(13).popupOptions.hidden);
            assert.isFalse(popupTemplate.StackController._stack.at(14).popupOptions.hidden);
            assert.isFalse(popupTemplate.StackController._stack.at(15).popupOptions.hidden);
         });
         it('stack default position', (done) => {
            popupTemplate.StackController._private.getWindowSize = () => ({
               width: 1920,
               height: 950
            }); // Этот метод зовет получение размеров окна, для этих тестов не нужно
            popupTemplate.StackController._private.getStackParentCoords = () => ({
               top: 0,
               right: 0
            }); // Этот метод зовет получение размеров окна, для этих тестов не нужно
            let itemConfig = {
               id: '555444333',
               popupOptions: item.popupOptions
            };
            itemConfig.popupOptions.template = TestMaximizedStack;
            itemConfig.popupOptions.minimizedWidth = undefined;
            popupTemplate.StackController.getDefaultConfig(itemConfig);
            popupTemplate.StackController.getDefaultConfig(itemConfig);
            popupTemplate.StackController.getDefaultConfig(itemConfig)
               .then(() => {
                  assert.equal(itemConfig.position.top, 0);
                  assert.equal(itemConfig.position.right, 0);
                  assert.equal(itemConfig.position.width, 800);
                  assert.equal(itemConfig.position.bottom, 0);
                  assert.equal(itemConfig.popupOptions.content, popupTemplate.StackContent);

                  let itemCount = 0;
                  let items = popupTemplate.StackController._stack;
                  for (let i = 0; i < items.getCount(); i++) {
                     if (items.at(i).id === itemConfig.id) {
                        itemCount++;
                     }
                  }
                  assert.equal(itemCount, 1);
                  done();
               });
         });

         it('stack maximized popup position', () => {
            let item = {
               popupOptions: {
                  minWidth: 600,
                  maxWidth: 800
               },
               hasMaximizePopup: true
            };
            let position = StackStrategy.getPosition({
               top: 0,
               right: 100
            }, item);
            assert.equal(position.right, 0);
         });

         it('stack maximized default options', (done) => {
            let itemConfig = {
               popupOptions: {
                  templateOptions: {},
                  template: TestMaximizedStack
               }
            };
            popupTemplate.StackController.getDefaultConfig(itemConfig)
               .then(() => {
                  assert.equal(itemConfig.popupOptions.stackMinWidth, 500);
                  assert.equal(itemConfig.popupOptions.stackMaxWidth, 1000);
                  assert.equal(itemConfig.popupOptions.stackWidth, 800);

                  itemConfig = {
                     popupOptions: {
                        minWidth: 600,
                        maxWidth: 900,
                        templateOptions: {},
                        template: TestMaximizedStack
                     }
                  };
                  popupTemplate.StackController.getDefaultConfig(itemConfig)
                     .then(() => {
                        assert.equal(itemConfig.popupOptions.stackMinWidth, 600);
                        assert.equal(itemConfig.popupOptions.stackMaxWidth, 900);
                        assert.equal(itemConfig.popupOptions.stackWidth, 800);
                        done();
                     });
               });

         });
         it('last stack className', () => {
            let baseGetItemPosition = popupTemplate.StackController._private.getItemPosition;
            popupTemplate.StackController._private.getItemPosition = items => (items.position);
            popupTemplate.StackController._stack.clear();
            popupTemplate.StackController._stack.add({
               position: { stackWidth: 720 },
               popupOptions: { className: '' }
            });
            popupTemplate.StackController._update();
            assert.isTrue(popupTemplate.StackController._stack.at(0).popupOptions.className.indexOf('controls-Stack__last-item') >= 0);
            popupTemplate.StackController._stack.add({
               containerWidth: 1100,
               popupOptions: { className: '' }
            });
            popupTemplate.StackController._update();
            assert.isTrue(popupTemplate.StackController._stack.at(0).popupOptions.className.indexOf('controls-Stack__last-item') < 0);
            assert.isTrue(popupTemplate.StackController._stack.at(1).popupOptions.className.indexOf('controls-Stack__last-item') >= 0);
            popupTemplate.StackController._stack.add({
               containerWidth: 720,
               popupOptions: { className: '' }
            });
            popupTemplate.StackController._update();
            assert.isTrue(popupTemplate.StackController._stack.at(0).popupOptions.className.indexOf('controls-Stack__last-item') < 0);
            assert.isTrue(popupTemplate.StackController._stack.at(1).popupOptions.className.indexOf('controls-Stack__last-item') < 0);
            assert.isTrue(popupTemplate.StackController._stack.at(2).popupOptions.className.indexOf('controls-Stack__last-item') >= 0);
            popupTemplate.StackController._private.getItemPosition = baseGetItemPosition;
         });
         it('stack panel maximized', (done) => {
            popupTemplate.StackController._update = () => {
            }; // Этот метод зовет получение размеров окна, для этих тестов не нужно
            popupTemplate.StackController._private.prepareSizes = () => {
            }; // Этот метод зовет получение размеров окна, для этих тестов не нужно
            popupTemplate.StackController._private.getWindowSize = () => ({
               width: 1920,
               height: 950
            }); // Этот метод зовет получение размеров окна, для этих тестов не нужно

            let popupOptions = {
               minimizedWidth: 600,
               minWidth: 900,
               maxWidth: 1200,
               templateOptions: {}
            };
            let itemConfig = {
               popupOptions: popupOptions
            };

            StackStrategy.getMaxPanelWidth = () => 1600;

            assert.equal(StackStrategy.isMaximizedPanel(itemConfig), true);

            itemConfig.popupOptions.template = TestMaximizedStack;
            popupTemplate.StackController.getDefaultConfig(itemConfig)
               .then(() => {
                  assert.equal(itemConfig.popupOptions.maximized, false); // default value
                  assert.equal(itemConfig.popupOptions.templateOptions.hasOwnProperty('showMaximizedButton'), true);

                  popupTemplate.StackController.elementMaximized(itemConfig, {}, false);
                  assert.equal(itemConfig.popupOptions.maximized, false);
                  assert.equal(itemConfig.popupOptions.templateOptions.maximized, false);
                  let position = StackStrategy.getPosition({
                     top: 0,
                     right: 0
                  }, itemConfig);
                  assert.equal(position.width, popupOptions.minimizedWidth);

                  popupTemplate.StackController.elementMaximized(itemConfig, {}, true);
                  assert.equal(itemConfig.popupOptions.maximized, true);
                  assert.equal(itemConfig.popupOptions.templateOptions.maximized, true);
                  position = StackStrategy.getPosition({
                     top: 0,
                     right: 0
                  }, itemConfig);
                  assert.equal(position.maxWidth, popupOptions.maxWidth);

                  popupTemplate.StackController._private.prepareMaximizedState(1600, itemConfig);
                  assert.equal(itemConfig.popupOptions.templateOptions.showMaximizedButton, true);

                  popupTemplate.StackController._private.prepareMaximizedState(800, itemConfig);
                  assert.equal(itemConfig.popupOptions.templateOptions.showMaximizedButton, false);
                  delete itemConfig.popupOptions.width;
                  done();
               });
         });

         it('stack state', () => {
            let itemConfig = {
               id: '22',
               popupOptions: item.popupOptions
            };
            popupTemplate.StackController._update = () => {
            }; // Этот метод зовет получение размеров окна, для этих тестов не нужно
            popupTemplate.StackController._private.prepareSizes = () => {
            }; // Этот метод зовет получение размеров окна, для этих тестов не нужно
            popupTemplate.StackController._private.getWindowSize = () => ({
               width: 1920,
               height: 950
            }); // Этот метод зовет получение размеров окна, для этих тестов не нужно

            popupTemplate.StackController._elementCreated(itemConfig, {});

            // Зависит от того где запускаем тесты, под нодой или в браузере
            assert.isTrue(itemConfig.popupState === BaseController.POPUP_STATE_CREATED || itemConfig.popupState === BaseController.POPUP_STATE_CREATING);

            popupTemplate.StackController.elementAnimated(itemConfig);
            assert.equal(itemConfig.popupState, BaseController.POPUP_STATE_CREATED);

            itemConfig.popupOptions.className = '';
            popupTemplate.StackController._elementUpdated(itemConfig, {});
            popupTemplate.StackController._elementUpdated(itemConfig, {});
            popupTemplate.StackController._elementUpdated(itemConfig, {});

            // класс обновился, потому что состояние было opened. После множ. update класс не задублировался
            assert.equal(itemConfig.popupState, BaseController.POPUP_STATE_UPDATING);
            assert.equal(itemConfig.popupOptions.className, ' controls-Stack');

            popupTemplate.StackController._elementAfterUpdated(itemConfig, {});
            assert.equal(itemConfig.popupState, BaseController.POPUP_STATE_UPDATED);

            itemConfig.popupState = 'notOpened';
            itemConfig.popupOptions.className = '';
            popupTemplate.StackController._elementUpdated(itemConfig, {});

            // класс не обновился, потому что состояние не opened
            assert.equal(itemConfig.popupOptions.className, '');

            popupTemplate.StackController._elementDestroyed(itemConfig, {});

            // Зависит от того где запускаем тесты, под нодой или в браузере
            assert.isTrue(itemConfig.popupState === BaseController.POPUP_STATE_DESTROYING || itemConfig.popupState === BaseController.POPUP_STATE_DESTROYED);

            itemConfig._destroyDeferred.addCallback(function() {
               assert.equal(itemConfig.popupState, BaseController.POPUP_STATE_DESTROYED);
            });
            popupTemplate.StackController.elementAnimated(itemConfig, {});
         });

         it('stack from target container', () => {
            var position = StackStrategy.getPosition({
               top: 100,
               right: 100
            }, item);
            assert.equal(position.maxWidth, item.popupOptions.maxWidth);
            assert.isTrue(position.top === 100);
            assert.isTrue(position.right === 100);
            assert.isTrue(position.bottom === 0);
         });
         it('stack without config sizes', () => {
            StackStrategy.getMaxPanelWidth = () => 1000;
            let item = {
               popupOptions: {},
               containerWidth: 800
            };
            var position = StackStrategy.getPosition({
               top: 0,
               right: 0
            }, item);
            assert.equal(position.width, undefined);
            assert.isTrue(position.top === 0);
            assert.isTrue(position.right === 0);
            assert.isTrue(position.bottom === 0);

            item.containerWidth = 1200;
            position = StackStrategy.getPosition({
               top: 0,
               right: 0
            }, item);
            assert.equal(position.width, undefined);
         });

         it('stack with wrong options type', () => {
            let item = {
               popupOptions: {
                  minWidth: '600',
                  maxWidth: '800'
               }
            };
            var position = StackStrategy.getPosition({
               top: 0,
               right: 0
            }, item);
            assert.equal(position.maxWidth, parseInt(item.popupOptions.maxWidth, 10));
         });

         it('stack reduced width', () => {
            StackStrategy.getMaxPanelWidth = () => 1000;
            let item = {
               popupOptions: {
                  minWidth: 600,
                  maxWidth: 1800
               }
            };
            var position = StackStrategy.getPosition({
               top: 0,
               right: 0
            }, item);
            assert.isTrue(position.top === 0);
            assert.isTrue(position.right === 0);
            assert.isTrue(position.bottom === 0);
         });

         it('stack reset offset', () => {
            let item = {
               popupOptions: {
                  minWidth: 800,
                  maxWidth: 1800
               }
            };
            var position = StackStrategy.getPosition({
               top: 0,
               right: 400
            }, item);
            assert.equal(position.width, item.popupOptions.minWidth);
            assert.isTrue(position.top === 0);
            assert.isTrue(position.right === 0);
            assert.isTrue(position.bottom === 0);
         });

         it('stack width', () => {
            let item = {
               popupOptions: {
                  minWidth: 800,
                  width: 900,
                  maxWidth: 1200
               }
            };
            let position = StackStrategy.getPosition({
               top: 0,
               right: 400
            }, item);
            assert.equal(position.width, 900);

            item.popupOptions.width = 1200;
            position = StackStrategy.getPosition({
               top: 0,
               right: 400
            }, item);
            assert.equal(position.maxWidth, 1000); //В тесте getMaxPanelWidth === 1000
            assert.equal(position.width, 1000);
            assert.equal(position.right, 0);
         });

         it('stack max width', () => {
            StackStrategy.getMaxPanelWidth = () => 1000;
            let tCoords = {
               right: 100
            };
            let popupOptions = {};
            let maxWidth = StackStrategy._private.calculateMaxWidth(StackStrategy, popupOptions, tCoords);
            assert.equal(maxWidth, 1000);

            popupOptions.maxWidth = 400;
            maxWidth = StackStrategy._private.calculateMaxWidth(StackStrategy, popupOptions, tCoords);
            assert.equal(maxWidth, 400);

            popupOptions.maxWidth = 2000;
            maxWidth = StackStrategy._private.calculateMaxWidth(StackStrategy, popupOptions, tCoords);
            assert.equal(maxWidth, 900);

            popupOptions.minWidth = 1000;
            maxWidth = StackStrategy._private.calculateMaxWidth(StackStrategy, popupOptions, tCoords);
            assert.equal(maxWidth, 1000);
         });

         it('stack optimize open', (done) => {
            const Controller = popupTemplate.StackController;
            Controller._stack.clear();
            const basePrepareSize = Controller._private.prepareSizes;
            const basePrepareSizeWithoutDom = Controller._private.prepareSizeWithoutDOM;
            const baseUpdate = Controller._update;
            let isPrepareSizeCalled = false;
            let isPrepareSizeWithoutDomCalled = false;
            let isUpdateCalled = false;

            Controller._private.prepareSizes = () => {
               isPrepareSizeCalled = true;
            };
            Controller._private.prepareSizeWithoutDOM = () => {
               isPrepareSizeWithoutDomCalled = true;
            };
            Controller._update = () => {
               isUpdateCalled = true;
            };
            let item = {
               position: { width: 720 },
               popupOptions: { stackClassName: '' }
            };

            Controller.getDefaultConfig(item)
               .then(() => {
                  assert.equal(isPrepareSizeCalled, false);
                  assert.equal(isPrepareSizeWithoutDomCalled, true);
                  assert.equal(isUpdateCalled, false);

                  isPrepareSizeWithoutDomCalled = false;
                  Controller.elementCreated(item);
                  assert.equal(isPrepareSizeCalled, false);
                  assert.equal(isPrepareSizeWithoutDomCalled, true);
                  assert.equal(isUpdateCalled, false);

                  isPrepareSizeWithoutDomCalled = false;
                  Controller._stack.add({
                     position: { width: 720 },
                     popupOptions: { stackClassName: '' }
                  });
                  Controller.elementCreated(item);
                  assert.equal(isPrepareSizeCalled, true);
                  assert.equal(isPrepareSizeWithoutDomCalled, false);
                  assert.equal(isUpdateCalled, true);

                  Controller._private.prepareSizes = basePrepareSize;
                  Controller._private.prepareSizeWithoutDOM = basePrepareSizeWithoutDom;
                  Controller._update = baseUpdate;
                  done();
               });
         });

         it('stack compatible popup', (done) => {
            let item = {
               popupOptions: {
                  template: {},
                  minWidth: 800,
                  maxWidth: 900,
                  isCompoundTemplate: true
               }
            };
            popupTemplate.StackController.getDefaultConfig(item)
               .then(() => {
                  assert.equal(item.position.top, -10000);
                  assert.equal(item.position.left, -10000);

                  let targetPos = {
                     top: 0,
                     right: 0
                  };

                  popupTemplate.StackController._private.getStackParentCoords = () => targetPos;

                  popupTemplate.StackController.elementCreated(item);
                  assert.equal(item.position.width, undefined);
                  done();
               });
         });

         it('stack resizing', () => {
            let item = {
               popupOptions: {
                  template: {},
                  stackMinWidth: 500,
                  stackMaxWidth: 1200,
                  stackWidth: 700
               },
               position: {
                  width: 0
               }
            };
            let offset1 = 100, offset2 = -300;
            popupTemplate.StackController.popupResizingLine(item, offset1);
            assert.equal(item.popupOptions.stackWidth, 800);
            popupTemplate.StackController.popupResizingLine(item, offset2);
            assert.equal(item.popupOptions.stackWidth, 500);
         });
         it('stack resizing', () => {
            let stackContentInstance = new popupTemplate.StackContent.default({});
            let item = {
               stackMinWidth: 500,
               stackMaxWidth: 1200,
               stackWidth: 700
            };
            stackContentInstance._beforeMount(item);
            assert.equal(stackContentInstance._minOffset, 200);
            assert.equal(stackContentInstance._maxOffset, 500);
            item.stackWidth += 200;
            stackContentInstance._beforeUpdate(item);
            assert.equal(stackContentInstance._minOffset, 400);
            assert.equal(stackContentInstance._maxOffset, 300);
         });
      });
   });
