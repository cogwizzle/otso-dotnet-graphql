const pascalCase = require('pascal-case').pascalCase
const dashCase = require('param-case').paramCase
const camelCase = require('camel-case').camelCase

const requestProperty = async (prompt, properties = []) => {
  const shouldCreateProperty = await prompt.confirm('Would you like to add a new property?')
  if (shouldCreateProperty) {
    const propertyResults = await prompt.ask([
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of the property?',
      },
      {
        type: 'select',
        name: 'type',
        message: 'What is the type of the property?',
        choices: ['string', 'int', 'double', 'DateTime'],
      },
    ]);
    const property = {
      ...propertyResults
    };
    return await requestProperty(prompt, [...properties, property]);
  }
  return properties;
}

module.exports = {
  name: 'generate-graphql-model',
  alias: ['gql'],
  run: async (toolbox) => {
    const {
      parameters,
      template: { generate },
      print: { info },
      prompt,
    } = toolbox

    const results = await prompt.ask([
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of the model?',
      },
      {
        type: 'input',
        name: 'namespace',
        message: 'What is the namespace for the model?',
      }
    ]);
    const modelName = pascalCase(results.name);
    const modelNamespace = pascalCase(results.namespace);
    const properties = await requestProperty(prompt);

    info(`Inputs: ${modelName} ${modelNamespace} ${JSON.stringify(properties, null, 2)}`)

    await generate({
      template: 'model.cs.ejs',
      target: `model/${modelNamespace}/${modelName}.cs`,
      props: {
        modelName,
        modelNamespace,
        properties,
      }
    })

    await generate({
      template: 'interface-repository.cs.ejs',
      target: `service/${modelNamespace}/I${modelName}Repository.cs`,
      props: {
        modelName,
        modelNamespace,
        properties,
      }
    })

    await generate({
      template: 'repository.cs.ejs',
      target: `service/${modelNamespace}/${modelName}Repository.cs`,
      props: {
        modelName,
        modelNamespace,
        properties,
      }
    })

    await generate({
      template: 'interface-service.cs.ejs',
      target: `service/${modelNamespace}/I${modelName}Service.cs`,
      props: {
        modelName,
        modelNamespace,
        properties,
      }
    })

    await generate({
      template: 'service.cs.ejs',
      target: `service/${modelNamespace}/${modelName}Service.cs`,
      props: {
        modelName,
        modelNamespace,
        properties,
      }
    })

    // TODO alter Startup.cs file with this stuff
    // https://chillicream.com/docs/hotchocolate/get-started/#step-2-create-a-graphql-schema

    info(`Generate model at model/${modelNamespace}/${modelName}.cs`)
    info(`Generate service at service/${modelNamespace}/I${modelName}Repository.cs`)
    info(`Generate service at service/${modelNamespace}/${modelName}Repository.cs`)
    info(`Generate service at service/${modelNamespace}/I${modelName}Service.cs`)
    info(`Generate service at service/${modelNamespace}/${modelName}Service.cs`)
  },
}
