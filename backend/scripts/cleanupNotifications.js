#!/usr/bin/env node

/**
 * Notification Cleanup Script
 * 
 * This script cleans up old read notifications to keep the database lean.
 * Can be run manually or scheduled as a cron job.
 * 
 * Usage:
 *   node scripts/cleanupNotifications.js [days]
 * 
 * Example:
 *   node scripts/cleanupNotifications.js 30  # Clean notifications older than 30 days
 */

const mongoose = require('mongoose');
const NotificationService = require('../services/notificationService');

// Get days from command line argument or default to 30
const daysOld = parseInt(process.argv[2]) || 30;

async function cleanup() {
    try {
        // Connect to MongoDB (use your connection string)
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/your-db-name');
        console.log('Connected to MongoDB');

        // Run cleanup
        console.log(`Starting cleanup of notifications older than ${daysOld} days...`);
        const deletedCount = await NotificationService.cleanupOldNotifications(daysOld);
        
        console.log(`✅ Cleanup completed. Removed ${deletedCount} old notifications.`);
        
    } catch (error) {
        console.error('❌ Cleanup failed:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    }
}

// Run the cleanup
cleanup();