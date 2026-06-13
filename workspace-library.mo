module {

  public type SignatureRecord = {
    principalId  : Text;
    timestamp    : Int;
    documentHash : Text;   // hex of document content
    signatureProof : Text; // hash of principal+timestamp+documentHash+nonce
    role         : Text;
    displayName  : Text;
  };

  public type SignatureCertificate = {
    documentId     : Text;
    signatures     : [SignatureRecord];
    generatedAt    : Int;
    certHash       : Text;  // hash of all signature proofs concatenated
    certText       : Text;  // human-readable certificate body
  };

  public type SignDocumentInput = {
    documentId      : Text;
    documentContent : Text;
    role            : Text;
    displayName     : Text;
  };

};
