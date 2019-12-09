import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import {ISourceOptions, IFilter} from 'Controls/interface';
import {Controller as SourceController} from 'Controls/source';
import {RecordSet} from 'Types/collection';
import {ICrud} from 'Types/source';
import * as Clone from 'Core/core-clone';
import {Collection, Tree, CollectionItem} from 'Controls/display';
import Deferred = require('Core/Deferred');
import ViewTemplate = require('wml!Controls/_menu/View/View');
import {SyntheticEvent} from 'Vdom/Vdom';
import {Model} from 'Types/entity';
import {debounce} from 'Types/function';
import {factory} from 'Types/chain';
import scheduleCallbackAfterRedraw from "../Utils/scheduleCallbackAfterRedraw";

type TKeys = string[]|number[];

interface IMenu extends IControlOptions, ISourceOptions, IFilter {
    emptyText: string;
    emptyKey: string|number;
    displayProperty: string;
    parentProperty?: string;
    nodeProperty?: string;
    rootKey?: string|number|null;
    navigation?: object;
    itemTemplate?: Function;
    footerTemplate?: string;
    multiSelect?: boolean;
    selectedKeys?: TKeys;
    selectorTemplate?: Function;
    horizontalAlign: 'left'|'right';
    historyConfig: IHistorySource;
}

interface IHistorySource {
    historyId: string;
    pinned: TKeys|boolean;
    recent: boolean;
    frequent: boolean;
}

const SUB_DROPDOWN_OPEN_DELAY = 100;

class MenuView extends Control<IMenu> {
    protected _template: TemplateFunction = ViewTemplate;
    protected _listModel: Tree;
    protected _hasMoreButton: boolean = false;
    protected _showApplyButton: boolean = false;
    private _sourceController: SourceController = null;
    private _subDropdownItem: Model|null;
    private _openSubDropdown: Function;
    private _selectionChanged: boolean = false;
    private _horizontalAlign: string;

    private needShowApplyButton(newKeys: TKeys, oldKeys: TKeys): boolean {
        const diffKeys = factory(newKeys).filter((key) => !oldKeys.includes(key)).value();
        return newKeys.length !== oldKeys.length || !!diffKeys.length;
    }

    private updateApplyButton() {
        let self = this;
        const isApplyButtonVisible = this._showApplyButton;
        const newSelectedKeys = factory(this._listModel.getSelectedItems()).map(item => {
            return item.getContents().get(self._options.keyProperty);
        }).value();
        this._showApplyButton = this.needShowApplyButton(newSelectedKeys, this._options.selectedKeys);

        if (this._showApplyButton !== isApplyButtonVisible) {
            scheduleCallbackAfterRedraw(this, () => {
                self._notify('controlResize', [], {bubbling: true});
            });
        }
    }

    private createViewModel(items: RecordSet, options: IMenu) {
        if (options.emptyText) {
            let data = {};
            data[options.keyProperty] = options.emptyKey;
            data[options.displayProperty] = options.emptyText;
            items.prepend([new Model({
                keyProperty: options.keyProperty,
                rawData: data
            })]);
        }
        this._listModel = new Tree({
            collection: items,
            keyProperty: options.keyProperty,
            nodeProperty: options.nodeProperty,
            parentProperty: options.parentProperty,
            root: options.rootKey
        });
        this._listModel.setSelectedItems(this.getSelectedItems(this._listModel, options.selectedKeys), true);
        this._listModel.setMultiSelectVisibility(this._options.multiSelect ? 'onhover' : 'hidden');
    }

    private getSourceController({source, navigation, keyProperty}: {source: ICrud, navigation: object, keyProperty: string}): SourceController {
        if (!this._sourceController) {
            this._sourceController = new SourceController({
                source,
                navigation,
                keyProperty
            });
        }
        return this._sourceController;
    }

    private getSelectedItems(listModel: Tree, selectedKeys: TKeys) {
        let items = [];
        factory(selectedKeys).each((key) => {
            if (listModel.getItemBySourceId(key)) {
                items.push(listModel.getItemBySourceId(key).getContents());
            }
        });
        return items;
    }

    private loadItems(options: IMenu): Deferred<RecordSet> {
        const self = this;
        let filter = Clone(options.filter) || {};
        filter[options.parentProperty] = options.rootKey;
        return this.getSourceController(options).load(filter).addCallback((items) => {
            self.createViewModel(items, options);
            return items;
        });
    }

    private openSubDropdown(event: SyntheticEvent<'mouseenter'>, item: CollectionItem): void {
        // _openSubDropdown is called by debounce and a function call can occur when the control is destroyed,
        // just check _children to make sure, that the control isnt destroyed
        if (item && this._children.Sticky && this._subDropdownItem) {
            let templateOptions = Clone(this._options);
            templateOptions.rootKey = item.getContents().get(this._options.keyProperty);
            templateOptions.horizontalAlign = this._horizontalAlign;
            templateOptions.bodyContentTemplate = 'Controls/_menu/View';
            this._children.Sticky.open({
                templateOptions,
                target: event.target,
                autofocus: false,
                direction: {
                    horizontal: this._horizontalAlign
                },
                targetPoint: {
                    horizontal: this._horizontalAlign
                }
            }, this);
        }
    }

    protected _footerClick() {
        // ;
    }

    protected _applySelection() {
        this._notify('sendResult', [this._listModel.getSelectedItems()], {bubbling: true});
    }

    protected _subMenuResult(event: SyntheticEvent, items) {
        this._notify('sendResult', [items], {bubbling: true});
        this._closeSubMenu();
    }

    protected _closeSubMenu(): void {
        if (this._children.Sticky) {
            this._children.Sticky.close();
        }
    }

    protected _onItemMouseEnter(event: SyntheticEvent<MouseEvent>, item: CollectionItem) {
        const needOpenDropDown = item.isNode() && !item.getContents().get('readOnly');
        const needCloseDropDown = this._subDropdownItem !== item;
        // Close the already opened sub menu. Installation of new data sets new size of the container.
        // If you change the size of the update, you will see the container twitch.
        if (needCloseDropDown && !needOpenDropDown) {
            this._children.Sticky.close();
            this._subDropdownItem = null;
        }

        if (needOpenDropDown) {
            this._subDropdownItem = item;
            this._openSubDropdown(event, item);
        }
    }

    protected _onItemClick(event: SyntheticEvent<MouseEvent>, item: CollectionItem) {
        if (event.target.closest('.controls-DropdownList__row-checkbox')) {
            this._selectionChanged = true;
        }
        if (this._options.multiSelect && this._selectionChanged) {
            this._listModel.setMarkedItem(item);
            item.setSelected(!item.isSelected());
            this.updateApplyButton();
        } else {
            this._notify('sendResult', [[item]], {bubbling: true});
        }
    }

    protected _beforeMount(options: IMenu, context: object, receivedState: RecordSet): Deferred<RecordSet> {
        this._openSubDropdown = debounce(this.openSubDropdown.bind(this), SUB_DROPDOWN_OPEN_DELAY);
        this._horizontalAlign = options.horizontalAlign;

        if (options.source) {
            let self = this;
            return this.loadItems(options).addCallback(() => {
                self._hasMoreButton = options.selectorTemplate && self.getSourceController(options).hasMoreData('down');
            });
        }
    }

    protected protected _beforeUpdate(newOptions?: IMenu): void {
        if (newOptions.stickyPosition.direction &&
            (this._horizontalAlign !== newOptions.stickyPosition.direction.horizontal)) {
            this._horizontalAlign = newOptions.stickyPosition.direction.horizontal;
        }
    }

    protected _beforeUnmount(): void {
        if (this._sourceController) {
            this._sourceController.cancelLoading();
            this._sourceController = null;
        }
        this._listModel.destroy();
        this._listModel = null;
    }

    static getDefaultOptions(): object {
        return {
            selectedKeys: [],
            rootKey: null,
            emptyKey: null,
            horizontalAlign: 'right',
            stickyPosition: {}
        };
    }

    static _theme: string[] = ['Controls/menu', 'Controls/dropdownPopup'];
}

export default MenuView;
