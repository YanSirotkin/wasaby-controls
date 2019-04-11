import BaseViewModel = require('Controls/Input/Base/ViewModel');

import Formatter = require('Controls/Input/Mask/Formatter');
import FormatBuilder = require('Controls/Input/Mask/FormatBuilder');
import InputProcessor = require('Controls/Input/Mask/InputProcessor');

import {TimeInterval} from 'Types/entity';

interface IFormatMaskChars {
    D: string;
    H: string;
    M: string;
    S: string;
    U: string;
}

interface IFound {
    end: number;
    value: string;
}

interface ITimeUnits {
    id: string;
    regExp: RegExp;
    limit: boolean;
}

export interface IOptions {
    mask: string;
}

export class ViewModel extends BaseViewModel {
    autoComplete(): boolean {
        if (this.value !== null && this.value.toString() !== 'P0DT0H0M0S') {
            this.displayValue = this._convertToDisplayValue(this.value);

            return true;
        }

        return false;
    }

    handleInput(splitValue, inputType) {
        this._format = FormatBuilder.getFormat(this._options.mask, ViewModel._formatMaskChars, ViewModel._replacer);

        const result = InputProcessor.input(splitValue, inputType, ViewModel._replacer, this._format, this._format);

        return super.handleInput(ViewModel._prepareData(result), inputType);
    }

    protected _convertToValue(displayValue: string) {
        return this._valueToTimeIntervalConverter(displayValue);
    }

    protected _convertToDisplayValue(value) {
        let preResult: string;

        if (value === null) {
            preResult = this._options.mask.replace(/H|M|S/g, ViewModel._replacer);
        } else {
            preResult = this._timeIntervalToValueConverter(value);

            if (preResult.length !== this._options.mask.replace(/:/g, '').length) {
                preResult = this._options.mask.replace(/H/g, 9);
                preResult = preResult.replace(/MM/g, ViewModel._maxValueOfMinutesAndSeconds);
                preResult = preResult.replace(/SS/g, ViewModel._maxValueOfMinutesAndSeconds);
            }
        }

        this._format = FormatBuilder.getFormat(this._options.mask, ViewModel._formatMaskChars, ViewModel._replacer);

        const clearResult = Formatter.getClearData(this._format, preResult);
        const result = Formatter.getFormatterData(this._format, {
            value: clearResult.value,
            position: 0
        }).value;

        return result;
    }

    private _timeIntervalToValueConverter(value) {
        let hours: number | string = value.getDays() * 24 + value.getHours();

        while (hours.toString().length < this._options.mask.match(/H/g).length) {
            hours = '0' + hours.toString();
        }

        let minutes: number | string = value.getMinutes();

        if (minutes.toString().length === 1) {
            minutes = '0' + minutes.toString();
        } else {
            minutes = minutes.toString();
        }

        let seconds: number | string = value.getSeconds();
        let preResult: string;

        if (this._options.mask.match(/S/g) !== null) {
            if (seconds.toString().length === 1) {
                seconds = '0' + seconds.toString();
            } else {
                seconds = seconds.toString();
            }
            preResult = hours + minutes + seconds;
        } else {
            preResult = hours + minutes;
        }

        return preResult;
    }

    private _valueToTimeIntervalConverter(value: string): TimeInterval {
        const parsedValue: Array<number | string> = this._displayValueParser(value);

        const hours: ITimeUnits = {
            id: 'H',
            regExp: /H/g,
            limit: false
        };
        const minutes: ITimeUnits = {
            id: 'M',
            regExp: /M/g,
            limit: true
        };
        const seconds: ITimeUnits = {
            id: 'S',
            regExp: /S/g,
            limit: false
        };

        const formatTimeInterval: string = 'P0DT' +
            ViewModel._formatTimesUnits(
                parsedValue, [hours, minutes, seconds], this._options.mask
            );

        return new TimeInterval(formatTimeInterval);
    }

    private _displayValueParser(value: string): Array<number | string> {
        this._format = FormatBuilder.getFormat(this._options.mask, ViewModel._formatMaskChars, ViewModel._replacer);

        const clearValue = Formatter.getClearData(this._format, value);

        const clearArray: Array<number | string> = [];

        for (let i = 0; i < clearValue.value.length; i++) {
            const item = parseInt(clearValue.value[i], 10);

            if (typeof item === 'number' && !isNaN(item)) {
                clearArray.push(item);
            } else {
                clearArray.push(ViewModel._replacer);
            }
        }

        return clearArray;
    }

    private static _formatMaskChars: IFormatMaskChars = {
        D: '[0-9]',
        H: '[0-9]',
        M: '[0-9]',
        S: '[0-9]',
        U: '[0-9]'
    };

    private static _replacer: string = ' ';

    private static _maxValueOfMinutesAndSeconds: number = 59;

    private static _formatTimesUnits(initialValue: Array<number
                                         | string>, timesUnits: ITimeUnits[], mask: string): string {
        return timesUnits.reduce((format, item) => {
            const countTimeUnits: number | null = ViewModel._countTimeUnits(mask, item.regExp);

            if (countTimeUnits === null) {
                return format;
            }

            const timeUnits: IFound = ViewModel._foundTimeUnits(initialValue, format.start, countTimeUnits);

            if (item.limit && timeUnits.value) {
                timeUnits.value = Math.min(
                    parseInt(timeUnits.value, 10),
                    ViewModel._maxValueOfMinutesAndSeconds
                ).toString();
            }

            return {
                value: ViewModel._addItemFormat(format.value, timeUnits.value, item.id),
                start: timeUnits.end
            };
        }, {
            value: '',
            start: 0
        }).value;
    }

    private static _addItemFormat(original: string, value: string, id: string): string {
        return original + (value || '0') + id;
    }

    private static _foundTimeUnits(original: Array<number | string>, start: number, count: number): IFound {
        const end: number = start + count;
        const value: string = original
            .slice(start, start + count)
            .filter((item) => typeof item === 'number')
            .join('');

        return {end, value};
    }

    private static _countTimeUnits(mask: string, regExp: RegExp): number | null {
        const match = mask.match(regExp);

        return match === null ? null : match.length;
    }

    private static _prepareData(result) {
        const position = result.position;
        return {
            before: result.value.substring(0, position),
            after: result.value.substring(position, result.value.length),
            insert: '',
            delete: ''
        };
    }
}
