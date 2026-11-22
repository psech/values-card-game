import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { App } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { VcgAwsStack } from '../lib/vcg-aws-stack';

// Logical ID of the live bucket. If this changes, CloudFormation would
// delete the bucket and create a new one.
const BUCKET_ID = 'ValuesCardGameBucket2F2DA5FE';

// Lambda stops accepting new or updated functions on deprecated runtimes.
const MIN_NODE = 20;
const MIN_PYTHON_MINOR = 10;

let template: Template;

beforeAll(() => {
  const siteDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vcg-site-'));
  fs.writeFileSync(path.join(siteDir, 'index.html'), '<!doctype html>');
  const stack = new VcgAwsStack(new App(), 'VcgAwsStack', { siteDir });
  template = Template.fromStack(stack);
});

test('keeps the live bucket and serves it as a website', () => {
  expect(template.findResources('AWS::S3::Bucket')).toHaveProperty(BUCKET_ID);
  template.hasResourceProperties('AWS::S3::Bucket', {
    BucketName: 'values-card-game',
    WebsiteConfiguration: {
      IndexDocument: 'index.html',
      ErrorDocument: 'index.html',
    },
    PublicAccessBlockConfiguration: {
      BlockPublicAcls: true,
      IgnorePublicAcls: true,
      BlockPublicPolicy: false,
      RestrictPublicBuckets: false,
    },
  });
});

test('lets anyone read the site files', () => {
  template.hasResourceProperties('AWS::S3::BucketPolicy', {
    PolicyDocument: {
      Statement: Match.arrayWith([
        Match.objectLike({
          Action: 's3:GetObject',
          Effect: 'Allow',
          Principal: { AWS: '*' },
        }),
      ]),
    },
  });
});

test('deploys the site into the bucket', () => {
  template.resourceCountIs('Custom::CDKBucketDeployment', 1);
});

test('uses only Lambda runtimes AWS still supports', () => {
  const runtimes = Object.values(
    template.findResources('AWS::Lambda::Function'),
  ).map((fn) => fn.Properties.Runtime as string);

  expect(runtimes.length).toBeGreaterThan(0);
  for (const runtime of runtimes) {
    const node = /^nodejs(\d+)\.x$/.exec(runtime);
    const python = /^python3\.(\d+)$/.exec(runtime);
    if (node) expect(Number(node[1])).toBeGreaterThanOrEqual(MIN_NODE);
    else if (python)
      expect(Number(python[1])).toBeGreaterThanOrEqual(MIN_PYTHON_MINOR);
    else throw new Error(`Unexpected Lambda runtime: ${runtime}`);
  }
});
