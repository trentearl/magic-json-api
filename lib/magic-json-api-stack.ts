import * as cdk from "aws-cdk-lib";
import { Duration } from "aws-cdk-lib";
import { Cors, LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

export interface MagicJsonApiStackProps extends cdk.StackProps {
  openaiApiKey: string;
}

const ROOT = join(__dirname, "..", "lambda");
export class MagicJsonApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: MagicJsonApiStackProps) {
    super(scope, id, props);

    const fn = new NodejsFunction(this, "MagicJsonApi", {
      depsLockFilePath: join(ROOT, "package-lock.json"),
      projectRoot: join(ROOT),
      timeout: Duration.seconds(15),
      memorySize: 128,
      runtime: Runtime.NODEJS_16_X,
      handler: "index",
      entry: join(ROOT, "src", "api.ts"),
      environment: {
        MAGIC_API_OPENAI_API_KEY: props.openaiApiKey,
      },
    });

    const api = new LambdaRestApi(this, "MagicJsonLambda", {
      handler: fn,

      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
      },
    });

    new cdk.CfnOutput(this, "MagicJsonApiUrl", {
      value: api.url,
    });
  }
}
