/**
 * Cloud Sync Routes for The Divine Vanity
 * Backend API for real-time cross-device synchronization
 */

import { Router } from 'express';
import { storage } from './storage';

const syncRouter = Router();

/**
 * WebSocket handler for real-time sync
 */
export function setupSyncWebSocket(wss: any) {
  // Track connected devices per user
  const userConnections = new Map<string, Set<any>>();
  
  wss.on('connection', (ws: any, req: any) => {
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const path = url.pathname;
    
    if (path === '/ws/sync') {
      const userId = url.searchParams.get('userId');
      const deviceId = url.searchParams.get('deviceId');
      
      if (!userId || !deviceId) {
        ws.close(1008, 'Missing userId or deviceId');
        return;
      }
      
      console.log('Sync WebSocket connected:', { userId, deviceId });
      
      // Track connection
      if (!userConnections.has(userId)) {
        userConnections.set(userId, new Set());
      }
      userConnections.get(userId)!.add(ws);
      
      // Store device info on connection
      ws.userId = userId;
      ws.deviceId = deviceId;
      ws.lastActivity = Date.now();
      
      ws.on('message', async (message: string) => {
        try {
          const data = JSON.parse(message);
          await handleSyncMessage(ws, data, userConnections);
        } catch (error) {
          console.error('Sync WebSocket message error:', error);
          ws.send(JSON.stringify({ error: 'Invalid message format' }));
        }
      });
      
      ws.on('close', () => {
        console.log('Sync WebSocket disconnected:', { userId, deviceId });
        const connections = userConnections.get(userId);
        if (connections) {
          connections.delete(ws);
          if (connections.size === 0) {
            userConnections.delete(userId);
          }
        }
      });
      
      // Send connection confirmation
      ws.send(JSON.stringify({
        type: 'sync:connected',
        payload: { userId, deviceId, timestamp: Date.now() }
      }));
    }
  });
  
  // Periodic cleanup of inactive connections
  setInterval(() => {
    const now = Date.now();
    const timeout = 5 * 60 * 1000; // 5 minutes
    
    userConnections.forEach((connections, userId) => {
      connections.forEach(ws => {
        if (ws.lastActivity && (now - ws.lastActivity) > timeout) {
          console.log('Closing inactive sync connection:', { userId, deviceId: ws.deviceId });
          ws.close();
        }
      });
    });
  }, 60000); // Check every minute
}

/**
 * Handle sync WebSocket messages
 */
async function handleSyncMessage(ws: any, data: any, userConnections: Map<string, Set<any>>) {
  const { action, payload } = data;
  ws.lastActivity = Date.now();
  
  switch (action) {
    case 'broadcast':
      await handleBroadcast(ws, payload, userConnections);
      break;
    case 'ping':
      ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
      break;
    default:
      ws.send(JSON.stringify({ error: 'Unknown action' }));
  }
}

/**
 * Broadcast sync data to other devices
 */
async function handleBroadcast(ws: any, syncData: any, userConnections: Map<string, Set<any>>) {
  const { userId, deviceId } = ws;
  const connections = userConnections.get(userId);
  
  if (!connections) return;
  
  // Broadcast to all other devices for this user
  connections.forEach(otherWs => {
    if (otherWs !== ws && otherWs.readyState === 1) { // WebSocket.OPEN
      otherWs.send(JSON.stringify({
        type: 'sync:data',
        payload: syncData
      }));
    }
  });
  
  console.log('Broadcasted sync data:', { 
    userId, 
    fromDevice: deviceId, 
    toDevices: connections.size - 1,
    dataType: syncData.type 
  });
}

// REST API endpoints

/**
 * Upload sync data
 */
syncRouter.post('/upload', async (req, res) => {
  try {
    const syncData = req.body;
    const { id, type, data, timestamp, deviceId, userId, version } = syncData;
    
    // Validate required fields
    if (!id || !type || !data || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check for existing data
    const existingData = await getSyncData(userId, type, id);
    
    if (existingData) {
      // Check for conflicts
      if (existingData.version >= version && existingData.timestamp > timestamp) {
        return res.status(409).json({
          error: 'Conflict detected',
          remoteData: existingData
        });
      }
    }
    
    // Store sync data
    await storeSyncData(syncData);
    
    console.log('Sync data uploaded:', { userId, type, id, deviceId });
    
    res.json({
      success: true,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Sync upload error:', error);
    res.status(500).json({ error: 'Failed to upload sync data' });
  }
});

/**
 * Download sync data
 */
syncRouter.get('/download', async (req, res) => {
  try {
    const { since, deviceId } = req.query;
    const userId = req.user?.id || req.headers['x-user-id']; // Handle auth properly
    
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const sinceTimestamp = since ? parseInt(since as string) : 0;
    
    // Get sync data newer than timestamp
    const syncData = await getSyncDataSince(userId, sinceTimestamp, deviceId as string);
    
    console.log('Sync data downloaded:', { 
      userId, 
      deviceId, 
      count: syncData.length,
      since: sinceTimestamp 
    });
    
    res.json(syncData);
  } catch (error) {
    console.error('Sync download error:', error);
    res.status(500).json({ error: 'Failed to download sync data' });
  }
});

/**
 * Get sync status
 */
syncRouter.get('/status/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get sync statistics
    const stats = await getSyncStats(userId);
    
    res.json({
      userId,
      lastSync: stats.lastSync,
      totalItems: stats.totalItems,
      pendingConflicts: stats.pendingConflicts,
      devices: stats.devices
    });
  } catch (error) {
    console.error('Sync status error:', error);
    res.status(500).json({ error: 'Failed to get sync status' });
  }
});

/**
 * Resolve sync conflict
 */
syncRouter.post('/resolve-conflict', async (req, res) => {
  try {
    const { userId, conflictId, resolution, resolvedData } = req.body;
    
    // Store resolved data
    await storeSyncData({
      ...resolvedData,
      version: resolvedData.version + 1,
      timestamp: Date.now(),
      conflictResolution: resolution
    });
    
    // Remove conflict record
    await removeConflict(userId, conflictId);
    
    console.log('Conflict resolved:', { userId, conflictId, resolution });
    
    res.json({
      success: true,
      message: 'Conflict resolved successfully'
    });
  } catch (error) {
    console.error('Conflict resolution error:', error);
    res.status(500).json({ error: 'Failed to resolve conflict' });
  }
});

/**
 * Get user devices
 */
syncRouter.get('/devices/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const devices = await getUserDevices(userId);
    
    res.json(devices);
  } catch (error) {
    console.error('Get devices error:', error);
    res.status(500).json({ error: 'Failed to get devices' });
  }
});

/**
 * Update device info
 */
syncRouter.post('/device', async (req, res) => {
  try {
    const { userId, deviceId, deviceInfo } = req.body;
    
    await updateDeviceInfo(userId, deviceId, {
      ...deviceInfo,
      lastSeen: Date.now()
    });
    
    res.json({
      success: true,
      message: 'Device info updated'
    });
  } catch (error) {
    console.error('Device update error:', error);
    res.status(500).json({ error: 'Failed to update device info' });
  }
});

// Storage layer functions (implement with your database)

/**
 * Store sync data in database
 */
async function storeSyncData(syncData: any): Promise<void> {
  // Implementation depends on your database schema
  // Real storage integration with error handling
  
  try {
    // Example implementation:
    await storage.createSyncData({
      id: syncData.id,
      userId: syncData.userId,
      type: syncData.type,
      data: JSON.stringify(syncData.data),
      timestamp: syncData.timestamp,
      deviceId: syncData.deviceId,
      version: syncData.version
    });
  } catch (error) {
    console.error('Failed to store sync data:', error);
    throw error;
  }
}

/**
 * Get sync data by ID
 */
async function getSyncData(userId: string, type: string, id: string): Promise<any> {
  try {
    // Implementation depends on your database schema
    const result = await storage.getSyncData(userId, type, id);
    return result;
  } catch (error) {
    console.error('Failed to get sync data:', error);
    return null;
  }
}

/**
 * Get sync data since timestamp
 */
async function getSyncDataSince(userId: string, since: number, excludeDeviceId?: string): Promise<any[]> {
  try {
    // Implementation depends on your database schema
    const results = await storage.getSyncDataSince(userId, since, excludeDeviceId);
    return results.map(item => ({
      ...item,
      data: JSON.parse(item.data)
    }));
  } catch (error) {
    console.error('Failed to get sync data since:', error);
    return [];
  }
}

/**
 * Get sync statistics
 */
async function getSyncStats(userId: string): Promise<any> {
  try {
    // Implementation depends on your database schema
    const stats = await storage.getSyncStats(userId);
    return stats;
  } catch (error) {
    console.error('Failed to get sync stats:', error);
    return {
      lastSync: 0,
      totalItems: 0,
      pendingConflicts: 0,
      devices: []
    };
  }
}

/**
 * Remove conflict record
 */
async function removeConflict(userId: string, conflictId: string): Promise<void> {
  try {
    await storage.removeConflict(userId, conflictId);
  } catch (error) {
    console.error('Failed to remove conflict:', error);
  }
}

/**
 * Get user devices
 */
async function getUserDevices(userId: string): Promise<any[]> {
  try {
    const devices = await storage.getUserDevices(userId);
    return devices;
  } catch (error) {
    console.error('Failed to get user devices:', error);
    return [];
  }
}

/**
 * Update device info
 */
async function updateDeviceInfo(userId: string, deviceId: string, deviceInfo: any): Promise<void> {
  try {
    await storage.updateDeviceInfo(userId, deviceId, deviceInfo);
  } catch (error) {
    console.error('Failed to update device info:', error);
  }
}

export { syncRouter };