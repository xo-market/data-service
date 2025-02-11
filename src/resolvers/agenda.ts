import {Agenda} from '@hokify/agenda';

const mongoConnectionString = process.env.MONGO_URI || 'mongodb://localhost:27017/agendaDb';

// Create and export the Agenda instance
export const agenda = new Agenda({ db: { address: mongoConnectionString } });

// Start the Agenda processor
(async () => {
  await agenda.start();
  console.log('Agenda started and connected to MongoDB');
})();
