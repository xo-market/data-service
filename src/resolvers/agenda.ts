import {Agenda} from '@hokify/agenda';

const mongoConnectionString = process.env.MONGO_URI || 'mongodb://localhost:27017/agendaDb';

export const agenda = new Agenda({ db: { address: mongoConnectionString } });