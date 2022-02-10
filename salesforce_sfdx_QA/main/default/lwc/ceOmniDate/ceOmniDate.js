import OmniscriptDate from 'vlocity_cmt/omniscriptDate';
import { parseChronoAttributes} from 'vlocity_cmt/omniscriptUtils';
import { handleMergeField, isRepeatNotation } from 'vlocity_cmt/omniscriptInternalUtils';
import tmpl from './ceOmniDate.html';

export default class CeOmniDate extends OmniscriptDate {
    _disableDates = [];
    render() {
        return tmpl;
    }

    connectedCallback() {
        super.connectedCallback();

        if(this._propSetMap.minDate && this._propSetMap.minDate.indexOf('%') > -1) {
            this._min = parseChronoAttributes(this.getMergeField(this._propSetMap.minDate), 'minDate');
        }
        if(this._propSetMap.maxDate && this._propSetMap.maxDate.indexOf('%') > -1) {
            this._max = parseChronoAttributes(this.getMergeField(this._propSetMap.maxDate), 'maxDate');
        }
        if(this.jsonData.InspectionDates) {
            let dates = this.jsonData.InspectionDates.reduce(function(obj, v) {
                obj[v.InspectionDate] = (obj[v.InspectionDate] || 0) + 1;
                return obj;
            }, {});

            for (const [key, val] of Object.entries(dates)) {
                if(val >= this.jsonData.maxDailyAppts) {
                    this._disableDates.push(key);
                }
            };
        }
    }

    getMergeField(mergeFieldString) {
        if (mergeFieldString && this.jsonData && this.scriptHeaderDef && this.jsonDef) {
            return handleMergeField(
                mergeFieldString,
                this.jsonData,
                this.scriptHeaderDef.labelMap,
                isRepeatNotation(mergeFieldString) ? this.jsonDef.JSONPath : null,
                true,
            );
        }
        return null;
    }
}