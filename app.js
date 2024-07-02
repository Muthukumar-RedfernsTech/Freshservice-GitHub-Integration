const express = require('express');
const axios = require('axios');
const app = express();

const FRESHSERVICE_DOMAIN = 'redtech.freshservice.com';
const FRESHSERVICE_API_KEY = 'ujv5sxBYLAA9WLIRP';

app.post('/webhook', express.json({type: 'application/json'}), async (req, res) => {
    const githubIssue = req.body.issue;
    if (githubIssue.body && githubIssue.body.includes('@create-freshservice-ticket')) {
        try {
            const response = await axios.post(
                `https://${FRESHSERVICE_DOMAIN}/api/v2/tickets`,
                {
                    "description": `GitHub Issue: ${githubIssue.title}`,
                    "subject": `${githubIssue.body}, GitHub Issue URL: ${githubIssue.url}`,
                    "priority": 1,
                    "status": 2,
                    "requester_id": 29001720875,
                    "custom_fields": {
                      "github_issue_url": `${githubIssue.url}`
                    }
                },
                {
                    headers: {
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
    } else {
        console.log('Issue does not contain the required tag. No ticket created.');
        res.status(200).send('Webhook processed, no ticket created');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
