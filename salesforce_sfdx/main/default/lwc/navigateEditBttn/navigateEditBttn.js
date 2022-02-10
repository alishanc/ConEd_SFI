import template from './navigateEditBttn.html';
import { LightningElement,api } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_cmt/omniscriptBaseMixin';

export default class navigateEditBttn extends OmniscriptBaseMixin(LightningElement) {

    //read the step which you'd like to navigate to from props
    //@api stepname;
    //find name of step from omni json mapping
    //omniJson = JSON.parse(JSON.stringify(this.omniJsonDef.propSetMap));

    handleBlur(evt) {
        this.omniUpdateDataJson(evt.target.value);
    }
    goToStep(stepName) {
        console.log("This is the stepName: ", JSON.stringify(this.omniJsonDef.propSetMap.stepName));
        
        // this.omniNavigateTo(this.omniScriptHeaderDef.asIndex - 2);
        //console.log("this is the formattedStepName: ", this.formattedStepname)
        this.omniNavigateTo(this.omniJsonDef.propSetMap.stepName);
        
    }
    render() {
        return template;
    }
}