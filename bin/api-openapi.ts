#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { ApiOpenAPIStack } from "../lib/api-openapi-stack";

const app = new cdk.App();
new ApiOpenAPIStack(app, "ApiOpenAPI");
