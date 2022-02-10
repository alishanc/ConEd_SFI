@isTest
private class AccountSearchControllerTest
{
    private static void createTestMappings()
    {
        CIS_Attribute_Mapping__c testCustomerNameMapping = new CIS_Attribute_Mapping__c(
          Name = 'Customer Name',
          Source_Field__c = 'Cust_Name',
          Destination_Field__c = 'Name',
          Description__c = 'Test mapping of Customer Name',
          Use_As_a_Search_Parameter__c = true,
          Field_Type__c = 'T',
          Sorting_Tag__c = '01',
          Minimum_required_length__c = 1          
        );
        insert testCustomerNameMapping;
        
        CIS_Attribute_Mapping__c testAccountNumberMapping = new CIS_Attribute_Mapping__c(
          Name = 'Account Number',
          Source_Field__c = 'LINK_ACCT_NUM',
          Destination_Field__c = 'AccountNumber',
          Description__c = 'Test mapping of Account Number',
          Use_As_a_Search_Parameter__c = true,
          Field_Type__c = 'T',
          Sorting_Tag__c = '02',
          Minimum_required_length__c = 1          
        );
        insert testAccountNumberMapping;

        CIS_Attribute_Mapping__c testBoroughMapping = new CIS_Attribute_Mapping__c(
          Name = 'Borough',
          Source_Field__c = 'Boro',
          Destination_Field__c = 'Borough__c',
          Description__c = 'Test mapping of Borough',
          Use_As_a_Search_Parameter__c = true,
          Field_Type__c = 'T',
          Sorting_Tag__c = '03',
          Minimum_required_length__c = 1          
        );
        insert testBoroughMapping;

        CIS_Attribute_Mapping__c testExternalIDMapping = new CIS_Attribute_Mapping__c(
          Name = 'Account Identifier',
          Source_Field__c = 'Acct_Num',
          Destination_Field__c = 'ExternalID__c',
          Description__c = 'Test mapping of External Id',
          Use_As_a_Search_Parameter__c = false,
          Field_Type__c = 'T',
          Sorting_Tag__c = '04',
          Minimum_required_length__c = 1          
        );
        insert testExternalIDMapping;
    }

    private static void createTestAccounts()
    {
        String CUSTOMER_RECORDTYPEID = 
          Account.SObjectType.getDescribe().getRecordTypeInfosByName().get('Customer').getRecordTypeId();   
        
        Account testAccount1 = new Account(
          Name = 'ATHANACIOS ARAPIDIS',
          AccountNumber = '21134911159999',
          RecordTypeId = CUSTOMER_RECORDTYPEID,
          Borough__c = 'Queens'
        );
        insert testAccount1;   
        system.debug('@testAccount1'+testAccount1);
        
        Account testAccount2 = new Account(
          Name = 'RAPIDIS ATHANACIOS',
          AccountNumber = '21134911150000',
          RecordTypeId = CUSTOMER_RECORDTYPEID,
          Borough__c = 'Queens'
        );
        insert testAccount2;
        system.debug('@testAccount2'+testAccount2);
    }

    private static void createConnectionSetting()
    {
        CIS_Integration_Connection__c setting = 
          (CIS_Integration_Connection__c)CIS_Integration_Connection__c.SObjectType.newSObject(null, true);
        setting.Name = 'TEST CONFIGURATION';
        setting.Endpoint__c = 'https://www.example.com/api/';
        setting.Active__c = true;
        upsert setting;
    }

    public class MockHttpResponseGenerator implements HttpCalloutMock
    {
        public HTTPResponse respond(HTTPRequest req)
        {
            // Create a mock response
            HttpResponse res = new HttpResponse();
            res.setHeader('Content-Type', 'application/json');
            res.setBody('{"result":"OK: Processing completed","actual_results":"1","accounts":[{"fields":[{"name":"ACCT_NUM","value":"21134911159999"},{"name":"ACCT_TYPE","value":"R"},{"name":"ACTIVE","value":"Yes"},{"name":"EL_ACTIVE","value":""},{"name":"GS_ACTIVE","value":""},{"name":"ADDR_BLOCK_NUMBER","value":"00797"},{"name":"ADDR_LOT_NUMBER","value":"0058"},{"name":"ALT_TEL_NO","value":"                "},{"name":"ATRA_ACCT_NUM","value":"21184407350001"},{"name":"BROWNSVILLE","value":"N"},{"name":"BILLING_STREET","value":" "},{"name":"CORP_CODE","value":"0"},{"name":"CUST_NAME","value":"ATHANACIOS ARAPIDIS  "},{"name":"E_MTR_TYPE","value":"1"},{"name":"EL_SC","value":"1"},{"name":"EMAIL_ADDRESS","value":"                                        "},{"name":"GS_SC","value":"911"},{"name":"HI_DMD_1YR","value":"0.00"},{"name":"LATITUDE","value":"40.773095"},{"name":"LINK_ACCT_NUM","value":"211349111599991"},{"name":"LONGITUDE","value":"-73.904440"},{"name":"MAIL_CITY","value":""},{"name":"MAIL_STATE","value":""},{"name":"MAIL_ZIP","value":""},{"name":"NAICS","value":"000000"},{"name":"SADD","value":"21-62 41 ST PD           "},{"name":"SERVICE_TYPE","value":"Electric & Gas"},{"name":"SHIPPING_STATE","value":"NY"},{"name":"TELE","value":"7187263233"},{"name":"TOD_CODE","value":"50"},{"name":"Town","value":"ASTORIA"},{"name":"TURN_ON_DT","value":"Dec 15 2010 12:00AM"},{"name":"ZIP","value":"11105"},{"name":"PGM_PART","value":""},{"name":"ANNUALIZED_CONSUM","value":"5547"},{"name":"AVG_BILLED_DMD","value":"0"},{"name":"EL_PSC_SC","value":"1"},{"name":"GAS_HEATING","value":"Y"},{"name":"GS_PSC_SC","value":"9"},{"name":"RES","value":"1"},{"name":"LSE_EQUIP_DESCR","value":""},{"name":"NAICS_DESCR","value":""},{"name":"GEO_NETWORK_NAME","value":"Long Island City"},{"name":"NETWORK_NAME","value":"LI"},{"name":"BLDG_AREA","value":"1278"},{"name":"BLDG_CLASS","value":""},{"name":"BLDG_CLASS_DESCR","value":""},{"name":"BORO","value":"Queens"}]}]}');
            res.setStatusCode(200);
            return res;
        }
    }

    @isTest
    static void testInit()
    {
        createTestMappings();

        AccountSearchController controller = new AccountSearchController();
        controller.getSearchOptions();
        controller.getMaxResultsOptions();
        System.assertEquals('Account Number', controller.m_strSearchBy, '"Search by" should default to "Account Number"');
    }

    @isTest
    static void testReset()
    {
        createTestMappings();
        
        AccountSearchController controller = new AccountSearchController();
        controller.resetSearchPage();
    }

    @isTest
    static void testSearchAccounts_Blank()
    {
        createTestMappings();
        
        AccountSearchController controller = new AccountSearchController();
        
        Test.startTest();

        controller.searchForAccounts();

        Test.stopTest();

        List<Apexpages.Message> lstErrorMessages = ApexPages.getMessages();
        System.debug('LIST ERRORS: ' + lstErrorMessages);

        System.assert(lstErrorMessages.size() > 0, 'Errors should be generated.');
    }

    @isTest
    static void testSearchAccounts_AccountNumber_Both_DBs()
    {
        createTestMappings();
        createConnectionSetting();
        
        AccountSearchController controller = new AccountSearchController();

        Test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
        
        Test.startTest();

        controller.m_objPlaceholderAccount.AccountNumber = '21134911159999';
        controller.searchForAccounts();

        Test.stopTest();

        List<Apexpages.Message> lstErrorMessages = ApexPages.getMessages();
        System.debug('LIST ERRORS: ' + lstErrorMessages);
        System.debug('RESULT DATA: ' + controller.strResultData);

        System.assert(controller.strResultData != '', 'Account should be found.');
    }

    @isTest
    static void testSearchAccounts_AccountNumber_External_Only()
    {
        createTestMappings();
        createConnectionSetting();
        
        AccountSearchController controller = new AccountSearchController();
        controller.m_bIncludeExternalAccounts = true;
        controller.m_bIncludeLocalAccounts = false;

        Test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
        
        Test.startTest();

        controller.m_objPlaceholderAccount.AccountNumber = '21134911159999';
        controller.searchForAccounts();

        Test.stopTest();

        List<Apexpages.Message> lstErrorMessages = ApexPages.getMessages();
        System.debug('LIST ERRORS: ' + lstErrorMessages);
        System.debug('RESULT DATA: ' + controller.strResultData);

        System.assert(controller.strResultData != '', 'Account should be found.');
    }

    @isTest
    static void testSearchAccounts_AccountNumber_Local_Only()
    {
        createTestMappings();
        createConnectionSetting();
        createTestAccounts();
        
        AccountSearchController controller = new AccountSearchController();
        controller.m_bIncludeExternalAccounts = false;
        controller.m_bIncludeLocalAccounts = true;

        Test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
        
        Test.startTest();

        controller.m_objPlaceholderAccount.AccountNumber = '21134911159999';
        controller.searchForAccounts();

        Test.stopTest();

        List<Apexpages.Message> lstErrorMessages = ApexPages.getMessages();
        System.debug('LIST ERRORS: ' + lstErrorMessages);
        System.debug('RESULT DATA: ' + controller.strResultData);

        System.assert(controller.strResultData != '', 'Account should be found.');
    }

    @isTest
    static void testSearchAccounts_AccountNumber_No_DB()
    {
        createTestMappings();
        createConnectionSetting();
        
        AccountSearchController controller = new AccountSearchController();
        controller.m_bIncludeExternalAccounts = false;
        controller.m_bIncludeLocalAccounts = false;

        Test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
        
        Test.startTest();

        controller.m_objPlaceholderAccount.AccountNumber = '21134911159999';
        controller.searchForAccounts();

        Test.stopTest();

        List<Apexpages.Message> lstErrorMessages = ApexPages.getMessages();
        System.debug('LIST ERRORS: ' + lstErrorMessages);
        System.debug('RESULT DATA: ' + controller.strResultData);

        System.assert(lstErrorMessages.size() > 0, 'Error should be thrown.');
    }

    @isTest
    static void testSearchAccounts_Other_Fields_Error()
    {
        createTestMappings();
        createConnectionSetting();
        
        AccountSearchController controller = new AccountSearchController();
        controller.m_bIncludeExternalAccounts = true;
        controller.m_bIncludeLocalAccounts = true;
        controller.m_strSearchBy = 'Other Fields';

        Test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
        
        Test.startTest();

        controller.searchForAccounts();

        Test.stopTest();

        List<Apexpages.Message> lstErrorMessages = ApexPages.getMessages();
        System.debug('LIST ERRORS: ' + lstErrorMessages);
        System.debug('RESULT DATA: ' + controller.strResultData);

        System.assert(lstErrorMessages.size() > 0, 'Error should be thrown.');
    }

    @isTest
    static void testSearchAccounts_Other_Fields()
    {
        createTestMappings();
        createConnectionSetting();
        createTestAccounts();
        
        AccountSearchController controller = new AccountSearchController();
        controller.m_bIncludeExternalAccounts = true;
        controller.m_bIncludeLocalAccounts = true;
        controller.m_strSearchBy = 'Other Fields';

        Test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
        
        Test.startTest();
        controller.m_objPlaceholderAccount.put('Borough__c', 'Queens');
        controller.m_objPlaceholderAccount.put('Name', 'Rapid');
        controller.searchForAccounts();

        Test.stopTest();

        List<Apexpages.Message> lstErrorMessages = ApexPages.getMessages();
        System.debug('LIST ERRORS: ' + lstErrorMessages);
        System.debug('RESULT DATA: ' + controller.strResultData);

        System.assert(controller.strResultData != '', 'Account should be found.');
    }

    @isTest
    static void testImportAccounts()
    {
        createTestMappings();
        createConnectionSetting();
        
        AccountSearchController controller = new AccountSearchController();
        controller.m_bIncludeExternalAccounts = true;
        controller.m_bIncludeLocalAccounts = false;

        Test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
        
        Test.startTest();

        controller.m_objPlaceholderAccount.AccountNumber = '21134911159999';
        controller.searchForAccounts();
        controller.m_strSelectedAccountIds = '21134911159999';
        controller.importSelectedAccounts();

        Test.stopTest();

        List<Apexpages.Message> lstErrorMessages = ApexPages.getMessages();
        System.debug('LIST ERRORS: ' + lstErrorMessages);

        Account testAccount = [SELECT Id FROM Account WHERE ExternalID__c = '21134911159999' LIMIT 1];

        System.assert(testAccount != null, 'Account should be imported.');
    }
}