import OmniscriptBlock from 'vlocity_cmt/omniscriptBlock';
import template from './customBlock_nds.html';
import { OmniscriptBaseMixin } from 'vlocity_cmt/omniscriptBaseMixin';

export default class CustomBlock extends OmniscriptBaseMixin(OmniscriptBlock) {
    
    // handleBlur(evt) {
    //     this.omniUpdateDataJson(evt.target.value);
    // }
    
    // goToStep() {
    //     console.log("This is the stepName: ", JSON.stringify(this.omniJsonDef.propSetMap.stepName));
    //     // this.omniNavigateTo(this.omniScriptHeaderDef.asIndex - 2);
    //     //console.log("this is the formattedStepName: ", this.formattedStepname)
    //     this.omniNavigateTo(this.omniJsonDef.propSetMap.stepName);    
    // }
    
    render(){
        return template;
    }
    
}