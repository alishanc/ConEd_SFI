import { LightningElement, api, track } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_cmt/omniscriptBaseMixin';

export default class CeNavButton extends OmniscriptBaseMixin(LightningElement) {

    handleClick(){
        let step = "MeasureType";
        this.omniNavigateTo(step);
    }
}