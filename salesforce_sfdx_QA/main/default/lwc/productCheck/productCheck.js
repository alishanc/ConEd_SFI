import { LightningElement, track, api } from 'lwc';
import OmniscriptSelect from 'vlocity_cmt/omniscriptSelect';
import { OmniscriptOptionsMixin } from "vlocity_cmt/omniscriptOptionsMixin";
import template from './productCheck.html';
import { OmniscriptBaseMixin } from 'vlocity_cmt/omniscriptBaseMixin';
import { getDataHandler } from "vlocity_cmt/utility";

export default class CoolingSystemInput extends OmniscriptBaseMixin(OmniscriptOptionsMixin(OmniscriptSelect)){
    
    @track jsonData = this.jsonData

    newOptions = []
    checkExtract = false
    promoAvail = []
    promoActive = false
    
    connectedCallback() {
        super.connectedCallback();

    }

    assignNewOptions (data) {
        // console.log("omniJsonData stuff => ", this.omniJsonDef.propSetMap.label)
        let changedData = JSON.parse(data)
        console.log("data? => ", changedData)
        if (changedData.length > 0) {
            changedData.forEach(measure => {
                console.log("measure => ", measure)
                if (measure.ActivePromotion == true){
                    this.newOptions.push({"value": measure.Name, "label": (measure.Name + " --(Promtion Available)--")})
                    this.promoAvail.push({"name": measure.Name})
                    console.log("new options => " + this.newOptions)
                    this.omniApplyCallResp({"PromoList": [{[measure.Name]: measure.Name}]})
                }
                else {
                    this.newOptions.push({"value": measure.Name, "label": measure.Name})
                    console.log("new options => " + this.newOptions)
                }
    
            })
            this._realtimeOptions = this.newOptions
            console.log("Promo => ", this.promoAvail)
        }
    }

    // testRemove(e) {
    //     console.log('test1', e.target);
    //     console.log('test1', e.value);
    //     console.log('test1', e.detail);

    //     this.execute();
    // }

    render (){
        let combobox = this.template.querySelector("vlocity_cmt-combobox")
        if (combobox) {
            console.log("value worked => ", combobox.value)
            this.promoAvail.forEach(promo => {
                if (combobox.value == promo.name){
                    this.promoActive = true
                }
                else {
                    this.promoActive = false
                }
            })
        }
        if (this.checkExtract == false){
            console.log("Label for select?: => ", this.jsonDef.propSetMap.measureType);
        
        
        
            let obj = {
                MeasureType: this.jsonDef.propSetMap.measureType
            };

            console.log("measure type => ", obj)
    
            let inputObj = JSON.stringify(obj);
    
            let datasourcedef = JSON.stringify({
                "type": "dataraptor",
                "value": {
                    "bundleName": "GetProductForEstimate",
                    "inputMap": inputObj
                }
            });
    
            // calling GetSelectedValues DataRaptor to get SelectedAnswers JSON from sObject
            getDataHandler(datasourcedef).then(data => {
                console.log(`DR data => ${data}`);
                this.assignNewOptions(data);
                this.checkExtract = true
            }).catch(error => {
                console.log(`failed at getting DR data => ${JSON.stringify(error)}`);
            });
        
        
        
        
        }
        return template;
    }
}