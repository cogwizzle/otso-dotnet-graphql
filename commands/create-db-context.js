const pascalCase = require('pascal-case').pascalCase
const dashCase = require('param-case').paramCase
const camelCase = require('camel-case').camelCase

module.exports = {
  name: 'create-db-context',
  alias: ['cdb'],
  run: async (toolbox) => {
    const {
      print: { info },
      template: { generate },
      filesystem: { read }
    } = toolbox

    const package = read('./package.json', 'json');
    const packageName = pascalCase(package.name);

    await generate({
      template: 'db-context.cs.ejs',
      target: `${packageName}DbContext.cs`,
      props: {
        packageName,
      }
    });

    info(`Created DB context at ${packageName}DbContext.cs`)
    info(`Add this to the Startup.cs ConfigureServices
=========================================
services
  .AddDbContext<${packageName}.Data.${packageName}DbContext>();
========================================
`)
  }
}
