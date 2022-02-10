@isTest(SeeAllData=false)
private class CISIntegrationUtilsTest
{
    @isTest 
    static void testServiceDetailsFailure()
    {
        Map<String, String> mapServiceDetails;

        Test.startTest();

        mapServiceDetails = CISIntegrationUtils.getServiceDetails();

        Test.stopTest();

        System.assert(mapServiceDetails.containsKey('ERROR') == true, 
          'Error is expected as no connection has been configured yet.');
	}

    @isTest 
    static void testServiceDetailsSuccess()
    {
        
        CIS_Integration_Connection__c setting = createConnectionSetting();

        Map<String, String> mapServiceDetails;

        Test.startTest();

        mapServiceDetails = CISIntegrationUtils.getServiceDetails();

        Test.stopTest();

        System.assert(mapServiceDetails.containsKey('ERROR') == false, 
          'Success is expected as a connection has been configured.');
    }

    @isTest
    static void testGetAccounts_ID_Based_Query()
    {
        CIS_Integration_Connection__c setting = createConnectionSetting();
        createTestMappings();

        List<String> lstAccountIds = new List<String>();
        lstAccountIds.add('21134911159999');

        Test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
        Test.startTest();
        
        List<Account> lstAccounts = CISIntegrationUtils.getAccounts(lstAccountIds, null, 20);

        Test.stopTest();

        System.assertEquals(1, lstAccounts.size(), 
          'One account should be returned');

        Account acct = lstAccounts[0];
        System.assertEquals('ATHANACIOS ARAPIDIS', acct.Name, 
          'The Name should be "ATHANACIOS ARAPIDIS"');
    }

    @isTest
    static void testGetAccounts_Filter_Based_Query()
    {
        CIS_Integration_Connection__c setting = createConnectionSetting();
        createTestMappings();

        List<CISIntegrationUtils.FieldInfo> lstFilterFields = new List<CISIntegrationUtils.FieldInfo>();
        CISIntegrationUtils.FieldInfo objFieldInfo = new CISIntegrationUtils.FieldInfo();
        objFieldInfo.name = 'Cust_Name';
        objFieldInfo.value = 'Rapid';
        lstFilterFields.add(objFieldInfo);

        Test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
        Test.startTest();
        
        List<Account> lstAccounts = CISIntegrationUtils.getAccounts(null, lstFilterFields, 20);

        Test.stopTest();

        System.assertEquals(1, lstAccounts.size(), 
          'One account should be returned');

        Account acct = lstAccounts[0];
        System.assertEquals('ATHANACIOS ARAPIDIS', acct.Name, 
          'The Name should be "ATHANACIOS ARAPIDIS"');
    }

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
          Destination_Field__c = 'eo3__ExternalID__c',
          Description__c = 'Test mapping of External Id',
          Use_As_a_Search_Parameter__c = false,
          Field_Type__c = 'T',
          Sorting_Tag__c = '04',
          Minimum_required_length__c = 1          
        );
        insert testExternalIDMapping;
    }

    private static CIS_Integration_Connection__c createConnectionSetting()
    {
        CIS_Integration_Connection__c setting = 
          (CIS_Integration_Connection__c)CIS_Integration_Connection__c.SObjectType.newSObject(null, true);
        setting.Name = 'TEST CONFIGURATION';
        setting.Endpoint__c = 'https://www.example.com/api/';
        setting.Active__c = true;
        upsert setting;

        return setting;
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
}