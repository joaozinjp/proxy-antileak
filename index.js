const express = require('express');
const app = express();
app.use(express.json());

const AUTH_TOKEN = process.env.AUTH_TOKEN;
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;

app.post('/antileak', async (req, res) => {
    const token = req.headers['authorization'];

    console.log(`[${new Date().toISOString()}] Requisição recebida`);

    if (token !== AUTH_TOKEN) {
        console.log('[LOG] Token inválido:', token);
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const discordRes = await fetch(DISCORD_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        console.log(`[LOG] Discord status: ${discordRes.status}`);
        res.json({ ok: true });
    } catch (err) {
        console.error('[ERRO]', err);
        res.status(500).json({ error: 'Falha ao enviar' });
    }
});

app.listen(3000, () => console.log('Proxy rodando!'));
