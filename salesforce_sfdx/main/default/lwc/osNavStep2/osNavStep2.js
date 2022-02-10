import { LightningElement, api } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_cmt/omniscriptBaseMixin';
import { NavigationMixin } from 'lightning/navigation';
import { getNamespaceDotNotation } from 'vlocity_cmt/omniscriptInternalUtils';
import { OmniscriptActionCommonUtil } from 'vlocity_cmt/omniscriptActionUtils';
import template from './osNavStep2.html';

export default class osNavStep2 extends OmniscriptBaseMixin(NavigationMixin(LightningElement)) {

    _ns = getNamespaceDotNotation();
    _actionUtilClass;

    connectedCallback() {
        this._actionUtilClass = new OmniscriptActionCommonUtil();
    }

    render() {   
        return template;
    }

    handlePrevious() {
        this.omniPrevStep();
    }

    handleNext() {
        let MAD_Measures = [];
        let BS_Measures = [];
        let REFRCON_Measures = [];
        let HVAC_Measures = [];
        let LIG_Measures = [];
        let LIGC_Measures = [];
        let ComAir_Measures = [];
        let REFRIG_Measures = [];
        let CUST_Measures = [];
        let DHW_Measures = [];
        let AllSelectedMeasures = [];

        if (this.omniJsonData.MeasureSelection.MotorsandDrivesBlock) {
            if (typeof this.omniJsonData.MeasureSelection.MotorsandDrivesBlock.MotorsandDrivesSelect === 'string') {
                MAD_Measures.push({"MAD_MeasureName": this.omniJsonData.MeasureSelection.MotorsandDrivesBlock.MotorsandDrivesSelect});
            } else if (typeof this.omniJsonData.MeasureSelection.MotorsandDrivesBlock.MotorsandDrivesSelect === 'object') {
                MAD_Measures = this.omniJsonData.MeasureSelection.MotorsandDrivesBlock ? this.omniJsonData.MeasureSelection.MotorsandDrivesBlock.MotorsandDrivesSelect.map((str) => ({ MAD_MeasureName: str })) : null;
            }
        } 

        if (this.omniJsonData.MeasureSelection.LightingMainBlock) {
            if (typeof this.omniJsonData.MeasureSelection.LightingMainBlock.LightingMainSelect === 'string') {
                LIG_Measures.push({"LIG_MeasureName": this.omniJsonData.MeasureSelection.LightingMainBlock.LightingMainSelect});
            } else if (typeof this.omniJsonData.MeasureSelection.LightingMainBlock.LightingMainSelect === 'object') {
                LIG_Measures = this.omniJsonData.MeasureSelection.LightingMainBlock ? this.omniJsonData.MeasureSelection.LightingMainBlock.LightingMainSelect.map((str) => ({ LIG_MeasureName: str })) : null;
            }
        }

        if (this.omniJsonData.MeasureSelection.LightingControlBlock) {
            if (typeof this.omniJsonData.MeasureSelection.LightingControlBlock.LightingControlSelect === 'string') {
                LIGC_Measures.push({"LIGC_MeasureName": this.omniJsonData.MeasureSelection.LightingControlBlock.LightingControlSelect});
            } else if (typeof this.omniJsonData.MeasureSelection.LightingControlBlock.LightingControlSelect === 'object') {
                LIGC_Measures = this.omniJsonData.MeasureSelection.LightingControlBlock ? this.omniJsonData.MeasureSelection.LightingControlBlock.LightingControlSelect.map((str) => ({ LIGC_MeasureName: str })) : null;
            }
        }

        if (this.omniJsonData.MeasureSelection.BuildingShellBlock) {
            if (typeof this.omniJsonData.MeasureSelection.BuildingShellBlock.BuildingShellSelect === 'string') {
                BS_Measures.push({"BS_MeasureName": this.omniJsonData.MeasureSelection.BuildingShellBlock.BuildingShellSelect});
            } else if (typeof this.omniJsonData.MeasureSelection.BuildingShellBlock.BuildingShellSelect === 'object') {
                BS_Measures = this.omniJsonData.MeasureSelection.BuildingShellBlock ? this.omniJsonData.MeasureSelection.BuildingShellBlock.BuildingShellSelect.map((str) => ({ BS_MeasureName: str })) : null;
            }
        }

        if (this.omniJsonData.MeasureSelection.CompressedAirBlock) {
            if (typeof this.omniJsonData.MeasureSelection.CompressedAirBlock.CompressedAirSelect === 'string') {
                ComAir_Measures.push({"ComAir_MeasureName": this.omniJsonData.MeasureSelection.CompressedAirBlock.CompressedAirSelect});
            } else if (typeof this.omniJsonData.MeasureSelection.CompressedAirBlock.CompressedAirSelect === 'object') {
                ComAir_Measures = this.omniJsonData.MeasureSelection.CompressedAirBlock ? this.omniJsonData.MeasureSelection.CompressedAirBlock.CompressedAirSelect.map((str) => ({ ComAir_MeasureName: str })) : null;
            }
        }

        if (this.omniJsonData.MeasureSelection.HVACBlock) {
            if (typeof this.omniJsonData.MeasureSelection.HVACBlock.HVACSelect === 'string') {
                HVAC_Measures.push({"HVAC_MeasureName": this.omniJsonData.MeasureSelection.HVACBlock.HVACSelect});
            } else if (typeof this.omniJsonData.MeasureSelection.HVACBlock.HVACSelect === 'object') {
                HVAC_Measures = this.omniJsonData.MeasureSelection.HVACBlock ? this.omniJsonData.MeasureSelection.HVACBlock.HVACSelect.map((str) => ({ HVAC_MeasureName: str })) : null;
            }
        }

        if (this.omniJsonData.MeasureSelection.RefrigerationControlBlock) {
            if (typeof this.omniJsonData.MeasureSelection.RefrigerationControlBlock.RefrigerationControlSelect === 'string') {
                REFRCON_Measures .push({"REFRCON_MeasureName": this.omniJsonData.MeasureSelection.RefrigerationControlBlock.RefrigerationControlSelect});
            } else if (typeof this.omniJsonData.MeasureSelection.RefrigerationControlBlock.RefrigerationControlSelect === 'object') {
                REFRCON_Measures  = this.omniJsonData.MeasureSelection.RefrigerationControlBlock ? this.omniJsonData.MeasureSelection.RefrigerationControlBlock.RefrigerationControlSelect.map((str) => ({ REFRCON_MeasureName: str })) : null;
            }
        }

        if (this.omniJsonData.MeasureSelection.RefrigerationMainBlock) {
            if (typeof this.omniJsonData.MeasureSelection.RefrigerationMainBlock.RefrigerationMainSelect === 'string') {
                REFRIG_Measures.push({"REFRIG_MeasureName": this.omniJsonData.MeasureSelection.RefrigerationMainBlock.RefrigerationMainSelect});
            } else if (typeof this.omniJsonData.MeasureSelection.RefrigerationMainBlock.RefrigerationMainSelect === 'object') {
                REFRIG_Measures = this.omniJsonData.MeasureSelection.RefrigerationMainBlock ? this.omniJsonData.MeasureSelection.RefrigerationMainBlock.RefrigerationMainSelect.map((str) => ({ REFRIG_MeasureName: str })) : null;
            }
        } 

        if (this.omniJsonData.MeasureSelection.CustomBlock) {
            if (typeof this.omniJsonData.MeasureSelection.CustomBlock.CustomSelect === 'string') {
                CUST_Measures.push({"CUST_MeasureName": this.omniJsonData.MeasureSelection.CustomBlock.CustomSelect});
            } else if (typeof this.omniJsonData.MeasureSelection.CustomBlock.CustomSelect === 'object') {
                CUST_Measures = this.omniJsonData.MeasureSelection.CustomBlock ? this.omniJsonData.MeasureSelection.CustomBlock.CustomSelect.map((str) => ({ CUST_MeasureName: str })) : null;
            }
        }

        if (this.omniJsonData.MeasureSelection.DHWControlBlock) {
            if (typeof this.omniJsonData.MeasureSelection.DHWControlBlock.DHWControlSelect === 'string') {
                DHW_Measures.push({"DHW_MeasureName": this.omniJsonData.MeasureSelection.DHWControlBlock.DHWControlSelect});
            } else if (typeof this.omniJsonData.MeasureSelection.DHWControlBlock.DHWControlSelect === 'object') {
                DHW_Measures = this.omniJsonData.MeasureSelection.DHWControlBlock ? this.omniJsonData.MeasureSelection.DHWControlBlock.DHWControlSelect.map((str) => ({ DHW_MeasureName: str })) : null;
            }
        }

        AllSelectedMeasures.push({"MeasureTypeName": "Motors and Drives", "MAD_Measures": MAD_Measures});
        AllSelectedMeasures.push({"MeasureTypeName": "HVAC", "HVAC_Measures": HVAC_Measures});
        AllSelectedMeasures.push({"MeasureTypeName": "RefrigerationMain", "REFRIG_Measures": REFRIG_Measures});
        AllSelectedMeasures.push({"MeasureTypeName": "RefrigerationControl", "REFRCON_Measures": REFRCON_Measures});
        AllSelectedMeasures.push({"MeasureTypeName": "Lighting", "LIG_Measures": LIG_Measures});
        AllSelectedMeasures.push({"MeasureTypeName": "BuildingShell", "BS_Measures": BS_Measures});
        AllSelectedMeasures.push({"MeasureTypeName": "LightingControl", "LIGC_Measures": LIGC_Measures});
        AllSelectedMeasures.push({"MeasureTypeName": "CompressedAir", "ComAir_Measures": ComAir_Measures});
        AllSelectedMeasures.push({"MeasureTypeName": "Domestic Hot Water", "DHW_Measures": DHW_Measures});
        AllSelectedMeasures.push({"MeasureTypeName": "Custom", "CUST_Measures": CUST_Measures});

        this.omniUpdateDataJson({"AllSelectedMeasures": AllSelectedMeasures}, false);

        this.omniNextStep();
    }
}