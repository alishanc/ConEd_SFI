// import { OmniscriptGroupElement } from 'vlocity_cmt/omniscriptGroupElement';
import OmniscriptGroupElement from 'vlocity_cmt/omniscriptGroupElement';
import { LightningElement, api, track } from 'lwc';
import { OmniscriptBaseMixin } from "vlocity_cmt/omniscriptBaseMixin";

import omniscriptPdfAction from "vlocity_cmt/omniscriptPdfAction";

import template from './ceOmniPdfAction.html';

export default class CeOmniPdfAction extends OmniscriptBaseMixin(omniscriptPdfAction) {
    @track renderedAndExecuted = false;

    render() {
        return template;
    }

    connectedCallback() {
        super.connectedCallback();

        if (!this.renderedAndExecuted) {
            let measuresList = [];
            this.jsonDef.propSetMap.measureTypes.forEach((measureType) => {
                if (this.jsonData[measureType]) {
                    if (Array.isArray(this.jsonData[measureType][measureType + '_Measures'])) {
                        this.jsonData[measureType][measureType + '_Measures'].forEach((measure) => {  
                            return measuresList.push({
                                [`measureType${measuresList.length + 1}`]: measure[measureType + '_' + measure[measureType + '_measureNamespace'] + 'Measures'][measureType + '_' + measure[measureType + '_measureNamespace'] + 'MeasureCategory'],
                                [`measureName${measuresList.length + 1}`]: measure[measureType + '_MeasureName'],
                                [`measureQuantity${measuresList.length + 1}`]: (measure[measureType + '_' + measure[measureType + '_measureNamespace'] + 'Measures']?.[measureType + '_' + measure[measureType + '_measureNamespace'] + 'units'] || measure[measureType + '_' + measure[measureType + '_measureNamespace'] + 'Measures']?.[measureType + '_' + measure[measureType + '_measureNamespace'] + 'quantity'] || measure[measureType + '_' + measure[measureType + '_measureNamespace'] + 'Measures']?.[measureType + '_' + measure[measureType + '_measureNamespace'] + 'quantityEe']),
                                [`measureCost${measuresList.length + 1}`]: measure[measureType + '_' + measure[measureType + '_measureNamespace'] + 'measureCost'],
                                [`measureIncentive${measuresList.length + 1}`]: measure[measureType + '_' + measure[measureType + '_measureNamespace'] + 'totalIncentive']
                            });
                        });
                    } else {
                        let measure = this.jsonData[measureType][measureType + '_Measures'];

                        measuresList.push({
                            [`measureType${measuresList.length + 1}`]: measure[measureType + '_' + measure[measureType + '_measureNamespace'] + 'Measures'][measureType + '_' + measure[measureType + '_measureNamespace'] + 'MeasureCategory'],
                            [`measureName${measuresList.length + 1}`]: measure[measureType + '_MeasureName'],
                            [`measureQuantity${measuresList.length + 1}`]: (measure[measureType + '_' + measure[measureType + '_measureNamespace'] + 'Measures']?.[measureType + '_' + measure[measureType + '_measureNamespace'] + 'units'] || measure[measureType + '_' + measure[measureType + '_measureNamespace'] + 'Measures']?.[measureType + '_' + measure[measureType + '_measureNamespace'] + 'quantity'] || measure[measureType + '_' + measure[measureType + '_measureNamespace'] + 'Measures']?.[measureType + '_' + measure[measureType + '_measureNamespace'] + 'quantityEe']),
                            [`measureCost${measuresList.length + 1}`]: measure[measureType + '_' + measure[measureType + '_measureNamespace'] + 'measureCost'],
                            [`measureIncentive${measuresList.length + 1}`]: measure[measureType + '_' + measure[measureType + '_measureNamespace'] + 'totalIncentive']
                        });  
                    }
                }
            });
            this.omniApplyCallResp({'measuresList': measuresList});
            this.renderedAndExecuted = true;
        }
    }

    generatePdf() {
        console.log('click');
        this.execute();
    }
}