import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const httpServer = createServer(app)
const io = new Server(httpServer, { cors: { origin: '*' } })

const workflows = new Map()

const seedWorkflows = [
  {
    id: '1',
    name: 'Email Summarizer',
    description: 'Automatically summarize long emails using AI',
    trigger: 'New email received',
    actions: ['Extract key points', 'Generate summary', 'Send notification'],
    status: 'active',
    runs: 142
  },
  {
    id: '2',
    name: 'Social Media Scheduler',
    description: 'Generate and schedule social media posts with AI',
    trigger: 'Manual trigger',
    actions: ['Generate content with AI', 'Optimize for platform', 'Schedule post'],
    status: 'active',
    runs: 67
  },
  {
    id: '3',
    name: 'Customer Support Bot',
    description: 'AI-powered first response to customer inquiries',
    trigger: 'New support ticket',
    actions: ['Analyze inquiry', 'Generate response', 'Route if complex'],
    status: 'paused',
    runs: 891
  }
]

seedWorkflows.forEach(w => workflows.set(w.id, w))

function generateAIContent(prompt, type) {
  const templates = {
    email: `Subject: Re: Your Inquiry\n\nThank you for reaching out. Based on your message about "${prompt}", here is a tailored response addressing your needs...\n\nBest regards,\nThe Team`,
    social: `🚀 ${prompt}\n\n#Innovation #Growth #Automation\n\nWhat are your thoughts? Drop a comment below! 👇`,
    summary: `**Key Points:**\n• Topic: ${prompt}\n• Priority: Medium\n• Action required by end of week\n\n**Summary:** This covers the essential points of "${prompt}" with clear next steps identified for the team.`
  }
  return templates[type] || `Generated content for: ${prompt}`
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'autoflow-api', timestamp: new Date().toISOString() })
})

app.get('/api/workflows', (req, res) => {
  res.json([...workflows.values()])
})

app.post('/api/workflows', (req, res) => {
  const { name, description, trigger, actions } = req.body
  if (!name) return res.status(400).json({ error: 'Workflow name is required' })

  const workflow = {
    id: Date.now().toString(),
    name,
    description: description || '',
    trigger: trigger || 'Manual trigger',
    actions: actions || [],
    status: 'active',
    runs: 0
  }
  workflows.set(workflow.id, workflow)
  res.status(201).json(workflow)
})

app.post('/api/workflows/:id/run', (req, res) => {
  const workflow = workflows.get(req.params.id)
  if (!workflow) return res.status(404).json({ error: 'Workflow not found' })

  const updated = { ...workflow, runs: workflow.runs + 1, lastRun: new Date().toISOString() }
  workflows.set(workflow.id, updated)

  io.emit('workflow_executed', {
    workflowId: workflow.id,
    workflowName: workflow.name,
    timestamp: new Date().toISOString(),
    status: 'success'
  })

  res.json({ success: true, workflow: updated })
})

app.patch('/api/workflows/:id/toggle', (req, res) => {
  const workflow = workflows.get(req.params.id)
  if (!workflow) return res.status(404).json({ error: 'Workflow not found' })

  const updated = { ...workflow, status: workflow.status === 'active' ? 'paused' : 'active' }
  workflows.set(workflow.id, updated)
  res.json(updated)
})

app.delete('/api/workflows/:id', (req, res) => {
  if (!workflows.has(req.params.id)) return res.status(404).json({ error: 'Workflow not found' })
  workflows.delete(req.params.id)
  res.status(204).send()
})

app.post('/api/ai/generate', (req, res) => {
  const { prompt, type } = req.body
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' })

  setTimeout(() => {
    res.json({ content: generateAIContent(prompt, type || 'email') })
  }, 600)
})

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id))
})

const PORT = process.env.PORT || 3002
httpServer.listen(PORT, () => {
  console.log(`AutoFlow API running on http://localhost:${PORT}`)
})