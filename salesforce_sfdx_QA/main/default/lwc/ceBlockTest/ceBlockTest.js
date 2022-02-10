import { LightningElement, api, track } from 'lwc';
import OmniScriptBlock from 'vlocity_cmt/omniscriptBlock';
import template from './ceBlockTest.html';

export default class CeEditBlock extends OmniScriptBlock {

    newLabel = "Measure Type";

    connectedCallback() {
        super.connectedCallback(); 
    }

    render() {
        return template;
    }

    stateRefresh() {
        let childJsonDef = JSON.parse(JSON.stringify(this.jsonDef.response));
        console.log('CHILDJSONDEF: ', childJsonDef);
        
        for (var key in childJsonDef) {
            if (key.includes('_MeasureTypeName')) {
                this.newLabel = childJsonDef[key];
            }
        }
    }
}