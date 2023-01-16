import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { z } from "zod";
import { Configuration, CreateCompletionResponse, OpenAIApi } from "openai";

const { MAGIC_API_OPENAI_API_KEY } = z
  .object({
    MAGIC_API_OPENAI_API_KEY: z.string(),
  })
  .parse(process.env);

const configuration = new Configuration({
  apiKey: MAGIC_API_OPENAI_API_KEY
});

export const AiLib = new OpenAIApi(configuration);

export const index = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log(JSON.stringify(event, null, 2));
  const axiosResponse = await AiLib.createCompletion({
    model: "text-davinci-003",
    prompt: `you are a generic json api. you have limits of 3 items write the data for ${event.path}`,
    temperature: 0,
    max_tokens: 500,
  });

  const response: CreateCompletionResponse = axiosResponse.data;
  console.log(JSON.stringify(response, null, 2));
  const choices = response.choices;

  if (!choices[0].text) {
    throw new Error("No choices returned");
  }

  return { statusCode: 200, body: choices[0].text };
};
