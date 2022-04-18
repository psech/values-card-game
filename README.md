# Values Card Game

Digitized values card game by John C. Maxwell

## Deploy (manual from local - until ci/cd is fixed)

1. Build Client with `yarn build` in `vcg-client` directory.
1. Deploy infrastructure
   1. Set environment variables
      - `AWS_ACCESS_KEY_ID`
      - `AWS_SECRET_ACCESS_KEY`
      - `AWS_DEFAULT_REGION`.
   1. Deploy with `cdk deploy` in `vcg-aws` directory.  
      The CDK will sync the S3 bucket.
