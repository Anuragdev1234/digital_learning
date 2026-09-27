/**
 * Potential as a Passport - Standalone Edge & AI Backend Microservice
 * Runs on Port 3001 to provide a dedicated backend server alongside the Next.js web application.
 */

import http from 'http';
import { evaluateSubmissionOrEdit } from '../lib/ai/autoFilter';
import { processMentorChatMessage } from '../lib/ai/mentorPrompt';

const PORT = 3001;

const server = http.createServer(async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const url = req.url || '';

  // 1. Health Endpoint
  if (req.method === 'GET' && (url === '/' || url === '/health')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        status: 'online',
        service: 'Potential as a Passport - AI & Edge Functions Backend Server',
        port: PORT,
        activeEndpoints: [
          'GET /health',
          'POST /functions/v1/ai_auto_filter',
          'POST /functions/v1/floating_ai_mentor',
          'GET /api/stats',
        ],
        timestamp: new Date().toISOString(),
      })
    );
    return;
  }

  // 2. Statistics Endpoint
  if (req.method === 'GET' && url === '/api/stats') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        ecosystem: 'Potential as a Passport',
        totalStudentsRegistered: 3,
        verifiedMentors: 2,
        activeStreaks: 3,
        totalTokensCirculating: 3100,
        tokenTiers: {
          tier1_cost: 100,
          tier2_cost: 300,
          tier3_cost: 1000,
        },
        aiModel: 'Gemini 1.5 Flash + Deterministic Socratic Fallback',
        uptimeSeconds: process.uptime(),
      })
    );
    return;
  }

  // 3. AI Auto-Filter Function
  if (req.method === 'POST' && url.includes('/functions/v1/ai_auto_filter')) {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const text = payload.submissionText || payload.text || '';
        const topic = payload.topicTitle || payload.topic || 'Class 10 - Machines';
        const level = payload.gradeLevel || payload.level || 'Class 10';

        const result = await evaluateSubmissionOrEdit({
          submissionText: text,
          topicTitle: topic,
          gradeLevel: level,
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (err: any) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message || 'Invalid JSON payload' }));
      }
    });
    return;
  }

  // 4. Floating AI Mentor Function
  if (req.method === 'POST' && url.includes('/functions/v1/floating_ai_mentor')) {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const message = payload.message || '';
        const trackId = payload.trackId || 'track-class10-machines';
        const workflowState = payload.workflowState || 'CHALLENGE_ACTIVE';

        const result = processMentorChatMessage(message, trackId, workflowState);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (err: any) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  // Fallback 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint not found', available: ['/health', '/api/stats', '/functions/v1/ai_auto_filter', '/functions/v1/floating_ai_mentor'] }));
});

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`POTENTIAL AS A PASSPORT - BACKEND EDGE SERVER ONLINE`);
  console.log(`Server listening on: http://localhost:${PORT}`);
  console.log(`====================================================`);
});
