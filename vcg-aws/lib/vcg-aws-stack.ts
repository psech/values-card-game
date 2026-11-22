/*
INSPIRATION: https://github.com/aws-samples/aws-cdk-examples/blob/master/typescript/static-site/static-site.ts
*/

import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3Deploy from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';

export interface VcgAwsStackProps extends cdk.StackProps {
  /** Folder with the built site. Defaults to the client's production build. */
  readonly siteDir?: string;
}

// Construct IDs must stay as they are: they decide the CloudFormation logical
// IDs, and a changed ID makes CloudFormation replace the live bucket.
export class VcgAwsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: VcgAwsStackProps = {}) {
    super(scope, id, props);

    const vcgBucket = new s3.Bucket(this, 'ValuesCardGameBucket', {
      versioned: false,
      bucketName: 'values-card-game',

      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      // S3 blocks all public access by default since April 2023, so a public
      // website has to allow public bucket policies explicitly.
      publicReadAccess: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS_ONLY,

      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    new cdk.CfnOutput(this, 'Bucket', { value: vcgBucket.bucketName });

    // Copies the site into the bucket, deleting files the new build doesn't
    // have. (There is no CloudFront, so nothing is invalidated despite the ID.)
    new s3Deploy.BucketDeployment(this, 'DeployWithInvalidation', {
      sources: [
        s3Deploy.Source.asset(
          props.siteDir ?? path.join(__dirname, '../../vcg-client/build'),
        ),
      ],
      destinationBucket: vcgBucket,
    });
  }
}
