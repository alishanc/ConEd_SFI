global with sharing class InternalOnly_SecurityService implements 
vlocity_cmt.VlocityOpenInterface2
{   public Boolean invokeMethod(
       String methodName,
       Map<String, Object> inputs,
       Map<String, Object> outputs,
       Map<String, Object> options)
   {
       try {
           if (methodName == 'encrypt') {
               return encrypt(inputs, outputs, options);
           }
           if (methodName == 'decrypt') {
               return decrypt(inputs, outputs, options);
           }
       } catch (Exception e) {
           outputs.put('Error', e.getMessage());
           outputs.put('ErrorLine', e.getLineNumber());
           outputs.put('ErrorType', e.getTypeName());
           outputs.put('MethodName', methodName);
       }
        return false;
   }
    public Boolean encrypt(
       Map<String,Object> inputs,
       Map<String,Object> outputs,
       Map<String,Object> options)
   {
       String unencryptedString = (String) inputs.get('unencryptedString');
       outputs.put('encryptedStringIfNecessary', vlocity_cmt.UserSecurity.encrypt(unencryptedString));
       return true;
   }
    public Boolean decrypt(
       Map<String,Object> inputs,
       Map<String,Object> outputs,
       Map<String,Object> options)
   {
       String possiblyEncryptedString = (String) inputs.get('possiblyEncryptedString');
       outputs.put('decryptedString', vlocity_cmt.UserSecurity.decrypt(possiblyEncryptedString));
       return true;
   }
}