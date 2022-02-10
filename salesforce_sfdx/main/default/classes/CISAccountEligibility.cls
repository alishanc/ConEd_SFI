global with sharing class CISAccountEligibility implements vlocity_cmt.VlocityOpenInterface {
 
  // This is used for debugging purposes: a method can put information in this, and
    // if an exception is thrown, it will be included in the report back to the caller
    private String lastTidbit = '';
    private static String CLIENTID = 'energyOrbitCISService';
    private static final String APIKey ;
    private static final String AccountNumber;
 	 private static final String responseJson ;
    private String acctNum ;
    global static Integer m_intActualResults {get;set;}
    // Customer RecordType Id
    private static String CUSTOMER_RECORDTYPEID = 
      Account.SObjectType.getDescribe().getRecordTypeInfosByName().get('Customer').getRecordTypeId();
    /*
     *  Logging Management
     *
     *  The normal mechanism for debugging in Apex is to System.debug() something, but that ends
     *  up hard to retrieve from normal usage.  This is an alternative, that allows you to generate
     *  a log file that gets returned to an OmniScript that can be displayed in a selectable items
     *  element.  It's a bit tricky, in that we need to format the data properly, but not terribly
     *  tricky.
     */
    private List<Map<String,String>> debugLog;
 
    // Initialize the log, add it to the output.  Since the variable is put into the output by
    // reference, we can keep adding things to the list and the lastest version will be automatically
    // returned, no need to keep putting it into output after this initial call.
    private void initLog(Map<String,Object> output) {
        debugLog = new List<Map<String,String>>();
        output.put('debugLog', debugLog);
    }
    // FieldInfo: Defines the data structure that holds 
    // information regarding the Field Names (e.g. 'acct_no', 
    // 'cust_name', etc.) and their Values
    global class FieldInfo
    {
        global String name {get;set;}
        global String value {get;set;}
    }
    // ServiceRequest: Defines the data structure that holds
    // information regarding a Request made to CIS Service. 
    // It contains an array of IDs -or- an array of Filters, 
    // which is simply an array of Fields (as defined by 
    // FieldInfo class). It also contains the max number 
    // of results we want back from the CIS Service
    global class ServiceRequest
    {
         global String client_id = CLIENTID;
        global List<String> ids {get;set;}
        global List<FieldInfo> filters {get;set;}
        global List<String> fields {get;set;}
        global Integer max_results {get;set;}

        global ServiceRequest()
        {
            ids = new List<String>();
            filters = new List<FieldInfo>();
        }
    }
 	    // AccountInfo: Defines the data structure that holds 
    // information regarding the Account. It contains the 
    // ID, Status, and an array of Fields (as defined by
    // FieldInfo class)
    global class AccountInfo
    {
        // global String id {get;set;}
        // global String status {get;set;}
        global List<FieldInfo> fields {get;set;}
    }
    global class ServiceResponse
    {
        global String result {get;set;}
        global String message {get;set;}
        global Integer actual_results {get;set;}
        global List<AccountInfo> accounts {get;set;}
    }
    private void addLog(String message) {
        Map<String,String> thisMessage = new Map<String,String>();
 
        thisMessage.put('Timestamp', String.valueOf(Datetime.now()));
        thisMessage.put('Text', message);
 
        debugLog.add(thisMessage);
    }
 
    /*
     * Standard entrypoint for VlocityOpenInterface.
     */
     global Boolean InvokeMethod( String methodName, Map<String,Object> input, Map<String,Object> output, Map<String,Object> options) {
         system.debug('Start of InvokeMethod');
         system.debug('methodName'+methodName);
        try {
            
            initLog(output);
            
            if (methodName.equals('getAccount')) {
                
                system.debug('methodName'+methodName);
                getAccount(methodName, input, output, options);
                return true;
            }
 
        } catch (Exception e) {
            system.debug('Error'+e.getMessage());
            output.put('Error', e.getMessage());
            
            output.put('Error', e.getMessage());
            system.debug('ErrorLine'+e.getLineNumber());
            output.put('ErrorLine', e.getLineNumber());
            output.put('TidBit', lastTidbit);
            output.put('Method', methodName);
        }
 
        return false;
    }
 
    private void getAccount(String methodName, Map<String,Object> input, Map<String,Object> output, Map<String,Object> options) {
        addLog('Start of Method 1');
        system.debug('Start of Method 1');
        system.debug('options1'+String.valueOf(options.get('optionKey')));
        system.debug('options2'+String.valueOf(options.get('AccountNumber')));
        String Key = String.valueOf(options.get('optionKey'));
        String Acc = String.valueOf(options.get('AccountNumber'));
        Output.put('Acc', Acc);
        string Accountno = Acc;
        String clientid = 'energyOrbitCISService';
        Output.put('Accountno', Accountno);
        List<String> lstAccountIds = Accountno.split(',');
        //List<string> lstAccountIds;
        Integer intMaxResults = 1;
        output.put('lstAccountIds', lstAccountIds);
        String strToken = '';

        // Get the current UTC timestamp
        DateTime dttCurrentUTCTimestamp = DateTime.now();

        // Separate the Month from current UTC timestamp
        String strUTCMonth = dttCurrentUTCTimestamp.formatGmt('MM');
        // Separate the Day from current UTC timestamp
        String strUTCDay = dttCurrentUTCTimestamp.formatGmt('dd');
        // Separate the Year from current UTC timestamp
        String strUTCYear = dttCurrentUTCTimestamp.formatGmt('yyyy');
        // Separate the Hour from current UTC timestamp
        String strUTCHour = dttCurrentUTCTimestamp.formatGmt('HH');
        // Calculate the Minute from current UTC timestamp
        // If the last digit of the Minute is between X0 and X4, round down to X0
        // If the last digit of the Minute is between X5 and X9, round down to X5
        // Divide the Minute (mm) by 5, get the remainder. Subtract the remainder
        // from the Minute (mm). The result will either be X0 or X5
        // Formula: mm - (mm mod 5)
        Integer intMinute = dttCurrentUTCTimestamp.minuteGmt() - 
          Math.mod(dttCurrentUTCTimestamp.minuteGmt(), 5);
        String strUTCMinute = (intMinute < 10 ? '0' : '') + String.valueOf(intMinute);
        // Set the Second to 00
        String strUTCSecond = '00';

        // Combine the various elements of the UTC timestamp
        String strFormattedUTCTimestamp = strUTCMonth + '/' + strUTCDay + '/' + strUTCYear + ' ';
        strFormattedUTCTimestamp += strUTCHour + ':' + strUTCMinute + ':' + strUTCSecond;

        // Create a hash from the combination of the timestamp string and the salt value
        Blob blobToken = Crypto.generateDigest('SHA1', Blob.valueOf(strFormattedUTCTimestamp + 'testpwd_EOtoCE_123'));

        // Encode the hashed blob into base64 format string
        strToken = EncodingUtil.convertToHex(blobToken);

        System.debug('LOCAL TIME: ' + DateTime.now().format());
        System.debug('FORMATTED UTC TIMESTAMP: ' + strFormattedUTCTimestamp);
        System.debug('TOKEN: ' + strToken);
        output.put('results', strToken);
        List<AccountInfo> lstAccountInfos = new List<AccountInfo>();

        // Reset "actual results" counter
        m_intActualResults = 0;
        
        // Get the Service Details
        Map<String, String> mapServiceDetails = CISAccountEligibility.getServiceDetails();

        // Instantiate an Http and Http Request object an create the request
        Http h = new Http();
        HttpRequest req = new HttpRequest();
        // Set the Endpoint for the connection
        req.setEndpoint(mapServiceDetails.get('Endpoint'));

        System.debug('TIME BEFORE TOKEN GENERATION: ' + Datetime.now().format());
        // Set the Authorization token in the header
        req.setHeader('Authorization', strToken);

        System.debug('TIME AFTER TOKEN GENERATION: ' + Datetime.now().format());

        // Set the content-type
        req.setHeader('Content-Type', 'text/json');
        // Set the method
        req.setMethod('POST');
        // Set the timeout
        req.setTimeout(120000);

        // Set the request body
        ServiceRequest serviceRequest = new ServiceRequest();
        serviceRequest.ids = lstAccountIds;
        //serviceRequest.filters = lstFilters;
        serviceRequest.max_results = intMaxResults;
        //serviceRequest.client_id = clientid;
        req.setBody(JSON.serialize(serviceRequest));
		System.debug('REQUEST: ' + req);
        System.debug('REQUEST: ' + req.getBody());

        // Send the request and get the raw response
        HttpResponse res = h.send(req);

        // Convert the raw response to the ServiceResponse data structure
        CISAccountEligibility.ServiceResponse response = 
          (CISAccountEligibility.ServiceResponse)
          JSON.deserialize(res.getBody(), CISAccountEligibility.ServiceResponse.class);
		System.debug( 'res: ' + res.getBody() );
        System.debug( 'RESPONSE: ' + response );

        // If the Result came back as a SUCCESS and
        // the number of result is more than 0, then 
        // set the place holder array with the array of
        // Accounts returned
        
            lstAccountInfos = response.accounts;
		output.put('lstAccountInfos', res.getBody());
        Map<String, FieldAttribute> mapFieldAttributes = getMapFieldAttributes();

        List<Account> lstAccounts = new List<Account>();

        for(AccountInfo objAccountInfo : lstAccountInfos)
        {
            Account acct = new Account();
            for(FieldInfo field : objAccountInfo.fields)
            {
                System.debug('FIELD: ' + field);
                
                if(mapFieldAttributes.containsKey(field.name.toLowerCase()) == false)
                {
                    continue;
                }

                String strAccountField = mapFieldAttributes.get(field.name.toLowerCase()).strDestinationField;
                String strAccountFieldType = mapFieldAttributes.get(field.name.toLowerCase()).strFieldType;
                try
                {
                    System.debug('strAccountField ' + strAccountField);
                    System.debug('strAccountFieldType ' + strAccountFieldType);
                    System.debug('Boolean ' +(strAccountField == 'unique_Account_Number__c'));
                    if(strAccountField == 'unique_Account_Number__c')
                    {
                        System.debug('fieldvalue ' + field.value);
                        acctNum = field.value;
                        System.debug('acctNum ' + acctNum);
                    }
                    System.debug('strAccountField ' + strAccountField);
                    System.debug('field.value ' + field.value);
                    System.debug('Boolean ' +(strAccountField == 'CE_C_I_Eligible__c' && field.value != null && !field.value.contains('N')));
                    if(strAccountField == 'CE_C_I_Eligible__c' && field.value != null && !field.value.contains('N'))
                    {
                        List<Eligibility_Rule__c> erule = [SELECT ID From Eligibility_Rule__c Where Program_Name__c = 'C&I' and Active__c = true and Account_Number__c = :acctNum];
                        System.debug('erule ' + erule.size());
                        if(erule.size()==0){
                        Eligibility_Rule__c CIRule = new Eligibility_Rule__c();
                        CIRule.Name = 'C&I Eligibility Rule✔';
                        CIRule.Program_Name__c = 'C&I';
                        CIRule.Account_Number__c = acctNum;
                        CIRule.Active__c = True;
                        CIRule.Eligibility_Type__c = field.value;
                        Insert CIRule;
                        }else{
                            erule[0].Eligibility_Type__c = field.value;
                            update erule[0];
                        }
                    }
                    if(strAccountField == 'CE_SBDI_Eligible__c' && field.value != null && field.value == 'Yes')
                    {
                        List<Eligibility_Rule__c> erule = [SELECT ID From Eligibility_Rule__c Where Program_Name__c = 'SMB' and Active__c = true and Account_Number__c = :acctNum];
                        System.debug('erule ' + erule.size());
                        if(erule.size()==0){
                        Eligibility_Rule__c CIRule = new Eligibility_Rule__c();
                        CIRule.Name = 'SMB Eligibility Rule✔';
                        CIRule.Program_Name__c = 'SMB';
                        CIRule.Account_Number__c = acctNum;
                        CIRule.Active__c = True;
                        CIRule.Eligibility_Type__c = field.value;
                        Insert CIRule;
                        }else{
                            erule[0].Eligibility_Type__c = field.value;
                            update erule[0];
                        }
                    }
                    if(strAccountFieldType == 'N' && field.value != '' && field.value != null)
                    {
                        acct.put(strAccountField, Decimal.valueOf(field.value));
                    }
                    else if(strAccountFieldType == 'D' && field.value != '' && field.value != null)
                    {
                        acct.put(strAccountField, Date.parse(field.value));
                    }
                    else if(strAccountFieldType == 'T' && field.value != '' && field.value != null)
                    {
                        acct.put(strAccountField, field.value.trim());
                    }
                    else if(strAccountFieldType == 'B' && field.value != '' && field.value != null)
                    {
                        String strFieldValue = field.value.trim();
                        Boolean boolFieldValueConverted = 
                          strFieldValue.equalsIgnoreCase('true') || strFieldValue.equalsIgnoreCase('y') ? 
                          true : 
                          false;
                        acct.put(strAccountField, boolFieldValueConverted);
                    }
                    //Added by Rajesh Turlapati to fix INVALID_TYPE_ON_FIELD_IN_RECORD error.
                    else if(strAccountField == 'WS_Account__c' && strAccountFieldType == 'B' && field.value == '')
                    {
                        acct.put(strAccountField, False);
                    }
                    else if(strAccountField == 'Newton_Account__c' && strAccountFieldType == 'B' && field.value == ''){
                        acct.put(strAccountField, False);
                    }
                    else if(strAccountField == 'CE_Brownsville_Account__c' && strAccountFieldType == 'B' && field.value == ''){
                        acct.put(strAccountField, False);
                    }
                    else
                    {
                        acct.put(strAccountField, null);
                    }
                }
                catch(Exception ex)
                {
                    System.debug('FIELD EXCEPTION: ' + ex);
                }
            }
            acct.CE_Last_Import_Date__c = Date.today();
            acct.RecordTypeId = CUSTOMER_RECORDTYPEID;
			acct.AccountNumber = acctNum;
            lstAccounts.add(acct);
        }
        try{
           Upsert lstAccounts unique_Account_Number__c; 
        }catch(Exception ex)
                {
                    System.debug('EXCEPTION: ' + ex.getMessage());
                       System.debug('EXCEPTION: ' + ex.getLineNumber());
                }
		
    }
    // FieldAttribute: Defines the data structure that holds
    // information regarding the Field Mappings defined in 
    // custom setting "CIS Attribute Mapping".
    global class FieldAttribute
    {
        global String strName {get;set;}
        global String strSourceField {get;set;}
        global String strDestinationField {get;set;}
        global String strDescription {get;set;}
        global String strFieldType {get;set;}
        global String strSortingTag {get;set;}
        global Decimal dMinimumLength {get;set;}
        global Boolean boolUseAsASearchParameter {get;set;}
        global String strFieldValue {get;set;}

        global FieldAttribute(String strName, String strSourceField, String strDestinationField, 
          String strDescription, String strFieldType, String strSortingTag, Decimal dMinimumLength, 
          Boolean boolUseAsASearchParameter)
        {
            this.strName = strName;
            this.strSourceField = strSourceField;
            this.strDestinationField = strDestinationField;
            this.strDescription = strDescription;
            this.strFieldType = strFieldType;
            this.strSortingTag = strSortingTag;
            this.dMinimumLength = dMinimumLength;
            this.boolUseAsASearchParameter = boolUseAsASearchParameter;
            this.strFieldValue = '';
        }
    }
 // Method to get the CIS Attrbute Mapping from the 
    // custom setting called "CIS Attribute Mapping"
    // @param Boolean boolReturnSearchParametersOnly: flag to only return searchable fields
    // @return: Map<String, FieldAttrbute> mapFieldAttribute
    global static Map<String, FieldAttribute> getMapFieldAttributes()
    {
        // Place holder map of field attributes
        Map<String, FieldAttribute> mapFieldAttributes = new Map<String, FieldAttribute>();

        // Create a query string to get the field attribute mappings
        String strMappingQuery = 'SELECT Id, Name, Source_Field__c, ' + 
          'Destination_Field__c, Description__c, Use_As_a_Search_Parameter__c, ' + 
          'Field_Type__c, Sorting_Tag__c, Minimum_required_length__c ' + 
          'FROM CIS_Attribute_Mapping__c ' + 
          'ORDER BY Sorting_Tag__c';

        for(List<CIS_Attribute_Mapping__c> lstCISAttributeMappings : Database.query(strMappingQuery))
        {
            // Loop through each field attribute mapping and add it to the map
            // with the key being the Source Field
            for(CIS_Attribute_Mapping__c mapping : lstCISAttributeMappings)
            {
                mapFieldAttributes.put(mapping.Source_Field__c.toLowerCase(), 
                  new FieldAttribute(mapping.Name, mapping.Source_Field__c, mapping.Destination_Field__c, 
                  mapping.Description__c, mapping.Field_Type__c, mapping.Sorting_Tag__c, 
                  mapping.Minimum_required_length__c, mapping.Use_As_a_Search_Parameter__c));
            }
        }

        System.debug('MAP FIELD ATTRIBUTES: ' + mapFieldAttributes);

        // Return the field attributes
        return mapFieldAttributes;
    }
    // Method to get the CIS Service Endpoint from the 
    // custom object called "CIS Integration Connection"
    // @param: None
    // @return: Map<String, String> mapServiceDetails
    @TestVisible
    private static Map<String, String> getServiceDetails()
    {
        // Place holder map of service details
        Map<String, String> mapServiceDetails = new Map<String, String>();

        // Query the custom setting to get the most recently
        // modified Active connection setting
        List<CIS_Integration_Connection__c> lstConnections = [SELECT Id, Endpoint__c, Key__c, Active__c 
          FROM CIS_Integration_Connection__c
          WHERE Active__c = true
          ORDER BY LastModifiedDate DESC];

        // If no records were found, send an error back
        // else, set the place holder with Endpoint__c value
        if(lstConnections.size() == 0)
        {
            mapServiceDetails.put('ERROR', 'No active End Points are found. Please check the custom setting.');
        }
        else
        {
            CIS_Integration_Connection__c connection = lstConnections[0];
            mapServiceDetails.put('Endpoint', connection.Endpoint__c);
            mapServiceDetails.put('Key', connection.Key__c);
        }

        // Return the service details
        return mapServiceDetails;
    }
 
}