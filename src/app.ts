import e from 'express';
import express from 'express';

const app = express();

app.get('/',(req, res) => {
    res.json({
        success: true,
        message: 'Server is running'
    })
})

export default app;