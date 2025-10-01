import express from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';

const app = express();
const PORT = 7001;
app.use(express.json());

const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'));

app.get('/', (req, res) => res.send(`Edicus Site Builder Server - v${packageJson.version}`));
app.get('/health', (req, res) => res.send('OK'));


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
