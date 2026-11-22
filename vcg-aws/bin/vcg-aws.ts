#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { VcgAwsStack } from '../lib/vcg-aws-stack';
import { VcgCiStack } from '../lib/vcg-ci-stack';

const app = new cdk.App();

// Environment-agnostic: both stacks deploy to the account and region of the
// current AWS credentials (the live site is in ap-southeast-2).

// The site. CI deploys this one on every push to main.
new VcgAwsStack(app, 'VcgAwsStack');

// The role GitHub Actions uses to deploy. Deployed by hand, once:
//   npx cdk deploy VcgCiStack
new VcgCiStack(app, 'VcgCiStack', {
  githubRepo: 'psech/values-card-game',
  githubEnvironment: 'production',
  existingOidcProviderArn: app.node.tryGetContext('githubOidcProviderArn'),
});
