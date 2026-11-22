import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

const GITHUB_OIDC_URL = 'https://token.actions.githubusercontent.com';
const GITHUB_OIDC_HOST = 'token.actions.githubusercontent.com';

export interface VcgCiStackProps extends cdk.StackProps {
  /** GitHub repository allowed to deploy, as `owner/name`. */
  readonly githubRepo: string;
  /** GitHub environment the deploy job runs in. */
  readonly githubEnvironment: string;
  /**
   * An account can have only one GitHub OIDC provider. Pass its ARN if the
   * account already has one; otherwise this stack creates it.
   */
  readonly existingOidcProviderArn?: string;
}

/**
 * Lets GitHub Actions deploy without stored AWS keys: the deploy job swaps
 * GitHub's OIDC token for short-lived credentials of this role. Only jobs in
 * the given repository and environment can assume it, and all the role can
 * do is assume the CDK bootstrap roles, the same way `cdk deploy` does
 * locally.
 */
export class VcgCiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: VcgCiStackProps) {
    super(scope, id, props);

    const provider = props.existingOidcProviderArn
      ? iam.OidcProviderNative.fromOidcProviderArn(
          this,
          'GitHubOidc',
          props.existingOidcProviderArn,
        )
      : new iam.OidcProviderNative(this, 'GitHubOidc', {
          url: GITHUB_OIDC_URL,
          clientIds: ['sts.amazonaws.com'],
        });

    const role = new iam.Role(this, 'GitHubDeployRole', {
      description: `Deploys ${props.githubRepo} from GitHub Actions`,
      maxSessionDuration: cdk.Duration.hours(1),
      assumedBy: new iam.WebIdentityPrincipal(provider.oidcProviderArn, {
        StringEquals: {
          [`${GITHUB_OIDC_HOST}:aud`]: 'sts.amazonaws.com',
          [`${GITHUB_OIDC_HOST}:sub`]: `repo:${props.githubRepo}:environment:${props.githubEnvironment}`,
        },
      }),
    });

    role.addToPolicy(
      new iam.PolicyStatement({
        actions: ['sts:AssumeRole'],
        resources: [
          `arn:${this.partition}:iam::${this.account}:role/cdk-hnb659fds-*-${this.account}-${this.region}`,
        ],
      }),
    );

    new cdk.CfnOutput(this, 'DeployRoleArn', {
      value: role.roleArn,
      description: 'Set as the AWS_DEPLOY_ROLE_ARN GitHub Actions variable',
    });
  }
}
