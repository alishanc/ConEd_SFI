import { LightningElement, api, track } from 'lwc';
import OmniScriptBlock from 'vlocity_cmt/omniscriptBlock';
import template from './ceBlockTest2.html';
import { OmniscriptBaseMixin } from "vlocity_cmt/omniscriptBaseMixin";
import { getNamespaceDotNotation } from 'vlocity_cmt/omniscriptInternalUtils';
import { OmniscriptActionCommonUtil } from 'vlocity_cmt/omniscriptActionUtils';
import { dispatchOmniEvent } from 'vlocity_cmt/omniscriptUtils';

export default class CeBlockTest2 extends OmniscriptBaseMixin(OmniScriptBlock) {

    newLabel = "Measure";
    _ns = getNamespaceDotNotation();
    _actionUtilClass;
    
    @api get showEdit() {
        return (this.jsonDef.propSetMap?.showEdit);
    }

    @api get showDelete() {
        return (this.jsonDef.propSetMap?.showDelete);
    }

    connectedCallback() {
        super.connectedCallback();

        this._actionUtilClass = new OmniscriptActionCommonUtil();
    }

    render() {
        return template;
    }
   
    handleEdit(){
        let step = this.jsonDef.name.replace("2_Measures", "");
        this.omniNavigateTo(step);
    }

    handleDelete() {
        
        for (const [key, value] of Object.entries(this.jsonDef.response)) {
            if (key.includes("AppLineId")) {
                var appLineId = value;
            }
        }

        if (appLineId) {
            let params = {
                
                input: { 'AppLineId': appLineId },
                sClassName: 'vlocity_cmt.IntegrationProcedureService',
                sMethodName: 'Application_DeleteItem',
                options: '{}'
            };

            this._actionUtilClass
                .executeAction(params, null, this, null, null)
                .then(resp => {
                    console.log('RESP: ', resp);
                })
                .catch(error => {
                    console.log("ERR: ", error);
                });
        }

        this.handleRemove();
    }

    stateRefresh() {
        let childJsonDef = JSON.parse(JSON.stringify(this.jsonDef.response));
        for (var key in childJsonDef) {            
            if (key.includes('_MeasureName')) {
                this.newLabel = childJsonDef[key];
            } 
        }
    }
}