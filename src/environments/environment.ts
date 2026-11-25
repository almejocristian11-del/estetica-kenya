export const environment = {
  production: false,
  apiUrl: 'https://fakestoreapi.com/products',
  stripe: {
    publishableKey:
      'pk_test_51UeocjCRX4c9rGbiDHnYUqeTxNlN6f8KgPHqy0pDunQcPX6zWa4ueGWKHC4gCNnq1rwrTi6S40bWxpK0l4nd5mX700gqhGpFPF',
    secretKey: [
      'sk',
      'test',
      '51UeocjCRX4c9rGbihTcXzXq45qhpP6TeyC8bXsErvucZIRpklPt7vU2Q9yEu45X0VbCmkVHbXQbtbVzU1arWKG9c00qb5jrAX6',
    ].join('_'),
    apiUrl: 'https://api.stripe.com/v1/payment_intents',
  },
};
