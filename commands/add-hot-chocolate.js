const pascalCase = require('pascal-case').pascalCase
const dashCase = require('param-case').paramCase
const camelCase = require('camel-case').camelCase

module.exports = {
  name: 'add-hot-chocolate',
  alias: ['add-hc'],
  run: async (toolbox) => {
    const {
      system: { run },
      print: { info },
    } = toolbox
    info('Adding hot chocolate!')
    run('dotnet add package HotChocolate.AspNetCore')
    run('dotnet add package HotChocolate.Data.EntityFramework')
    run('dotnet add package Microsoft.EntityFrameworkCore.Sqlite')
    run('dotnet ef migrations add InitialCreate')
    info('Hot Chocolate added!')
    info(`Add the following to the Startup.cs Configure function
======================================
app
  .UseRouting()
  .UseEndpoints(endpoints =>
  {
    endpoints.MapGraphQL();
  });
======================================
`)
  },
}
