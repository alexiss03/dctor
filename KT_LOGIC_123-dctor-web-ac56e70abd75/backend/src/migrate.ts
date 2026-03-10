import {DctorApiApplication} from './application';

import envConfig from 'config';
import {getConfig} from './config';

export async function migrate(args: string[]) {
  const existingSchema = args.includes('--rebuild') ? 'drop' : 'alter';
  console.log('Migrating schemas (%s existing schema)', existingSchema);

  const options = await getConfig();

  const app = new DctorApiApplication(options);
  await app.boot();
  await app.migrateSchema({
    existingSchema,
    models: [
      // Calendar
      'Event',
      'EventAttendee',
      // Dctor
      'DoctorReview', 'Facility', 'Insurance', 'Treatment', 'TreatmentCategory',
      'SearchIndex'
    ],
  });

  // Connectors usually keep a pool of opened connections,
  // this keeps the process running even after all work is done.
  // We need to exit explicitly.
  process.exit(0);
}

migrate(process.argv).catch(err => {
  console.error('Cannot migrate database schema', err);
  process.exit(1);
});
