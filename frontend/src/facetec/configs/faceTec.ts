type TFaceTecConfig = {
	DeviceKeyIdentifier: string;
	BaseURL: string;
	PublicFaceScanEncryptionKey: string;
};

export const config: TFaceTecConfig = {
	DeviceKeyIdentifier: process.env.NEXT_PUBLIC_FACETEC_KEY_IDENTIFIER as string,
	BaseURL: process.env.NEXT_PUBLIC_FACETEC_BASE_URL as string,
	PublicFaceScanEncryptionKey:
		"-----BEGIN PUBLIC KEY-----\n" +
		"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5PxZ3DLj+zP6T6HFgzzk\n" +
		"M77LdzP3fojBoLasw7EfzvLMnJNUlyRb5m8e5QyyJxI+wRjsALHvFgLzGwxM8ehz\n" +
		"DqqBZed+f4w33GgQXFZOS4AOvyPbALgCYoLehigLAbbCNTkeY5RDcmmSI/sbp+s6\n" +
		"mAiAKKvCdIqe17bltZ/rfEoL3gPKEfLXeN549LTj3XBp0hvG4loQ6eC1E1tRzSkf\n" +
		"GJD4GIVvR+j12gXAaftj3ahfYxioBH7F7HQxzmWkwDyn3bqU54eaiB7f0ftsPpWM\n" +
		"ceUaqkL2DZUvgN0efEJjnWy5y1/Gkq5GGWCROI9XG/SwXJ30BbVUehTbVcD70+ZF\n" +
		"8QIDAQAB\n" +
		"-----END PUBLIC KEY-----", // PASTE THE CODE HERE
};
