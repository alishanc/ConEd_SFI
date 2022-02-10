import { LightningElement } from 'lwc';
import OsFile from 'vlocity_cmt/omniscriptFile';
import temp from './osFileOverrideTest.html';

export default class OsFileOverrideTest extends OsFile {

    _acceptedFormats = ['.pdf', '.png', '.jpg', '.xlsx'];

    connectedCallback() {
        super.connectedCallback();

        if(this._propSetMap && this._propSetMap.acceptedFormats) {
            this._acceptedFormats = this._propSetMap.acceptedFormats;
        }
    } 

    renderedCallback(){
        super.renderedCallback();

        console.log('JSON data', JSON.stringify(this.jsonData))
    }
    
    render() {
        return temp;
    }
}