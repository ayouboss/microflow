const express = require('express');
const bodyParser = require('body-parser');
const { Microflow } = require('../../lib/index');
//const { PgStorage } = require()

const app = express();
const port = 5000;
const PATH = 'microflow';

const microflowService = new Microflow();

app.use(bodyParser.json());

// Register task
app.post(`/${PATH}/task`, async (req, res) => {
  const { body } = req;
  const response = await microflowService.createTask(body);
  return res.status(200).json(response);
});

// Query task
app.get(`/${PATH}/task/:id`, async (req, res) => {
  const { params } = req;
  const { id } = params;
  const response = await microflowService.getTask(id);
  return res.status(200).json(response);
});

// Register workflow
app.post(`/${PATH}/workflow`, async (req, res) => {
  const { body } = req;
  const response = await microflowService.createWorkflow(body);
  return res.status(200).json(response);
});

// Query workflow
app.get(`/${PATH}/workflow/:id`, async (req, res) => {
  const { params } = req;
  const { id } = params;
  const response = await microflowService.getWorkflow(id);
  return res.status(200).json(response);
});

// Start workflow instance
app.post(`/${PATH}/workflow/:id/start`, async (req, res) => {
  const { params } = req;
  const { id } = params;
  const response = await microflowService.startWorkflow(id);
  return res.status(200).json(response);
});

// Send event to workflow instance
app.post(`/${PATH}/workflow/instance/:id/event`, async (req, res) => {
  const { params, body } = req;
  const { id } = params;
  const response = await microflowService.sendEvent(id, body);
  return res.status(200).json(response);
});

// Query workflow instance
app.get(`/${PATH}/workflow/instance/:id`, async (req, res) => {
  const { id } = req.params;
  const response = await microflowService.getWorkflowInstance(id);
  res.status(200).json(response);
});

// Healthcheck
app.get(`/${PATH}`, (req, res) => {
  res.status(200).json({ message: 'Started' });
});

app.listen(port, () => {
  console.log(`endpoints listening at http://localhost:${port}`);
});
