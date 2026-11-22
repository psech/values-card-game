#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { VcgAwsStack } from '../lib/vcg-aws-stack';

const app = new cdk.App();
// Environment-agnostic: deploys to the account and region of the current
// AWS credentials (the live site is in ap-southeast-2).
new VcgAwsStack(app, 'VcgAwsStack');
