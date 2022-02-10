import { LightningElement } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_cmt/omniscriptBaseMixin';
import { NavigationMixin } from 'lightning/navigation';
import template from './osNavButtons.html';
import { OmniscriptActionCommonUtil } from 'vlocity_cmt/omniscriptActionUtils';


export default class osNavButtons extends OmniscriptBaseMixin(NavigationMixin(LightningElement)) {

    estimateIdEleCheck = false

    connectedCallback() {
        this._actionUtilClass = new OmniscriptActionCommonUtil();
        this.btnTwoLabel = ((this.omniJsonData.STEP_EnterAccountNumber?.TXT_AccountNumber && this.omniJsonDef.propSetMap.btnTwoLabel == 'Convert to a Project') ? 'Back to Project' : this.omniJsonDef.propSetMap.btnTwoLabel);
    }

    get showMeasureTypeBtn() {
        return this.omniJsonDef.propSetMap.showMeasureTypeBtn;
    }

    get showPreviousBtn() {
        return ((this.omniJsonDef.propSetMap.btnOneType == 'previous') || (this.omniJsonDef.propSetMap.btnOneType == 'saveEstimate'));
    }
    
    render() {
        this.btnOneLabel = this.omniJsonDef.propSetMap.btnOneLabel;
        this.btnOneType = this.omniJsonDef.propSetMap.btnOneType;
        this.btnTwoType = this.omniJsonDef.propSetMap.btnTwoType;
        this.runDeletion = this.omniJsonDef.propSetMap.runDeletion;

        console.log("Ele check =>", this.omniJsonDef.propSetMap.EligibilityCheck)
        console.log("elegibility => ", this.omniJsonData.Eligibility)
        if(this.omniJsonDef.propSetMap.EligibilityCheck == true && this.omniJsonData.Eligibility == "True" && this.estimateIdEleCheck == false && !this.omniJsonData.EstimateId){
            let programSelected = this.omniJsonData.EligibilityProgram
            let estimateId = ""
            let d = new Date();
            let year = d.getFullYear();
            let randomNumber = Math.floor(100000 + Math.random() * 900000);
            
            if (programSelected == "Energy Efficiency"){
                estimateId = `EST-CIEE${year}${randomNumber}`
                this.omniApplyCallResp({"EstimateId": estimateId});
            }
            else if (programSelected == "Clean Heat"){
                estimateId = `EST-CICH${year}${randomNumber}`
                this.omniApplyCallResp({"EstimateId": estimateId});
            }
            this.estimateIdEleCheck = true
        }

        return template;
    }

    handleClick(e) {
        console.log('jsonDef: ', JSON.stringify(this.omniJsonDef));
        let btnType = e.target.dataset.id;
        switch (btnType) {
            case 'measureTypes':
                this.omniNavigateTo('MeasureType');
                break;
            case "previous":
                this.omniPrevStep();
                break;
            case "next":
                if (this.runDeletion && this.omniJsonData.MeasureSelection) {
                    let measureTypes = [{
                        "measureType": "Building Shell",
                        "measureAbbv": "BS"
                    },
                    {
                        "measureType": "Compressed Air",
                        "measureAbbv": "ComAir"
                    },
                    {
                        "measureType": "HVACMain",
                        "measureAbbv": "HVAC"
                    },
                    {
                        "measureType": "HVACControl",
                        "measureAbbv": "HVACC"
                    },
                    {
                        "measureType": "LightingMain",
                        "measureAbbv": "LIG"
                    },
                    {
                        "measureType": "Motors and Drives",
                        "measureAbbv": "MAD"
                    },
                    {
                        "measureType": "RefrigerationMain",
                        "measureAbbv": "REFRIG"
                    },
                    {
                        "measureType": "Motors and Drives",
                        "measureAbbv": "REFRCON"
                    },
                    {
                        "measureType": "Domestic Hot Water - Control",
                        "measureAbbv": "DHWC"
                    },
                    {
                        "measureType": "Custom",
                        "measureAbbv": "CUST"
                    },
                ];
                console.log('ugh: ', JSON.stringify(this.omniJsonData));

                measureTypes.forEach(parentMeasure => {
                    console.log('parentMeasasfdure: ', (this.omniJsonData[parentMeasure.measureAbbv]?.[parentMeasure.measureAbbv + '_Measures']));
                    console.log('includes: ', this.omniJsonData.MeasureType.MeasureTypeMultiSelect.includes(parentMeasure.measureType));
                    if ((!this.omniJsonData.MeasureType.MeasureTypeMultiSelect.includes(parentMeasure.measureType)) && (this.omniJsonData[parentMeasure.measureAbbv]?.[parentMeasure.measureAbbv + '_Measures'])) {
                        console.log('needs deletion');
                        if (Array.isArray(this.omniJsonData[parentMeasure.measureAbbv][parentMeasure.measureAbbv + '_Measures'])) {
                            console.log('is array');
                            this.omniJsonData[parentMeasure.measureAbbv][parentMeasure.measureAbbv + '_Measures'].forEach(measure => {           
                                console.log("measure: ", JSON.stringify(measure));                          
                                for (const [key, value] of Object.entries(measure)) {
                                    if (key.includes("AppLineId")) {
                                        return this.deleteAppLine(value);
                                    }
                                }
                            });
                        } else {
                            for (const [key, value] of Object.entries(this.omniJsonData[parentMeasure.measureAbbv][parentMeasure.measureAbbv + '_Measures'])) {
                                console.log('not array');
                                if (key.includes("AppLineId")) {
                                    return this.deleteAppLine(value);
                                }
                            }
                        }
                    }
                });
                }
                this.omniNextStep();
                break;
            case "saveEstimate":       
                this.omniUpdateDataJson("saveEstimate", true);
                this.omniNextStep();
                break;
            case "createProject":
                this.omniUpdateDataJson("createProject", true);
                this.omniNextStep();
                break;
            // case "dashboard":
            //     this[NavigationMixin.Navigate]({
            //         type: 'standard__namedPage',
            //         attributes: {
            //             pageName: 'myprojects'
            //         },
            //     });
            //     break;
        }

        if (this.omniJsonDef.propSetMap.programSelect && !this.omniJsonData.EstimateId){
            console.log("This worked! => ", this.omniJsonData.ProgramSelection.ProgramSelect)
            let programSelected = this.omniJsonData.ProgramSelection.ProgramSelect
            let estimateId = ""
            let d = new Date();
            let year = d.getFullYear();
            let randomNumber = Math.floor(100000 + Math.random() * 900000);
            
            if (programSelected == "Energy Efficiency"){
                estimateId = `EST-CIEE${year}${randomNumber}`
                this.omniApplyCallResp({"EstimateId": estimateId});
            }
            else if (programSelected == "Clean Heat"){
                estimateId = `EST-CICH${year}${randomNumber}`
                this.omniApplyCallResp({"EstimateId": estimateId});
            }
        }
    }

    deleteAppLine(input) {
        let params = {
            input: { 'AppLineId': input },
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
}