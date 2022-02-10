import { LightningElement, api } from 'lwc';
import template from './chevronStatusChart.html';

export default class ChevronStatusChart extends LightningElement {
    
    @api hasRendered = false;

    @api projectStatus;
    @api congaExpiration;
    @api technicalReviewResult;
    @api polSentDate;
    @api polReceivedDate;
    @api inspectionResult;
    @api postInspectionResult;
    @api finalTechnicalReview;
    @api paidDate;


    render() {
        console.log('Status: ', this.projectStatus);
        return template;
    }

    renderedCallback() {
        if (this.hasRendered) {
            let path = this.template.querySelectorAll('.slds-path__item');
            
            if (this.projectStatus != "Cancelled") {
                for (let i = 0; i < path.length; i++) {
                    let status = path[i].getAttribute('data-status');

                    if (status == "Project Summary" && this.projectStatus == "Estimate") {
                        path[i].classList.add('slds-is-won');
                        break;
                    }
                    else if (status == "Pending E Signature" && (this.projectStatus == "Pending eSignature" || this.projectStatus == "Pending Submission")) {
                        let todayDate = new Date();
                        let expirationDate = new Date(this.congaExpiration);
                        
                        if (todayDate < expirationDate) {
                            path[i].classList.add('slds-is-current');
                        } else {
                            path[i].classList.add('slds-is-lost');
                        }
                        break;
                    } else if (status == "Under Initial Review" && this.projectStatus == "Technical Review") {
                        if (this.technicalReviewResult == "Fail" || this.technicalReviewResult == "Discrepancy Found") {
                            path[i].classList.add('slds-is-lost');
                        } else {
                            path[i].classList.add('slds-is-current');
                        }
                        break;
                    } else if (status == "Preliminary Offer Letter" && this.projectStatus == "Preliminary OL") {
                        let todayDate = new Date();
                        let sentDate = new Date(this.polSentDate);

                        if ((sentDate - todayDate >= 30) && !this.polReceivedDate) {
                            path[i].classList.add('slds-is-lost');
                        } else {
                            path[i].classList.add('slds-is-current');
                        }
                        break;
                    } else if (status == "Pending Pre Inspection" && this.projectStatus.includes("Pre-Inspection")) {
                        if (this.inspectionResult == "Fail" || this.inspectionResult == "Flagged") {
                            path[i].classList.add('slds-is-lost');
                        } else {
                            path[i].classList.add('slds-is-current');
                        }
                        break;
                    } else if (status == "Installation" && this.projectStatus == "Installation") {
                        path[i].classList.add('slds-is-current');
                        break;
                    } else if (status == "Pending Post Inspection" && this.projectStatus.includes("Post-Inspection")) {
                        if (this.postInspectionResult == "Fail" || this.postInspectionResult == "Flagged") {
                            path[i].classList.add('slds-is-lost');
                        } else {
                            path[i].classList.add('slds-is-current');
                        }
                        break;
                    } else if (status == "Pending Final Review" && this.projectStatus == "Final Review") {
                        if (this.finalTechnicalReview == "Fail" || this.finalTechnicalReview == "Flagged") {
                            path[i].classList.add('slds-is-lost');
                        } else if (this.finalTechnicalReview == "Cured" || this.finalTechnicalReview == "Pass") {
                            path[i].classList.add('slds-is-won');
                        } else {
                            path[i].classList.add('slds-is-current');
                        }
                        break;
                    } else if (status == "Pending Payment Approval" && (this.projectStatus == "Submitted for Payment" || this.projectStatus == "Paid")) {
                        if (this.paidDate) {
                            path[i].classList.add('slds-is-won');
                        } else {
                            path[i].classList.add('slds-is-current');
                        }
                        break;
                    }
                    path[i].classList.add('slds-is-won');
                }
            }
            // } else {
            //     this.template.querySelectorAll('[data-status="Cancelled"]')[0].classList.add('slds-is-lost');
            // }
        }
        this.hasRendered = true;
    }
}