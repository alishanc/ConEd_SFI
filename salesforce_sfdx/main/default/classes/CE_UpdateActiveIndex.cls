/*******************************************************************
* @ClassName        :   UpdateActiveIndex
* @Description      :   Updates the ActiveRootIndex in the Saved OmniScript JSON
* @author           :   Kyle Russell
* @LastmodifiedBy   :   
* @RevisionHistory  :
* @Version          Date              Changes made
* 1.0               12/28/21          Initial version

********************************************************************/

/* Method to invoke correct method */
global with sharing class CE_UpdateActiveIndex implements vlocity_cmt.VlocityOpenInterface{
    
    global Boolean invokeMethod(String methodName, Map<String,Object> inputMap, Map<String,Object> outMap, Map<String,Object> options) {
        Boolean result = true;          
        try{
            if(methodName.equals('updateActiveIndex')){
                updateActiveIndex(inputMap, outMap);          
            }
        }   
      catch(Exception e) {           
         result = false;        
      }  
       return result;
    }
    
    //Method to get application json from attachment 
    global void updateActiveIndex(Map<String,Object> input, Map<String,Object> outMap) {
        String appId = (string)input.get('ApplicationId');
        String stepName = (string)input.get('StepName');        
        List<Attachment> att = new List<Attachment>();
        System.debug('appId: ' + appId);
        System.debug('stepName: ' + stepName);

        List<vlocity_cmt__OmniScriptInstance__c> savedScript = [SELECT Id, vlocity_cmt__RelativeResumeLink__c FROM vlocity_cmt__OmniScriptInstance__c WHERE vlocity_cmt__ObjectId__c =: appId];
        
            outMap.put('EditApplicationLink', savedScript[0].vlocity_cmt__RelativeResumeLink__c);
        System.debug('outMap: ' + outMap);
        
            if(!savedScript.isEmpty()){                    
                att = [Select Id,ParentId, Name,body,ContentType From Attachment where ParentId =: savedScript[0].Id and name like '%OmniScriptFullJSON%' Order By CreatedDate Desc Limit 1];
            }
        
        System.debug('ATT: ' + att);
        
        
        String bodyContent = ''; 
        Integer activeIndex;

        bodyContent = att[0].body.toString();
        Map<String,Object> configureMap = (Map<String,Object>)JSON.deserializeUntyped(bodyContent); 
        List<Object> children = (List<Object>)configureMap.get('children');   
               
        for (Object item : children) {
           Map <String, Object> item1 = (Map<String, Object>) item;
           if (String.valueOf(item1.get('name')) == stepName) {
               activeIndex = Integer.valueOf(item1.get('indexInParent'));
               item1.put('bAccordionActive', true);
               item1.put('bAccordionOpen', true);
           } else {
               item1.put('bAccordionActive', false);
               item1.put('bAccordionOpen', false);
           }
           item = item1;   
        }
        configureMap.put('children', children);
        configureMap.put('asIndex', activeIndex);
        configureMap.put('activeRootIndex', activeIndex);
        bodyContent = JSON.serialize(configureMap);
        att[0].body = Blob.valueOf(bodyContent);
        update att[0];      
    }
}