#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { MagicJsonApiStack } from '../lib/magic-json-api-stack';
import { z } from 'zod';

const { MAGIC_API_OPENAI_API_KEY } = z
  .object({
    MAGIC_API_OPENAI_API_KEY: z.string(),
  })
  .parse(process.env);

const app = new cdk.App();

new MagicJsonApiStack(app, 'MagicJsonApiStack', {
  openaiApiKey: MAGIC_API_OPENAI_API_KEY,
});
