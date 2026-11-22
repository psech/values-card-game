# Values Card Game

Digitized values card game by John C. Maxwell

## CI/CD

The GitHub Actions workflow builds and tests the client and the infrastructure on every pull request. Pushes to `main` also deploy the site (`VcgAwsStack`).

The deploy job signs in to AWS with GitHub's OIDC token and a role that only this repository's `production` environment can assume, so no AWS keys are stored in GitHub.

### One-time setup

1. Deploy the role from your machine (see "Deploy manually" below for credentials):  
   `npx cdk deploy VcgCiStack` in the `vcg-aws` directory.  
   If the AWS account already has a GitHub OIDC provider, pass its ARN:  
   `npx cdk deploy VcgCiStack -c githubOidcProviderArn=<arn>`.
1. Copy the `DeployRoleArn` output into a GitHub Actions **variable** (not a secret) named `AWS_DEPLOY_ROLE_ARN`:  
   Settings → Secrets and variables → Actions → Variables.
1. Enable the workflow: Actions → "VCG build, test and deploy" → Enable workflow.

## Development

Both projects use Node 24 (see `.nvmrc`; run `nvm use`).

In `vcg-client` (Vite):

- `yarn start` runs the dev server on http://localhost:3000.
- `yarn test` runs the unit tests (Vitest), `yarn lint` runs ESLint.
- `yarn build` builds the site into `vcg-client/build`, which `vcg-aws` deploys.

## Deploy manually

1. Build Client with `yarn build` in `vcg-client` directory.
1. Deploy infrastructure (CDK v2)
   1. Set environment variables
      - `AWS_ACCESS_KEY_ID`
      - `AWS_SECRET_ACCESS_KEY`
      - `AWS_DEFAULT_REGION`.
   1. Install dependencies with `yarn` in `vcg-aws` directory.
   1. Once per account and region, bootstrap CDK v2 with `npx cdk bootstrap`.  
      An account bootstrapped by CDK v1 needs this again: v2 requires a newer bootstrap stack.
   1. Check the changes with `npx cdk diff VcgAwsStack`, then deploy with `npx cdk deploy VcgAwsStack` in `vcg-aws` directory.  
      The CDK will sync the S3 bucket.
