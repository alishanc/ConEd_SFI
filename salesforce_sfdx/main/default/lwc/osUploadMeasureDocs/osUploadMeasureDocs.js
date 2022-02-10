// import { LightningElement } from 'lwc';
import OsFile from 'vlocity_cmt/omniscriptFile';
import template from './osUploadMeasureDocs.html';

export default class osUploadMeasureDocs extends OsFile {

    connectedCallback() {
        super.connectedCallback();
        
    } 

    renderedCallback(){
        super.renderedCallback();
    }
    
    render() {
        console.log("CHILDJSONDEF: ", JSON.stringify(this.jsonDef));

        // let childJsonDef = JSON.parse(JSON.stringify(this.jsonDef.response));

        // for (var key in childJsonDef) {
        //     console.log('OK1: ', childJsonDef.key);
        // }

        return template;
    }
}