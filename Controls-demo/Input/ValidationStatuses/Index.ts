import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/ValidationStatuses/ValidationStatuses');
import 'css!Controls-demo/Controls-demo';

class ValidationStatuses extends Control<IControlOptions> {
    protected _validValue = ValidationStatuses._defaultValue;
    protected _invalidValue = ValidationStatuses._defaultValue;
    protected _invalidAccentValue = ValidationStatuses._defaultValue;
    protected _placeholder = 'Tooltip';

    protected _template: TemplateFunction = controlTemplate;

    private static _defaultValue = 'text';
    static _theme: string[] = ['Controls/Classes'];
}

export default ValidationStatuses;
