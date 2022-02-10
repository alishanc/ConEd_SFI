import { LightningElement, api, track } from 'lwc';
import template from './testCustomLWC.html'
import { OmniscriptBaseMixin } from 'vlocity_cmt/omniscriptBaseMixin';
import { OmniscriptAtomicElement } from 'vlocity_cmt/omniscriptAtomicElement';

export default class testCustomLWC extends OmniscriptBaseMixin(LightningElement) {
    get acceptedFormats() {
        return ['.pdf', '.png'];
    }

    myUploadedFiles;

    renderedCallback(){
        // super.renderedCallback();
    }
    
    handleFilesChange(event) {
        console.log('uploaded');
        // Get the list of uploaded files
        const uploadedFiles = event.detail.files;
        // console.log('uploaded Files: ', uploadedFiles[0]);
        // console.log('No. of files uploaded : ' + uploadedFiles.length);

        let myfiles = {fileName: uploadedFiles[0].name, 
                       fileType: uploadedFiles[0].type,
                       fileSize: uploadedFiles[0].size,
                    }
        
        this.myUploadedFiles = { "files": myfiles }
        this.omniUpdateDataJson(this.myUploadedFiles);

    }
    
    render() {
        console.log("json data", JSON.stringify(this.omniJsonData))
        // console.log('here: ', JSON.stringify(this.omniScriptHeaderDef));

        return template;
    }



    handleUploadFinished(e) {
        console.log('finished');
        console.log('e: ', JSON.stringify(e.detail.files));

    }
}