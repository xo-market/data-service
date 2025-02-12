import app from "./index";
import { agenda } from "./resolvers/agenda";
import "./resolvers/farcaster";
const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await agenda.start();
  console.log('Agenda started and connected to MongoDB');
});
