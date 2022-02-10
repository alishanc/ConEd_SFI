trigger ProjectId on vlocity_cmt__Application__c (before update) {
   
    //go through and check old objects vs new objects to see if their status has changed 
    for(vlocity_cmt__Application__c app: Trigger.new){
    
        vlocity_cmt__Application__c newApp = Trigger.newMap.get(app.Id);
        vlocity_cmt__Application__c oldApp = Trigger.oldMap.get(app.Id);
        
        //must create new projectId if the status is changing to 'pending submission'
        if(oldApp.vlocity_cmt__Status__c =='Estimate' && newApp.vlocity_cmt__Status__c=='Pending Submission'){
                        newApp.Project_Id__c = 'PR-CI'+ newApp.autoIDNumber__c;

        }
    }
}