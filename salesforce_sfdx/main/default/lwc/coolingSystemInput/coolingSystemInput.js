import { LightningElement, track, api } from 'lwc';
import OmniscriptSelect from 'vlocity_cmt/omniscriptSelect';
import { OmniscriptOptionsMixin } from "vlocity_cmt/omniscriptOptionsMixin";
import template from './coolingSystemInput.html';
import { OmniscriptBaseMixin } from 'vlocity_cmt/omniscriptBaseMixin';

export default class CoolingSystemInput extends OmniscriptOptionsMixin(OmniscriptSelect) {

    

    connectedCallback() {
        super.connectedCallback();

    }

    handleChange(evt) {
        this.applyCallResp(evt.target.value);
    }


    listLargeCommercial = [
        {"value": "none", "label": "--Clear--"},
        {"value": "Packaged System AC", "label": "Packaged System AC"},
        {"value": "Heat Pump", "label": "Heat Pump"},
        {"value": "Electric Chiller", "label": "Electric Chiller"},
        {"value": "Room/Window AC", "label": "Room/Window AC"},
        {"value": "VRF or VRV", "label": "VRF or VRV"},
        {"value": "PTAC/PTHP", "label": "PTAC/PTHP"},
        {"value": "Other", "label": "Other"},
        {"value": "None", "label": "None"}
    ]

    listSmallCommercial = [
        {"value": "none", "label": "--Clear--"},
        {"value": "Split System AC", "label": "Split System AC"},
        {"value": "Packaged System AC", "label": "Packaged System AC"},
        {"value": "Heat Pump", "label": "Heat Pump"},
        {"value": "Room/Window AC", "label": "Room/Window AC"},
        {"value": "VRF or VRV", "label": "VRF or VRV"},
        {"value": "PTAC/PTHP", "label": "PTAC/PTHP"},
        {"value": "Other", "label": "Other"},
        {"value": "None", "label": "None"}
    ]

    listRefrigWarehouseCooling = [
        {"value": "none", "label": "--Clear--"},
        {"value": "Water Cooled Ammonia Screw Compressors", "label": "Water Cooled Ammonia Screw Compressors"},
        {"value": "Other", "label": "Other"}
    ]

    listMFCooling = [
        {"value": "none", "label": "--Clear--"},
        {"value": "Split System AC", "label": "Split System AC"},
        {"value": "Packaged System AC", "label": "Packaged System AC"},
        {"value": "Heat Pump", "label": "Heat Pump"},
        {"value": "Electric Chiller", "label": "Electric Chiller"},
        {"value": "Room/Window AC", "label": "Room/Window AC"},
        {"value": "VRF or VRV", "label": "VRF or VRV"},
        {"value": "PTAC/PTHP", "label": "PTAC/PTHP"},
        {"value": "Other", "label": "Other"}
    ]

    listSingleFamilyCooling = [
        {"value": "none", "label": "--Clear--"},
        {"value": "Split System AC", "label": "Split System AC"},
        {"value": "Heat Pump", "label": "Heat Pump"},
        {"value": "Room/Window AC", "label": "Room/Window AC"}
    ]

    runOptionsMapping (type) {
        switch (type) {
            case "large":
                this._realtimeOptions = this.listLargeCommercial;
                break;
            case "small":            
            this._realtimeOptions = this.listSmallCommercial;
                break;
            case "refrig":
                this._realtimeOptions = this.listRefrigWarehouseCooling;
                break;
            case "mfCool":
                this._realtimeOptions = this.listMFCooling;
                break;
            case "single":
                this._realtimeOptions = this.listSingleFamilyCooling;
                break;
        }
    }


    render() {
        if (this.jsonData.BuildingAndHvac){
            var valuetopass = this.jsonData.BuildingAndHvac.BuildingTypeBlock.BuildingTypeSelect
            switch (valuetopass) {
                case "Assembly":
                    this.runOptionsMapping("small");
                    break;
                case "Automotive/Transportation Service or Repair Facility":
                    this.runOptionsMapping("small");
                    break;
                case "Bakery":
                    this.runOptionsMapping("small");
                    break;

                case "Banks":
                    this.runOptionsMapping("small");
                    break;

                case "Cafeteria":
                    this.runOptionsMapping("small");
                    break;

                case "College - University":
                    this.runOptionsMapping("large");
                    break;

                case "College - Community":
                    this.runOptionsMapping("large");
                    break;

                case "Commercial Condos":
                    this.runOptionsMapping("small");
                    break;

                case "Convenience Stores":
                    this.runOptionsMapping("small");
                    break;

                case "Convention Center":
                    this.runOptionsMapping("small");
                    break;

                case "Court House":
                    this.runOptionsMapping("large");
                    break;

                case "Dormitory":
                    this.runOptionsMapping("mfCool");
                    break;

                case "Entertainment":
                    this.runOptionsMapping("small");
                    break;

                case "Exercise Center":
                    this.runOptionsMapping("small");
                    break;
                
                case "Grocery/Food Store":
                    this.runOptionsMapping("small");
                    break;

                case "Gymnasium":
                    this.runOptionsMapping("small");
                    break;

                case "Hospital":
                    this.runOptionsMapping("large");
                    break;

                case "Industrial/Manufacturing":
                    this.runOptionsMapping("small");
                    break;

                case "Laundromats":
                    this.runOptionsMapping("small");
                    break;

                case "Library":
                    this.runOptionsMapping("large");
                    break;

                case "Lodging - Hotel":
                    this.runOptionsMapping("large");
                    break;

                case "Lodging - Motel":
                    this.runOptionsMapping("small");
                    break;

                case "Mall Concourse":
                    this.runOptionsMapping("large");
                    break;

                case "Medical Offices":
                    this.runOptionsMapping("small");
                    break;

                case "Motion Picture Theatre":
                    this.runOptionsMapping("small");
                    break;

                case "Museum":
                    this.runOptionsMapping("small");
                    break;

                case "Nursing Homes High-Rise":
                    this.runOptionsMapping("mfCool");
                    break;

                case "Nursing Homes Low-Rise":
                    this.runOptionsMapping("small");
                    break;

                case "Office - Large":
                    this.runOptionsMapping("large");
                    break;

                case "Office - Small":
                    this.runOptionsMapping("small");
                    break;

                case "Parking Garage":
                    this.runOptionsMapping("small");
                    break;

                case "Parking Lot":
                    this.runOptionsMapping("small");
                    break;

                case "Penitentiary":
                    this.runOptionsMapping("mfcool");
                    break;

                case "Performing Arts Theatre":
                    this.runOptionsMapping("small");
                    break;

                case "Police/Firestation":
                    this.runOptionsMapping("small");
                    break;

                case "Post Office":
                    this.runOptionsMapping("small");
                    break;

                case "Pump Stations":
                    this.runOptionsMapping("small");
                    break;

                case "Religious/Church":
                    this.runOptionsMapping("small");
                    break;

                case "Restaurant - Quick Service/Fast Food":
                    this.runOptionsMapping("small");
                    break;

                case "Restaurant - Casual Dining":
                    this.runOptionsMapping("small");
                    break;

                case "Restaurant - Full Service":
                    this.runOptionsMapping("small");
                    break;

                case "Retail - Big Box/Large":
                    this.runOptionsMapping("small");
                    break;

                case "Retail - Small":
                    this.runOptionsMapping("small");
                    break;

                case "School - Jr./Sr. High":
                    this.runOptionsMapping("large");
                    break;

                case "School - Preschool/Elementary":
                    this.runOptionsMapping("small");
                    break;

                case "School - Technical/Vocational":
                    this.runOptionsMapping("small");
                    break;

                case "Small Services":
                    this.runOptionsMapping("small");
                    break;

                case "Sports Arena":
                    this.runOptionsMapping("small");
                    break;

                case "Town Hall":
                    this.runOptionsMapping("small");
                    break;

                case "Transportation":
                    this.runOptionsMapping("small");
                    break;

                case "Warehouse - Refrigerated":
                    this.runOptionsMapping("refrig");
                    break;

                case "Warehouse - Non-Refrigerated":
                    this.runOptionsMapping("small");
                    break;

                case "Waste Water Treatment Plant":
                    this.runOptionsMapping("small");
                    break;

                case "Workshop":
                    this.runOptionsMapping("small");
                    break;

            }
        }
        return template;
    }

}