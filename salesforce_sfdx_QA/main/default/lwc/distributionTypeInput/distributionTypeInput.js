import { LightningElement, track, api } from 'lwc';
import OmniscriptSelect from 'vlocity_cmt/omniscriptSelect';
import { OmniscriptOptionsMixin } from "vlocity_cmt/omniscriptOptionsMixin";
import template from './distributionTypeInput.html';
import { OmniscriptBaseMixin } from 'vlocity_cmt/omniscriptBaseMixin';

export default class DistributionTypeInput extends OmniscriptOptionsMixin(OmniscriptSelect) {

    _initialOptions

    @track jsonData = this.jsonData


    listLargeCommercial = [
        {"value": "none", "label": "--Clear--"},
        {"value": "CV with Economizer", "label": "CV with Economizer"},
        {"value": "CV no Economizer", "label": "CV no Economizer"},
        {"value": "VAV with Economizer", "label": "VAV with Economizer"},
        {"value": "Fan Coil", "label": "Fan Coil"},
        {"value": "Other", "label": "Other"},
        {"value": "Not Applicable", "label": "Not Applicable"}
    ]

    dormValues = [
        {"value": "none", "label": "--Clear--"},
        {"value": "Fan Coil", "label": "Fan Coil"},
        {"value": "Other", "label": "Other"}
    ]

    listNA = [
        {"value": "none", "label": "--Clear--"},
        {"value": "Not Applicable", "label": "Not Applicable"},
    ]

    runOptionsMapping (type) {
        switch (type) {
            case "large":
                this._realtimeOptions = this.listLargeCommercial;
                break;
            case "small":
                this._realtimeOptions = this.dormValues;
                break;
            case "NA":
                this._realtimeOptions = this.listNA;
                break;
        }
        

    }

    connectedCallback() {
        super.connectedCallback();

    }


    render() {
        if (this.jsonData.BuildingAndHvac){
            var valuetopass = this.jsonData.BuildingAndHvac.BuildingTypeBlock.BuildingTypeSelect
            // var valuetopass = this.jsonData.BuildingTypeStep.BuildingTypeBlock.BuildingTypeSelect
            switch (valuetopass) {
                case "Dormitory":
                    this.runOptionsMapping("small");
                    break;
                case "Penitentiary":
                    this.runOptionsMapping("NA");
                    break;
                default:
                    this.runOptionsMapping("large");
                    break;

            }
        }
        return template;
    }

}