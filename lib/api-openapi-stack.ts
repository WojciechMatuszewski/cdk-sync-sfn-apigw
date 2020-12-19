import * as cdk from "@aws-cdk/core";
import { ApiOpenApi } from "./api-openapi";

export class ApiOpenAPIStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new ApiOpenApi(this, "openapi");
  }
}
