import { LightningElement, api } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_cmt/omniscriptBaseMixin';
import { NavigationMixin } from 'lightning/navigation';
import { getNamespaceDotNotation } from 'vlocity_cmt/omniscriptInternalUtils';
import { OmniscriptActionCommonUtil } from 'vlocity_cmt/omniscriptActionUtils';
import template from './osMeasureInput.html';

export default class osMeasureInput extends OmniscriptBaseMixin(NavigationMixin(LightningElement)) {

    _ns = getNamespaceDotNotation();
    _actionUtilClass;
    AppkWH
    arrayCounter = 0
    
    @api isPageLoading = false;

    connectedCallback() {
        this._actionUtilClass = new OmniscriptActionCommonUtil();
       
        // let selectedMeasures = [];
       
        // this.omniJsonData.MeasureSelection[this.omniJsonDef.propSetMap.productType + "Block"][this.omniJsonDef.propSetMap.productType + "Select"].forEach(measure => { 
        //     selectedMeasures.push({[this.omniJsonDef.propSetMap.productNameSpace + "_MeasureName"] : measure});
        // });

        // let seedData = {[this.omniJsonDef.propSetMap.productNameSpace]: { 
        //     [this.omniJsonDef.propSetMap.productNameSpace + "_Measures"]: selectedMeasures}
        // };

        // this.omniApplyCallResp(seedData);     
    }

    render() {   
        return template;
    }

    handleNav(e) {
        switch(e.target.value) {
            case 'previous':
                this.omniPrevStep();
                break;
            case 'measureTypes':
                this.omniNavigateTo('MeasureType');
                break;
        }
    }
    
    handleIP() {
        // let newMeasureArray = JSON.parse(JSON.stringify(this.omniJsonData.MeasureSelection[this.omniJsonDef.propSetMap.productType + "Block"][this.omniJsonDef.propSetMap.productType + "Select"]));
        // this.omniJsonData.MeasureSelection[this.omniJsonDef.propSetMap.productType + "Block"][this.omniJsonDef.propSetMap.productType + "Select"].forEach(measure => { 
        //     if (measure.delete) {
        //         newMeasureArray.splice(newMeasure[measure], 1);
        //         // IP to Delete Action
        //     }
        //     selectedMeasures.push({[this.omniJsonDef.propSetMap.productNameSpace + "_MeasureName"] : measure});

        //     this.omniApplyCallResp({[this.omniJsonDef.propSetMap.productNameSpace]: { 
        //         [this.omniJsonDef.propSetMap.productNameSpace + "_Measures"]: newMeasureArray}
        //     });
        // });

        // this.omniApplyCallResp(seedData);  
        this.isPageLoading = true;
        let newArray = [];
        let newArray2 = [];
        let measureArray = [];
        let parentMeasurePath = this.omniJsonDef.propSetMap.productNameSpace;
        let childMeasuresPath = (this.omniJsonDef.propSetMap.productNameSpace + "_Measures");
        let parentMeasurePath2 = this.omniJsonDef.propSetMap.productNameSpace + "_Docs";
        let childMeasuresPath2 = (this.omniJsonDef.propSetMap.productNameSpace + "2_Measures");
        let measurePath = (this.omniJsonDef.propSetMap.productNameSpace + "_measureNamespace");

        if (this.omniJsonData[parentMeasurePath][childMeasuresPath].length) {
            measureArray = this.omniJsonData[parentMeasurePath][childMeasuresPath];
        } else {
            measureArray.push(this.omniJsonData[parentMeasurePath][childMeasuresPath]);
        }

        console.log('measureArray: ', JSON.stringify(measureArray));
        debugger;
        let measureCounter = 0;
        let totalMeasurecount = this.omniJsonData.totalMeasurecount;
        measureArray.forEach(ele => {            
            let eleData = JSON.parse(JSON.stringify(ele));
            let activeMeasure = eleData[measurePath];
            let innerMeasure = (activeMeasure + "Measures");
            let applineId = (activeMeasure + "AppLineId");

            for (var key in eleData) {
                let stripKey = key.replace((this.omniJsonDef.propSetMap.productNameSpace + "_"), "");
                eleData[stripKey] = eleData[key];
                delete eleData[key];
            }

            let finalMeasure = eleData[innerMeasure];

            for (var key in finalMeasure){
                let stripKey = key.replace((this.omniJsonDef.propSetMap.productNameSpace + "_" + activeMeasure), "");
                finalMeasure[stripKey] = finalMeasure[key];
                delete finalMeasure[key];
            }

            if(eleData[applineId]){ 
                finalMeasure.AppLineId = eleData[applineId]
            }

            finalMeasure.applicationId = this.omniJsonData.DRId_vlocity_cmt__Application__c;
            finalMeasure.userId = this.omniJsonData.userId;
            
            for (var boiler in finalMeasure){
                console.log("boiler => ", boiler)
                console.log("boiler value => ", boiler.value)
            }

            let params = {
                input: JSON.stringify(finalMeasure),
                sClassName: 'vlocity_cmt.IntegrationProcedureService',
                sMethodName: 'EE_CalculateMeasureSavingsAndIncentive1',
                options: '{}'
            };

            console.log("eleData => ", JSON.stringify(finalMeasure))

            this._actionUtilClass
            .executeAction(params, null, this, null, null)
            .then(resp => {
                let respData = JSON.parse(JSON.stringify(resp.result.IPResult.incentives));
                let savingData = JSON.parse(JSON.stringify(resp.result.IPResult.savings));
                let respData2 = respData;
                let savingData2 = savingData;
                let finalMeasure2 = finalMeasure;

                for (var key in respData) {
                    let newKey = (this.omniJsonDef.propSetMap.productNameSpace + "_" + activeMeasure + key);
                    respData[newKey] = respData[key];
                    delete respData[key];
                }

                for (var key in savingData) {
                    let newKey = (this.omniJsonDef.propSetMap.productNameSpace + "_" + activeMeasure + key);
                    savingData[newKey] = savingData[key];
                    delete savingData[key];
                }

                newArray.push({ ...ele, ...respData, ...savingData });
                console.log("newArray => ", newArray)




                console.log('testing1: ', JSON.stringify(ele));



                for (var key in respData2) {
                    let newKey = key.replace((this.omniJsonDef.propSetMap.productNameSpace + "_" + activeMeasure), this.omniJsonDef.propSetMap.productNameSpace + "2_");
                    respData2[newKey] = respData2[key];
                    delete respData2[key];
                }
        
                for (var key in savingData2) {
                    let newKey = key.replace((this.omniJsonDef.propSetMap.productNameSpace + "_" + activeMeasure), this.omniJsonDef.propSetMap.productNameSpace + "2_");
                    savingData2[newKey] = savingData2[key];
                    delete savingData2[key];
                }

                for (var key in finalMeasure2) {
                    let newKey = (this.omniJsonDef.propSetMap.productNameSpace + "2_" + key);
                    finalMeasure2[newKey] = finalMeasure2[key];
                    delete finalMeasure2[key];
                }

                
                // newArray2.push({ ...ele, ...respData2, ...savingData2});

                finalMeasure2[this.omniJsonDef.propSetMap.productNameSpace + "2_MeasureName"] = ele[this.omniJsonDef.propSetMap.productNameSpace + "_MeasureName"];

                newArray2.push({...finalMeasure2, ...savingData2, ...respData2});

                this.applicationInformation = JSON.stringify(resp.result.IPResult.application.TotalAppIncentive)
                this.appkWH = JSON.stringify(resp.result.IPResult.application.TotalkWH)
                this.appkW = JSON.stringify(resp.result.IPResult.application.TotalkW)
                this.appMMBTU = JSON.stringify(resp.result.IPResult.application.TotalMMBTU)
                this.appNetCost = JSON.stringify(resp.result.IPResult.application.TotalNetCost)
                this.appProjectCost = JSON.stringify(resp.result.IPResult.application.TotalProjectCost)
                this.appTherm = JSON.stringify(resp.result.IPResult.application.TotalTherm)
                this.appCO2 = JSON.stringify(resp.result.IPResult.application.TotalCO2)
                this.appROI = JSON.stringify(resp.result.IPResult.application.TotalROI) + "%"
                this.appAnnual = JSON.stringify(resp.result.IPResult.application.TotalAnnualSavings)
                this.appPB = JSON.stringify(resp.result.IPResult.application.TotalPB)
                this.projectStatus = JSON.stringify(resp.result.IPResult.application.TotalStatus)
                this.projectId = JSON.stringify(resp.result.IPResult.application.TotalProjectId)

                this.omniApplyCallResp({
                "MeasureDate": this.listOfMeasures,
                "AppIncentives": this.applicationInformation,
                "totalIncentives": resp.result.IPResult.application.totalIncentives,
                "AppkWH": this.appkWH,
                "AppkW": this.appkW,
                "AppMMBTU": this.appMMBTU,
                "AppNetCost": this.appNetCost,
                "AppTherm": this.appTherm,
                "AppCO2": this.appCO2,
                "AppProject": this.appProjectCost,
                "AppPB": this.appPB,
                "AppAnnual": this.appAnnual,
                "AppROI": this.appROI,
                "AppStatus": this.projectStatus,
                "AppProjectId": this.projectId
                });

                //__________________

                // this.omniApplyCallResp({[parentMeasurePath]: {[childMeasuresPath]: newArray}});


                console.log("counter => ", this.arrayCounter, " <=>  array length => ", measureArray.length)
                this.arrayCounter ++
                if (this.arrayCounter == measureArray.length){
                    console.log("Counter successful!");

                    this.omniApplyCallResp({'testing': {[childMeasuresPath2]: newArray2}});

                    this.omniApplyCallResp({'STEP_MeasureDocs': {[childMeasuresPath2]: newArray2}});
                    this.omniApplyCallResp({[parentMeasurePath]: {[childMeasuresPath]: newArray}});
                }
                
                measureCounter ++

                // here

                // console.log('RESP JSON: ', JSON.stringify(resp.result.IPResult));

                
                // this.omniApplyCallResp(
                //     {["measureInfo" + (measureCounter + totalMeasurecount)]: { 
                //         "name": eleData.MeasureName,
                //         "type": eleData.MeasureCategory,
                //         "quantity": (eleData.quantity || eleData.units),
                //         "cost": resp.result.IPResult.savings.measureCost,
                //         "incentive": resp.result.IPResult.output[0].Total_Incentive__c
                // }});
                    
                // end




                if (measureArray.length == measureCounter){
                    (resp.result.IPResult.application.BusinessDevManager ? this.omniApplyCallResp({'BusinessDevManager': resp.result.IPResult.application.BusinessDevManager}) : null);
                    this.omniApplyCallResp({'UserInfo': resp.result.IPResult.application.UserInfo});
                    this.isPageLoading = false;
                    this.omniNextStep(); 
                }
            })
            .catch(error => {
                console.log("ERR: ", error);
            });
        });
    }
}