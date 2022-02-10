import { LightningElement } from 'lwc';
import OsStep from 'vlocity_cmt/omniscriptStep';
import temp from './osStepOverrideTest.html';

export default class OsStepOverrideTest extends OsStep {

    renderedCallback(){
        super.renderedCallback();
        console.log(JSON.stringify(this.jsonDef))
    }

    render() {
        return temp;
    }
}