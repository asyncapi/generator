console.log(`
*************************************
*                                   *
*  DEPRECATION NOTICE               *
*                                   *
*************************************

The use of 'Cli.js' for documentation generation is deprecated and will be removed in future releases.

Please migrate to the new AsyncAPI CLI using the following guide:

1. Install AsyncAPI CLI:
   $ npm install -g @asyncapi/cli

2. Update your commands:
   Replace the deprecated 'Cli.js' commands with their AsyncAPI CLI equivalents.

Example Migration:

Before Migration (Using 'Cli.js'):
$ node Cli.js ./asyncapi.yaml ./template -o ./output -p param1=value1 --debug --install --disable-hook hookType=hookName

After Migration (Using AsyncAPI CLI):
$ asyncapi generate fromTemplate ./asyncapi.yaml ./template --output ./output --param param1=value1 --debug --install --disable-hook hookType=hookName

For more details, please visit: [Migration Guide URL]

Thank you for your understanding and cooperation.
`);
