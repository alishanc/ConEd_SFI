/* Apex Class: AccountSearchController.cls
 * Description: This controller is linked to the AccountSearch
 * Visualforce Page. It searches for Accounts that are present
 * in Salesforce as well as the external CIS system.
 */
public with sharing class AccountSearchController
{
    public Account m_objPlaceholderAccount {get;set;}
    public CISIntegrationUtils.FieldAttribute m_objAccountNumber {get;set;}
    public List<CISIntegrationUtils.FieldAttribute> m_lstFields {get;set;}
    
    public String m_strSearchBy {get;set;}
    public Integer m_intMaximumResultSize {get;set;}
    public Boolean m_bIncludeLocalAccounts {get;set;}
    public Boolean m_bIncludeExternalAccounts {get;set;}
    public Boolean m_bShowResults {get;set;}

    public String m_strResultsMessage {get;set;}
    public String strColumnHeaders {get;set;}
    public String strColumnIds {get;set;}
    public String strInitWidths {get;set;}
    public String strColAlign {get;set;}
    public String strColTypes {get;set;}
    public String strColSorting {get;set;}
    public String strResultData {get;set;}
    
    public String m_strSelectedAccountIds {get;set;}

    private Map<String, String> mapDestinationToColumnIds = new Map<String, String>();
    private List<Account> lstExternalAccounts = new List<Account>();
    private Map<String, Account> mapLocalAccounts = new Map<String, Account>();

    private String CUSTOMER_RECORDTYPE_ID = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Customer').getRecordTypeId();
    
    public AccountSearchController()
    {
        init();
    }

    public List<SelectOption> getSearchOptions()
    {
        List<SelectOption> options = new List<SelectOption>();
        options.add(new SelectOption('Account Number', 'Account Number'));
        options.add(new SelectOption('Other Fields', 'Other Fields'));
        return options;
    }

    public List<SelectOption> getMaxResultsOptions()
    {
        List<SelectOption> options = new List<SelectOption>();
        options.add(new SelectOption('10','10'));
        options.add(new SelectOption('20','20'));
        options.add(new SelectOption('50','50'));
        options.add(new SelectOption('100','100'));
        return options;
    }

    public PageReference resetSearchPage()
    {
        init();
        return null;
    }
    
    public PageReference importSelectedAccounts()
    {
        System.debug('SELECTED ACCOUNTS: ' + m_strSelectedAccountIds);
        if(m_strSelectedAccountIds == null || m_strSelectedAccountIds == '')
        {
            ApexPages.addMessage(
              new ApexPages.Message(ApexPages.Severity.ERROR, 
              'Please select one or more accounts to import.'));
            return null;
        }
        else
        {
            Set<String> setSelectedIds = new Set<String>();
            setSelectedIds.addAll(m_strSelectedAccountIds.split(','));

            List<Account> lstAccountsToUpsert = new List<Account>();
            for(Account acct : lstExternalAccounts)
            {
                if(setSelectedIds.contains(acct.unique_Account_Number__c))
                {
                    lstAccountsToUpsert.add(acct);
                }
            }

            System.debug('LIST EXTERNAL ACCOUNTS: ' + lstExternalAccounts);
            System.debug('LIST ACCOUNTS TO UPSERT: ' + lstAccountsToUpsert);

            if(lstAccountsToUpsert.size() > 0)
            {
                try
                {
                    upsert lstAccountsToUpsert unique_Account_Number__c;
                    ApexPages.addMessage(
                      new ApexPages.Message(ApexPages.Severity.CONFIRM, 
                      'Account(s) imported successfully.'));
                }
                catch(Exception ex)
                {
                    ApexPages.addMessage(
                      new ApexPages.Message(ApexPages.Severity.ERROR, 
                      ex.getMessage() + ' - ' + ex.getStackTraceString()));
                }
            }
        }
        
        return null;
    }

    public PageReference searchForAccounts()
    {
        List<String> lstAccountIds = new List<String>();
        List<CISIntegrationUtils.FieldInfo> lstFilterFields = new List<CISIntegrationUtils.FieldInfo>();

        String strLocalAccountsQuery = 'SELECT Id,  ';
        String strWhereClause = 'WHERE ';
        String strErrorMessage = '';

        List<CISIntegrationUtils.FieldAttribute> lstCombinedFields = new List<CISIntegrationUtils.FieldAttribute>();
        lstCombinedFields.add(m_objAccountNumber);
        lstCombinedFields.addAll(m_lstFields);

        if(m_bIncludeExternalAccounts == false && m_bIncludeLocalAccounts == false)
        {
            ApexPages.addMessage(
              new ApexPages.Message(ApexPages.Severity.ERROR,
              'Please select which accounts you want to include in the search, Local or External or both.'));
            return null;
        }

        Boolean boolCustomerNameGiven = true;
        Boolean boolStreetAddressGiven = true;
        for(CISIntegrationUtils.FieldAttribute field : lstCombinedFields)
        {

            field.strFieldValue = String.valueOf(m_objPlaceholderAccount.get(field.strDestinationField));

            strLocalAccountsQuery += field.strDestinationField + ', ';
			system.debug('field.strFieldValue'+field.strFieldValue);
            // If the field is not blank, perform more validations
            if(field.strFieldValue != null && field.strFieldValue != '')
            {
                // If the field is greater than the minimum length 
                // add it to the WHERE string
                system.debug('field.strFieldValue.length()'+field.strFieldValue.length());
                system.debug('field.dMinimumLength'+field.dMinimumLength);
                if(field.strFieldValue.length() >= field.dMinimumLength)
                {
                    system.debug('@field.strDestinationField'+field.strDestinationField);
                    system.debug('m_strSearchBy'+m_strSearchBy);
                    if(field.strDestinationField == 'unique_Account_Number__c' && m_strSearchBy == 'Account Number')
                    {
                        lstAccountIds.add(field.strFieldValue);
                    }
                    else if(m_strSearchBy == 'Other Fields')
                    {
                        CISIntegrationUtils.FieldInfo objFieldInfo = new CISIntegrationUtils.FieldInfo();
                        objFieldInfo.name = field.strSourceField;
                        objFieldInfo.value = field.strFieldValue;
                        lstFilterFields.add(objFieldInfo);
                    }

                    strWhereClause += (strWhereClause != 'WHERE ' ? ' AND ' : '');

                    strWhereClause += field.strDestinationField;

                    if(field.strFieldType == 'T')
                    {
                        strWhereClause += ' LIKE \'%' + field.strFieldValue + '%\'';
                    }
                    else if(field.strFieldType == 'D')
                    {
                        Date strDateValue = Date.parse(field.strFieldValue);
                        strWhereClause += ' = ' + strDateValue.year() + '-' + strDateValue.month() + '-' + strDateValue.day();
                    }
                    else
                    {
                        strWhereClause += ' = ' + field.strFieldValue;
                    }
                }
                // If field is less than the minimum length 
                // add an error to the Error Message string
                else
                {
                    strErrorMessage += field.strName + ' must be at least ' + field.dMinimumLength + ' characters.<br/>';
                }
            }
            else if(field.strDestinationField.equalsIgnoreCase('unique_Account_Number__c') && m_strSearchBy == 'Account Number')
            {
                strErrorMessage += field.strName + ' is required.<br/>';
            }
            else if(m_strSearchBy == 'Other Fields')
            {
                if(field.strSourceField.equalsIgnoreCase('Boro') == true)
                {
                    strErrorMessage += field.strName + ' is required.<br/>';
                }
                if(field.strSourceField.equalsIgnoreCase('Cust_Name') == true)
                {
                    boolCustomerNameGiven = false;
                }
                if(field.strSourceField.equalsIgnoreCase('SADD') == true)
                {
                    boolStreetAddressGiven = false;
                }
            }
        }
        strLocalAccountsQuery += 'CreatedDate ';
        strLocalAccountsQuery += 'FROM Account ';
        strLocalAccountsQuery += strWhereClause;
        strLocalAccountsQuery += ' ORDER BY Name';
        strLocalAccountsQuery += ' LIMIT ' + m_intMaximumResultSize;
        System.debug('LOCAL ACCOUNT QUERY: ' + strLocalAccountsQuery);

        if(boolCustomerNameGiven == false && boolStreetAddressGiven == false)
        {
            strErrorMessage += 'Customer Name or Street Address is required.<br/>';
        }

        if(strErrorMessage != '')
        {
            ApexPages.addMessage(
              new ApexPages.Message(ApexPages.Severity.ERROR, strErrorMessage));
            return null;
        }

        if(m_bIncludeExternalAccounts == true)
        {
            // {'21131609520000', '21131609650002', '21131611850002'};
            try
            {
                lstExternalAccounts = CISIntegrationUtils.getAccounts(lstAccountIds, 
                  lstFilterFields, m_intMaximumResultSize);
                system.debug('@lstExternalAccounts.size()'+lstExternalAccounts.size());
                system.debug('@CISIntegrationUtils.m_intActualResults.size()'+CISIntegrationUtils.m_intActualResults);
                if(lstExternalAccounts.size() < CISIntegrationUtils.m_intActualResults)
                {
                    m_strResultsMessage = lstExternalAccounts.size() + ' of '  + 
                      CISIntegrationUtils.m_intActualResults + 
                      ' records shown. Please adjust "Maximum Result Size" or refine the search criteria.';
                }
                else
                {
                    m_strResultsMessage = '';
                }
            }
            catch(Exception ex)
            {
                ApexPages.addMessage(
                  new ApexPages.Message(ApexPages.Severity.ERROR, 
                  ex.getMessage() + ' - ' + ex.getStackTraceString()));
                return null;
            }
        }

        if(m_bIncludeLocalAccounts == true)
        {
            mapLocalAccounts.clear();
            for(List<Account> lstLocalAccounts : Database.query(strLocalAccountsQuery))
            {
                for(Account acct : lstLocalAccounts)
                {
                    mapLocalAccounts.put(acct.unique_Account_Number__c, acct);
                }
            }
        }

        
        GridData objGridData = new GridData();
        
        System.debug('EXTERNAL ACCOUNTS: ' + lstExternalAccounts);
        System.debug('LOCAL ACCOUNTS: ' + mapLocalAccounts.values());

        if(m_bIncludeExternalAccounts == false && m_bIncludeLocalAccounts == true)
        {
            for(Account acct : mapLocalAccounts.values())
            {
                Map<String, String> data = new Map<String, String>();
                data.put('Select', '<a href="/' + acct.Id + '" target="_blank" id="' + acct.Id + '">View</a>');
                data.put('Local', 'Yes');
                for(String destinationField : mapDestinationToColumnIds.keySet())
                {
                    data.put((String)mapDestinationToColumnIds.get(destinationField), String.valueof(acct.get(destinationField)));
                }
                objGridData.data.add(data);
            }
        }
        else if(m_bIncludeExternalAccounts == true && m_bIncludeLocalAccounts == false)
        {
            for(Account acct : lstExternalAccounts)
            {
                Map<String, String> data = new Map<String, String>();
                data.put('Select', '<input name="record" onclick="addAccountToList(this);" type="checkbox" id="' + acct.unique_Account_Number__c + '" />');
                data.put('Local', 'No');
                for(String destinationField : mapDestinationToColumnIds.keySet())
                {
                    data.put((String)mapDestinationToColumnIds.get(destinationField), String.valueof(acct.get(destinationField)));
                }
                objGridData.data.add(data);
            }

        }
        else if(m_bIncludeExternalAccounts == true && m_bIncludeLocalAccounts == true)
        {
            for(Account acct : lstExternalAccounts)
            {
                Map<String, String> data = new Map<String, String>();
                Account localAccount = mapLocalAccounts.remove(acct.unique_Account_Number__c);
                data.put('Select', '<input name="record" onclick="addAccountToList(this);" type="checkbox" id="' + acct.unique_Account_Number__c + '" />');
                data.put('Local', (localAccount != null ? 'Yes' : 'No'));
                for(String destinationField : mapDestinationToColumnIds.keySet())
                {
                    String strColumnId = (String)mapDestinationToColumnIds.get(destinationField);
                    String strValue = String.valueof(acct.get(destinationField));
                    strValue = strValue == null ? '' : strValue;
                    data.put(strColumnId, strValue);
                }
                objGridData.data.add(data);
            }
            
            for(Account acct : mapLocalAccounts.values())
            {
                Map<String, String> data = new Map<String, String>();
                data.put('Select', '<a href="/' + acct.Id + '" target="_blank" id="' + acct.Id + '">View</a>');
                data.put('Local', 'Yes');
                for(String destinationField : mapDestinationToColumnIds.keySet())
                {
                    String strColumnId = (String)mapDestinationToColumnIds.get(destinationField);
                    system.debug('@strValue'+acct.get(destinationField));
                    String strValue = String.valueof(acct.get(destinationField));
                    strValue = strValue == null ? '' : strValue;
                    data.put(strColumnId, strValue);
                }
                objGridData.data.add(data);
            }
        }

        strResultData = JSON.serialize(objGridData);

        System.debug('SERIALIZED JSON DATA: ' + strResultData);

        m_bShowResults = true;

        return null;
    }

    private void init()
    {
        m_strSearchBy = 'Account Number';

        m_strResultsMessage = '';
        strColumnHeaders = 'Select/View,Local?';
        strColumnIds = 'Select,Local';
        strInitWidths = '75,50';
        strColAlign = 'center,center';
        strColTypes = 'ro,ro';
        strColSorting = 'str,str';
        strResultData = '';

        m_objPlaceholderAccount = new Account(RecordTypeId = CUSTOMER_RECORDTYPE_ID);
        populateFieldsList();

        m_intMaximumResultSize = 20;
        m_bIncludeLocalAccounts = true;
        m_bIncludeExternalAccounts = true;
        m_bShowResults = false;
    }

    private void populateFieldsList()
    {
        m_lstFields = new List<CISIntegrationUtils.FieldAttribute>();

        String strMappingQuery = 'SELECT Id, Name, Source_Field__c, ' + 
          'Destination_Field__c, Description__c, Use_As_a_Search_Parameter__c, ' + 
          'Field_Type__c, Sorting_Tag__c, Minimum_required_length__c ' + 
          'FROM CIS_Attribute_Mapping__c ' + 
          'WHERE Use_As_a_Search_Parameter__c = true ' + 
          'ORDER BY Sorting_Tag__c';

        for(List<CIS_Attribute_Mapping__c> lstCISAttributeMappings : Database.query(strMappingQuery))
        {
            // Loop through each field attribute mapping and add it to the map
            // with the key being the Source Field
            for(CIS_Attribute_Mapping__c mapping : lstCISAttributeMappings)
            {
                strColumnHeaders += ',' + mapping.Name;
                strColumnIds += ',' + mapping.Name.replace(' ', '');
                strInitWidths += ',*';
                strColAlign += ',left';
                strColTypes += ',ro';
                strColSorting += ',str';
                mapDestinationToColumnIds.put(mapping.Destination_Field__c, mapping.Name.replace(' ', ''));
                
                if(mapping.Name == 'Account Number')
                {
                    m_objAccountNumber = new CISIntegrationUtils.FieldAttribute(mapping.Name, mapping.Source_Field__c, 
                      mapping.Destination_Field__c, mapping.Description__c, mapping.Field_Type__c, 
                      mapping.Sorting_Tag__c, 
                      (mapping.Minimum_required_length__c == null ? 0 : mapping.Minimum_required_length__c), 
                      mapping.Use_As_a_Search_Parameter__c);
                }
                else
                {
                    m_lstFields.add(new CISIntegrationUtils.FieldAttribute(mapping.Name, mapping.Source_Field__c, 
                      mapping.Destination_Field__c, mapping.Description__c, mapping.Field_Type__c, 
                      mapping.Sorting_Tag__c, 
                      (mapping.Minimum_required_length__c == null ? 0 : mapping.Minimum_required_length__c), 
                      mapping.Use_As_a_Search_Parameter__c));
                }
            }
        }

        System.debug('DESTINATION TO COLUMN IDS: ' + mapDestinationToColumnIds);
    }

    class GridData
    {
        public List<Map<String, String>> data = new List<Map<String, String>>();
    }
}