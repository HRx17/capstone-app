const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const path = require('path');
const app = express();
app.use(cors());

// Serve static frontend bundle
app.use(express.static(path.join(__dirname, '../dist')));

// React router fallback
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Store global simulation state
let simulationState = {
    currentMode: 'NEUTRAL',
    isLocked: true, // Start the phone in locked state
    autoPilotRunning: false,
    boostedApps: [] // Array of app IDs that should appear first
};

io.on('connection', (socket) => {
    console.log('A client connected:', socket.id);

    // Send current state to newly connected client
    socket.emit('state-update', simulationState);

    // Listen for admin changes
    socket.on('set-mode', (mode) => {
        console.log(`Admin changed mode to: ${mode}`);
        simulationState.currentMode = mode;
        io.emit('state-update', simulationState);
    });

    socket.on('set-locked', (locked) => {
        console.log(`Phone lock state changed to: ${locked}`);
        simulationState.isLocked = locked;
        io.emit('state-update', simulationState);
    });

    // --- NEW WOZ CONTROLS ---
    socket.on('set-auto-pilot', (running) => {
        console.log(`Auto-pilot changed to: ${running}`);
        simulationState.autoPilotRunning = running;
        io.emit('state-update', simulationState);
    });

    socket.on('push-notification', (data) => {
        console.log(`Pushing notification:`, data);
        io.emit('notification-received', data);
    });

    socket.on('trigger-modal', (modalId) => {
        console.log(`Triggering modal: ${modalId}`);
        io.emit('modal-triggered', modalId);
    });

    // --- SCENARIO 6-11 BOOSTS ---
    socket.on('boost-app', (appId) => {
        console.log(`Boosting app: ${appId}`);
        // Remove if it exists and put it at the start
        simulationState.boostedApps = [
            appId,
            ...simulationState.boostedApps.filter(id => id !== appId)
        ];
        io.emit('state-update', simulationState);
    });

    socket.on('reset-boosts', () => {
        console.log(`Resetting all boosted apps`);
        simulationState.boostedApps = [];
        io.emit('state-update', simulationState);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Wizard of Oz Backend listening on port ${PORT}`);
});
