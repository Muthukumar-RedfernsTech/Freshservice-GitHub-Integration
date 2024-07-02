const express = require('express');
const axios = require('axios');
const app = express();

const FRESHSERVICE_DOMAIN = 'redfernstech.freshservice.com';
const FRESHSERVICE_API_KEY = 'ujv5sxBYLBAA9WLIRP';

app.post('/webhook', express.json({type: 'application/json'}),
async (req, res) => {

    const githubIssue = req.body.issue;
    try {
        const response = await axios.post(
            `https://${FRESHSERVICE_DOMAIN}/api/v2/tickets`,
            {
                "description": `GitHub Issue: ${githubIssue.title}`,
                "subject": `${githubIssue.body}, GitHub Issue URL: ${githubIssue.url}`,
                "priority": 1,
                "status": 2,
                "requester_id":29001720875,
                "custom_fields": {
                   "github_issue_url": `${githubIssue.url}`
                }
            },
            {
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${Buffer.from(FRESHSERVICE_API_KEY + ':X').toString('base64')}`
                }
            }
        );
        console.log('Ticket created:', response.data);
        res.status(200).send('Webhook processed successfully');
    } catch (error) {
        console.error('Error creating ticket:', error);
        res.status(500).send('Error processing webhook');
    }

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
