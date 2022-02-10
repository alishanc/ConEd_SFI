import { LightningElement, api, track } from 'lwc';
import OmniscriptBlock from 'vlocity_cmt/omniscriptBlock';
import { OmniscriptBaseMixin } from "vlocity_cmt/omniscriptBaseMixin";
import template from './ceBlock.html';

export default class CeEditBlock extends OmniscriptBaseMixin(OmniscriptBlock) {

    render() {
        return template;
    }

    handleClick(){
        let step = this.jsonDef.propSetMap.routeToStep;
        this.omniNavigateTo(step);
    }
}