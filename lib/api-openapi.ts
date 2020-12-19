import * as cdk from "@aws-cdk/core";
import * as apigwv2 from "@aws-cdk/aws-apigatewayv2";
import * as iam from "@aws-cdk/aws-iam";
import * as sfn from "@aws-cdk/aws-stepfunctions";

export class ApiOpenApi extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    const machineDefinition = new sfn.Pass(this, "passState", {
      result: { value: "Hi there!" }
    });

    const machine = new sfn.StateMachine(this, "machine", {
      definition: machineDefinition,
      stateMachineType: sfn.StateMachineType.EXPRESS
    });

    const api = new apigwv2.HttpApi(this, "openapi-api");

    const apiRole = new iam.Role(this, "sfnRole", {
      assumedBy: new iam.ServicePrincipal("apigateway.amazonaws.com"),
      inlinePolicies: {
        AllowSFNExec: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              actions: ["states:StartSyncExecution"],
              effect: iam.Effect.ALLOW,
              resources: [machine.stateMachineArn]
            })
          ]
        })
      }
    });

    const definition = {
      openapi: "3.0.1",
      info: {
        title: "openapi-definition",
        version: "2020-12-19 12:06:00UTC"
      },
      paths: {
        "/": {
          post: {
            responses: {
              default: {
                description: "Default response for GET /"
              }
            },
            "x-amazon-apigateway-integration": {
              integrationSubtype: "StepFunctions-StartSyncExecution",
              credentials: apiRole.roleArn,
              requestParameters: {
                StateMachineArn: machine.stateMachineArn
              },
              payloadFormatVersion: "1.0",
              type: "aws_proxy",
              connectionType: "INTERNET",
              timeoutInMillis: 30000
            }
          }
        }
      },
      "x-amazon-apigateway-cors": {
        allowMethods: ["*"],
        maxAge: 0,
        allowCredentials: false,
        allowOrigins: ["*"]
      },
      "x-amazon-apigateway-importexport-version": "1.0"
    };

    const cfnApi = api.node.defaultChild as apigwv2.CfnApi;
    cfnApi.addPropertyOverride("Body", definition);
    // with body specified and these present, CF throws an error about \/ being redundant.
    cfnApi.addPropertyDeletionOverride("Name");
    cfnApi.addPropertyDeletionOverride("ProtocolType");

    new cdk.CfnOutput(this, "openapiUrl", {
      value: api.apiEndpoint
    });
  }
}
