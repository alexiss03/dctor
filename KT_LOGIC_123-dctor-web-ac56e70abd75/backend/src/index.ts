import * as lodash from 'lodash';

import {ApplicationConfig, DctorApiApplication} from './application';
import {seedDemoData} from './demo/seed-data';
import {IAMUserRepository, SearchIndexRepository} from './repositories';

export * from './application';
import {getConfig} from './config';

export async function main(options: ApplicationConfig = {}) {
  options = lodash.merge(options, await getConfig());

  const app = new DctorApiApplication(options);
  await app.boot();
  await app.start();
  await seedLocalDemoDataIfNeeded(app, options);

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}

async function seedLocalDemoDataIfNeeded(
  app: DctorApiApplication,
  options: ApplicationConfig,
): Promise<void> {
  const connector = `${(options as any)?.datasources?.dctordb?.connector ?? ''}`.toLowerCase();

  if (connector !== 'memory') {
    return;
  }

  try {
    const iamUserRepository = await app.getRepository(IAMUserRepository);
    const searchIndexRepository = await app.getRepository(SearchIndexRepository);
    await seedDemoData(iamUserRepository, searchIndexRepository);
  } catch (error) {
    console.error('Failed to seed local demo data.', error);
  }
}

if (require.main === module) {
  // Run the application
  main().catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
