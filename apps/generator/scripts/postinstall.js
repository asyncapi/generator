const migrationGuideUrl = '../docs/deprecate-cli.js-ag.md'
const installationGuideUrl = 'https://github.com/asyncapi/website/blob/master/assets/docs/fragments/cli-installation.md'

console.log(`
*************************************
*                                   *
*  DEPRECATION NOTICE               *
*                                   *
*************************************

The use of 'ag' for documentation generation is deprecated and will be removed in future releases.

Please migrate to the new AsyncAPI CLI using the following guide:

1. Install AsyncAPI CLI:
   $ npm install -g @asyncapi/cli
   For other installation methods, visit ${installationGuideUrl}

2. Update your commands:
   Replace the deprecated 'ag' commands with their AsyncAPI CLI equivalents.

Example Migration:

Before Migration (Using 'ag'):
$ ag ./asyncapi.yaml ./template -o ./output -p param1=value1 --debug --install --disable-hook hookType=hookName

After Migration (Using AsyncAPI CLI):
$ asyncapi generate fromTemplate ./asyncapi.yaml ./template --output ./output --param param1=value1 --debug --install --disable-hook hookType=hookName

For more details, please visit: ${migrationGuideUrl}

Thank you for your understanding and cooperation.
`);
