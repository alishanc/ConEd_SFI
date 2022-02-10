import { LightningElement, api } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_cmt/omniscriptBaseMixin';

export default class OsMultiSelectChoiceConvertTest extends OmniscriptBaseMixin(LightningElement) {
    @api selections
    @api label = "msOptionsSelected"

    renderedCallback(){
        if(this.selections) {
            let updatedSelections = this.selections.split(";");
            let objMap = {};
            updatedSelections.forEach( selection => {
                let newSelection = selection.replace(/[^A-Z0-9]/ig, "")
                objMap[newSelection] = true;
            })

            this.omniApplyCallResp({[this.label]: objMap})
        }

    }
}