import { App } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { VcgCiStack } from '../lib/vcg-ci-stack';

const props = {
  githubRepo: 'psech/values-card-game',
  githubEnvironment: 'production',
};

const synth = (extra = {}) =>
  Template.fromStack(new VcgCiStack(new App(), 'VcgCiStack', { ...props, ...extra }));

test('creates the GitHub OIDC provider', () => {
  synth().hasResourceProperties('AWS::IAM::OIDCProvider', {
    Url: 'https://token.actions.githubusercontent.com',
    ClientIdList: ['sts.amazonaws.com'],
  });
});

test('reuses an existing OIDC provider when given one', () => {
  synth({
    existingOidcProviderArn:
      'arn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com',
  }).resourceCountIs('AWS::IAM::OIDCProvider', 0);
});

test('only the production environment of this repo can assume the role', () => {
  synth().hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [
        Match.objectLike({
          Action: 'sts:AssumeRoleWithWebIdentity',
          Condition: {
            StringEquals: {
              'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
              'token.actions.githubusercontent.com:sub':
                'repo:psech/values-card-game:environment:production',
            },
          },
        }),
      ],
    },
  });
});

test('the role can only assume the CDK bootstrap roles', () => {
  const policies = Object.values(
    synth().findResources('AWS::IAM::Policy'),
  ).flatMap((p) => p.Properties.PolicyDocument.Statement);

  expect(policies).toHaveLength(1);
  expect(policies[0].Action).toBe('sts:AssumeRole');
  expect(JSON.stringify(policies[0].Resource)).toContain(':role/cdk-hnb659fds-*-');
});
