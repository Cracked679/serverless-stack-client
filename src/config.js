export default {
  MAX_ATTACHMENT_SIZE: 5000000,
  s3: {
    REGION: "us-east-1",
    BUCKET: "notes-app-uploads-cracked",
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://qszwxfz1tc.execute-api.us-east-1.amazonaws.com/prod/",
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_ZKulerubN",
    APP_CLIENT_ID: "17ijo1jdjrrc7n7dbidrghrbmm",
    IDENTITY_POOL_ID: "us-east-1:15bb44fb-e952-43a6-bfd5-11115178f5be",
  },
  STRIPE_KEY:
    "pk_test_51HGOoVJ6mW1Nmoae23vfHqoeo1O37jPaogIADFwgGp3co433EKyO3sWD0qzU3FGy5tfNiaDo7Z2EdaIqphDsCG8F00wclBYciq",
};
