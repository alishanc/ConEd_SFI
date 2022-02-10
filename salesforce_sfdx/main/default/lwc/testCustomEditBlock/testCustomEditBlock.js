import { LightningElement } from 'lwc';
import tmp from './testCustomEditBlock.html';
// import { OmniscriptBaseMixin } from 'vlocity_cmt/omniscriptBaseMixin';
// import { OmniscriptGroupElement } from 'vlocity_cmt/omniscriptBlock';
import OmniscriptBlock from "vlocity_cmt/omniscriptBlock";
// ## ns/omniscriptBlock ⇐ OmniscriptGroupElement
// **Extends**: OmniscriptGroupElement  

export default class TestCustomEditBlock extends OmniscriptBlock {
    render() {
        return tmp;
    }
}