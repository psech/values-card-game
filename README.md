# Values Card Game

Digitized values card game by John C. Maxwell

## Deploy (manual from local - until ci/cd is fixed)

1. Build Client with `yarn build` in `vcg-client` directory.  
   On Node 17+ run it as `NODE_OPTIONS=--openssl-legacy-provider yarn build` (CRA 4 / webpack 4).
1. Deploy infrastructure (CDK v2, needs Node 20+; see `vcg-aws/.nvmrc`)
   1. Set environment variables
      - `AWS_ACCESS_KEY_ID`
      - `AWS_SECRET_ACCESS_KEY`
      - `AWS_DEFAULT_REGION`.
   1. Install dependencies with `yarn` in `vcg-aws` directory.
   1. Once per account and region, bootstrap CDK v2 with `npx cdk bootstrap`.  
      An account bootstrapped by CDK v1 needs this again: v2 requires a newer bootstrap stack.
   1. Check the changes with `npx cdk diff`, then deploy with `npx cdk deploy` in `vcg-aws` directory.  
      The CDK will sync the S3 bucket.
