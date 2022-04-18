/*
INSPIRATION: https://github.com/aws-samples/aws-cdk-examples/blob/master/typescript/static-site/static-site.ts
*/

import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as iam from '@aws-cdk/aws-iam';
import * as s3Deploy from '@aws-cdk/aws-s3-deployment';

export class VcgAwsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vcgBucket = new s3.Bucket(this, 'ValuesCardGameBucket', {
      versioned: false,
      bucketName: 'values-card-game',

      websiteRoutingRules: [
        {
          httpRedirectCode: '302',
          protocol: s3.RedirectProtocol.HTTPS,
        },
      ],

      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      publicReadAccess: true,

      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    vcgBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ['s3:GetObject'],
        resources: [vcgBucket.arnForObjects('*')],
        principals: [new iam.AnyPrincipal()],
      }),
    );
    new cdk.CfnOutput(this, 'Bucket', { value: vcgBucket.bucketName });

    // Deploy site contents to S3 bucket
    new s3Deploy.BucketDeployment(this, 'DeployWithInvalidation', {
      sources: [s3Deploy.Source.asset('../vcg-client/build')],
      destinationBucket: vcgBucket,
    });
  }
}
