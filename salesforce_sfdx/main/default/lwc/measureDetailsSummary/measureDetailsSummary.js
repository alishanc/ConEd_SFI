import { LightningElement, track, api } from 'lwc';
import template from './measureDetailsSummary.html'
import { OmniscriptBaseMixin } from 'vlocity_cmt/omniscriptBaseMixin';
import { getNamespaceDotNotation } from 'vlocity_cmt/omniscriptInternalUtils';
import { OmniscriptActionCommonUtil } from 'vlocity_cmt/omniscriptActionUtils';

export default class MeasureDetailsSummary extends OmniscriptBaseMixin(LightningElement) {

    measureList = []
    _actionUtilClass;
    _ns = getNamespaceDotNotation();
    submitDate
    inspectionDate 

    connectedCallback(){

        this._actionUtilClass = new OmniscriptActionCommonUtil();

        let MADmeasures
        let LIGCmeasures 
        let ComAirmeasures
        let BSmeasures
        let LIGmeasures
        let HVACmeasures
        let HVACCmeasures
        let REFRCONmeasures
        let REFRIGmeasures
        let CUSTmeasures
        let submitDate
        let inspectionDate 

        switch (this.omniJsonDef.propSetMap.productNameSpace){
            case "LIGC":
                this.LIGC = true;
                LIGCmeasures =  this.omniJsonData.LIGC;
                break;
            case "MAD":
                this.MAD = true;
                MADmeasures =  this.omniJsonData.MAD;
                break;
            case "ComAir":
                this.ComAir = true;
                ComAirmeasures = this.omniJsonData.ComAir;
                break;
            case "BS":
                this.BS = true;
                BSmeasures = this.omniJsonData.BS;
                break;
            case "LIG":
                this.LIG = true;
                LIGmeasures =  this.omniJsonData.LIG;
                break;
            case "HVAC":
                this.HVAC = true;
                HVACmeasures =  this.omniJsonData.HVAC;
                break;
            case "HVACC":
                this.HVACC = true;
                HVACCmeasures =  this.omniJsonData.HVACC;
                break;
            case "REFRCON":
                this.REFRCON = true;
                REFRCONmeasures =  this.omniJsonData.REFRCON;
                break;
            case "REFRIG":
                this.REFRIG = true;
                REFRIGmeasures =  this.omniJsonData.REFRIG;
                break;
            case "CUST":
                this.CUST = true;
                CUSTmeasures =  this.omniJsonData.CUST;
                break;
        }

        if (MADmeasures){
            if (MADmeasures.MAD_Measures.length <= 1 || !MADmeasures.MAD_Measures.length){
                this.omniJsonData.PromoList.forEach(promo => {
                    if (promo[MADmeasures.MAD_Measures.MAD_MeasureName]){
                        this.VFDpromo = true
                    }
                })
                this.measureList.unshift(MADmeasures.MAD_Measures);
            }
            
            if(MADmeasures.MAD_Measures.length > 1){
                MADmeasures.MAD_Measures.forEach(measure => {
                    this.omniJsonData.PromoList.forEach(promo => {
                        if (promo[measure.MAD_MeasureName]){
                            this.VFDpromo = true
                        }
                    })
                    this.measureList.unshift(measure)
                })
            }
        }

        if (LIGCmeasures){
            if (LIGCmeasures.LIGC_Measures.length <= 1 || !LIGCmeasures.LIGC_Measures.length){
                this.omniJsonData.PromoList.forEach(promo => {
                    if (promo[LIGCmeasures.LIGC_Measures.LIGC_MeasureName]){
                        // console.log("bil <= 1 ",promo[LIGCmeasures.LIGC_Measures.LIGC_MeasureName] )
                        this.BILpromo = true
                    }
                })
                this.measureList.unshift(LIGCmeasures.LIGC_Measures);
            }
            
            if(LIGCmeasures.LIGC_Measures.length > 1){
                LIGCmeasures.LIGC_Measures.forEach(measure => {
                    this.omniJsonData.PromoList.forEach(promo => {
                        if (promo[measure.LIGC_MeasureName]){
                            // console.log("bil <= 1 ",promo[measure.LIGC_MeasureName] )
                            this.BILpromo = true
                        }
                    })
                    this.measureList.unshift(measure)
                })
            }
        }
        
        if (ComAirmeasures) {
            if (ComAirmeasures.ComAir_Measures.length <= 1 || !ComAirmeasures.ComAir_Measures.length) {
                this.omniJsonData.PromoList.forEach(promo => {
                    if (promo[ComAirmeasures.ComAir_Measures.ComAir_MeasureName]){
                        this.AIRpromo = true
                    }
                })
                this.measureList.unshift(ComAirmeasures.ComAir_Measures);
            }
            
            if (ComAirmeasures.ComAir_Measures.length > 1) {
                ComAirmeasures.ComAir_Measures.forEach(measure => {
                    this.omniJsonData.PromoList.forEach(promo => {
                        if (promo[measure.ComAir_MeasureName]) {
                            this.AIRpromo = true
                        }
                    })
                    this.measureList.unshift(measure)
                })
            }
        }
        
        if (BSmeasures) {
            if (BSmeasures.BS_Measures.length <= 1 || !BSmeasures.BS_Measures.length){
                this.omniJsonData.PromoList.forEach(promo => {
                    if (promo[BSmeasures.BS_Measures.BS_MeasureName]){
                        console.log("bil <= 1 ",promo[BSmeasures.BS_Measures.BS_MeasureName] )
                        this.BILpromo = true
                    }
                })
                this.measureList.unshift(BSmeasures.BS_Measures);
            }
            
            if (BSmeasures.BS_Measures.length > 1) {
                BSmeasures.BS_Measures.forEach(measure => {
                    this.omniJsonData.PromoList.forEach(promo => {
                        if (promo[measure.BS_MeasureName]){
                            console.log("bil <= 1 ",promo[measure.BS_MeasureName] )
                            this.BILpromo = true
                        }
                    })
                    this.measureList.unshift(measure)
                })
            }
        }

        if (LIGmeasures) {
            if (LIGmeasures.LIG_Measures.length <= 1 || !LIGmeasures.LIG_Measures.length){
                this.omniJsonData.PromoList.forEach(promo => {
                    if (promo[LIGmeasures.LIG_Measures.LIG_MeasureName]){
                        console.log("bil <= 1 ",promo[LIGmeasures.LIG_Measures.LIG_MeasureName] )
                        this.CLEDpromo = true
                    }
                })
                this.measureList.unshift(LIGmeasures.LIG_Measures);
            }
            
            if (LIGmeasures.LIG_Measures.length > 1) {
                LIGmeasures.LIG_Measures.forEach(measure => {
                    this.omniJsonData.PromoList.forEach(promo => {
                        if (promo[measure.LIG_MeasureName]){
                            console.log("bil <= 1 ",promo[measure.LIG_MeasureName] )
                            this.CLEDpromo = true
                        }
                    })
                    this.measureList.unshift(measure)
                })
            }
        }

        if (HVACmeasures) {
            if (HVACmeasures.HVAC_Measures.length <= 1 || !HVACmeasures.HVAC_Measures.length){
                this.omniJsonData.PromoList.forEach(promo => {
                    if (promo[HVACmeasures.HVAC_Measures.HVAC_MeasureName]){
                        console.log("bil <= 1 ",promo[HVACmeasures.HVAC_Measures.HVAC_MeasureName] )
                        this.ACUACpromo = true
                    }
                })
                this.measureList.unshift(HVACmeasures.HVAC_Measures);
            }
            
            if (HVACmeasures.HVAC_Measures.length > 1) {
                HVACmeasures.HVAC_Measures.forEach(measure => {
                    this.omniJsonData.PromoList.forEach(promo => {
                        if (promo[measure.HVAC_MeasureName]){
                            console.log("bil <= 1 ",promo[measure.HVAC_MeasureName] )
                            this.ACUACpromo = true
                        }
                    })
                    this.measureList.unshift(measure)
                })
            }
        }
        
        if (HVACCmeasures) {
            if (HVACCmeasures.HVACC_Measures.length <= 1 || !HVACCmeasures.HVACC_Measures.length){
                this.omniJsonData.PromoList.forEach(promo => {
                    if (promo[HVACCmeasures.HVACC_Measures.HVACC_MeasureName]){
                        console.log("bil <= 1 ",promo[HVACCmeasures.HVACC_Measures.HVACC_MeasureName] )
                        // this.ACUACpromo = true
                    }
                })
                this.measureList.unshift(HVACCmeasures.HVACC_Measures);
            }
            
            if (HVACCmeasures.HVACC_Measures.length > 1) {
                HVACCmeasures.HVACC_Measures.forEach(measure => {
                    this.omniJsonData.PromoList.forEach(promo => {
                        if (promo[measure.HVACC_MeasureName]){
                            console.log("bil <= 1 ",promo[measure.HVACC_MeasureName] )
                            // this.ACUACpromo = true
                        }
                    })
                    this.measureList.unshift(measure)
                })
            }
        }

        if (REFRCONmeasures) {
            if (REFRCONmeasures.REFRCON_Measures.length <= 1 || !REFRCONmeasures.REFRCON_Measures.length){
                this.omniJsonData.PromoList.forEach(promo => {
                    if (promo[REFRCONmeasures.REFRCON_Measures.REFRCON_MeasureName]){
                        console.log("bil <= 1 ",promo[REFRCONmeasures.REFRCON_Measures.REFRCON_MeasureName] )
                        this.ACUACpromo = true
                    }
                })
                this.measureList.unshift(REFRCONmeasures.REFRCON_Measures);
            }
            
            if (REFRCONmeasures.REFRCON_Measures.length > 1) {
                REFRCONmeasures.REFRCON_Measures.forEach(measure => {
                    this.omniJsonData.PromoList.forEach(promo => {
                        if (promo[measure.REFRCON_MeasureName]){
                            console.log("bil <= 1 ",promo[measure.REFRCON_MeasureName] )
                            this.ACUACpromo = true
                        }
                    })
                    this.measureList.unshift(measure)
                })
            }
        }

        if (REFRIGmeasures) {
            if (REFRIGmeasures.REFRIG_Measures.length <= 1 || !REFRIGmeasures.REFRIG_Measures.length){
                this.omniJsonData.PromoList.forEach(promo => {
                    if (promo[REFRIGmeasures.REFRIG_Measures.REFRIG_MeasureName]){
                        console.log("bil <= 1 ",promo[REFRIGmeasures.REFRIG_Measures.REFRIG_MeasureName] )
                        this.ACUACpromo = true
                    }
                })
                this.measureList.unshift(REFRIGmeasures.REFRIG_Measures);
            }
            
            if (REFRIGmeasures.REFRIG_Measures.length > 1) {
                REFRIGmeasures.REFRIG_Measures.forEach(measure => {
                    this.omniJsonData.PromoList.forEach(promo => {
                        if (promo[measure.REFRIG_MeasureName]){
                            console.log("bil <= 1 ",promo[measure.REFRIG_MeasureName] )
                            this.ACUACpromo = true
                        }
                    })
                    this.measureList.unshift(measure)
                })
            }
        }

        if (CUSTmeasures) {
            if (CUSTmeasures.CUST_Measures.length <= 1 || !CUSTmeasures.CUST_Measures.length){
                this.omniJsonData.PromoList.forEach(promo => {
                    if (promo[CUSTmeasures.CUST_Measures.CUST_MeasureName]){
                        console.log("bil <= 1 ",promo[CUSTmeasures.CUST_Measures.CUST_MeasureName] )
                        this.ACUACpromo = true
                    }
                })
                this.measureList.unshift(CUSTmeasures.CUST_Measures);
            }
            
            if (CUSTmeasures.CUST_Measures.length > 1) {
                CUSTmeasures.CUST_Measures.forEach(measure => {
                    this.omniJsonData.PromoList.forEach(promo => {
                        if (promo[measure.CUST_MeasureName]){
                            console.log("bil <= 1 ",promo[measure.CUST_MeasureName] )
                            this.ACUACpromo = true
                        }
                    })
                    this.measureList.unshift(measure)
                })
            }
        }
        let testData = {"test": "test"}
        let params = {
            input: JSON.stringify(testData),
            sClassName: 'vlocity_cmt.IntegrationProcedureService',
            sMethodName: 'Promotions_EligibilityRules',
            options: '{}'
        };

        this._actionUtilClass
            .executeAction(params, null, this, null, null)
            .then(resp => {
                let submitResponse = JSON.parse(JSON.stringify(resp.result.IPResult.SubmissionDate[0].PeriodEnd))
                let inspectionResponse = JSON.parse(JSON.stringify(resp.result.IPResult.PostInspectionDate[0].PeriodEnd))
                this.submitDate = submitResponse
                this.inspectionDate = inspectionResponse
                console.log

            })

    }
    
    render (){
        return template
    }

    handleClick(evt){
        let parent = evt.target.getAttribute("data-parent")
        this.omniNavigateTo(parent);
    }
}