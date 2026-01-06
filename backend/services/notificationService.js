const Notification = require('../models/Notification');

class NotificationService {
    
    // Create a single notification
    static async createNotification({
        recipient,
        sender = null,
        type,
        title,
        message,
        relatedEvent = null,
        relatedRegistration = null,
        priority = 'medium'
    }) {
        try {
            const notification = new Notification({
                recipient,
                sender,
                type,
                title,
                message,
                relatedEvent,
                relatedRegistration,
                priority
            });

            await notification.save();
            console.log(`Notification created: ${type} for user ${recipient}`);
            return notification;
        } catch (error) {
            console.error('Error creating notification:', error);
            throw error;
        }
    }

    // Registration approved notification
    static async notifyRegistrationApproved(registration, event) {
        return await this.createNotification({
            recipient: registration.student,
            type: 'registration_approved',
            title: 'Registration Approved! 🎉',
            message: `Your registration for "${event.title}" has been approved`,
            relatedEvent: event._id,
            relatedRegistration: registration._id,
            priority: 'high'
        });
    }

    // Registration rejected notification
    static async notifyRegistrationRejected(registration, event) {
        return await this.createNotification({
            recipient: registration.student,
            type: 'registration_rejected',
            title: 'Registration Update',
            message: `Your registration for "${event.title}" was not approved`,
            relatedEvent: event._id,
            relatedRegistration: registration._id,
            priority: 'medium'
        });
    }

    // New registration notification (to admin)
    static async notifyNewRegistration(registration, event, adminId) {
        return await this.createNotification({
            recipient: adminId,
            type: 'new_registration',
            title: 'New Event Registration',
            message: `${registration.studentName} registered for "${event.title}"`,
            relatedEvent: event._id,
            relatedRegistration: registration._id,
            priority: 'medium'
        });
    }

    // Event created notification (broadcast to all students)
    static async notifyEventCreated(event, studentIds) {
        const notifications = studentIds.map(studentId => ({
            recipient: studentId,
            sender: event.adminId,
            type: 'event_created',
            title: 'New Event Available! 🎊',
            message: `"${event.title}" at ${event.collegeName}`,
            relatedEvent: event._id,
            priority: 'medium'
        }));

        try {
            await Notification.insertMany(notifications);
            console.log(`Event created notifications sent to ${studentIds.length} students`);
        } catch (error) {
            console.error('Error broadcasting event created notifications:', error);
            throw error;
        }
    }

    // Event updated notification
    static async notifyEventUpdated(event, registeredStudentIds) {
        const notifications = registeredStudentIds.map(studentId => ({
            recipient: studentId,
            sender: event.adminId,
            type: 'event_updated',
            title: 'Event Updated',
            message: `"${event.title}" has been updated. Check details.`,
            relatedEvent: event._id,
            priority: 'high'
        }));

        try {
            await Notification.insertMany(notifications);
            console.log(`Event updated notifications sent to ${registeredStudentIds.length} students`);
        } catch (error) {
            console.error('Error sending event updated notifications:', error);
            throw error;
        }
    }

    // Event cancelled notification
    static async notifyEventCancelled(event, registeredStudentIds) {
        const notifications = registeredStudentIds.map(studentId => ({
            recipient: studentId,
            sender: event.adminId,
            type: 'event_cancelled',
            title: 'Event Cancelled ⚠️',
            message: `"${event.title}" has been cancelled`,
            relatedEvent: event._id,
            priority: 'high'
        }));

        try {
            await Notification.insertMany(notifications);
            console.log(`Event cancelled notifications sent to ${registeredStudentIds.length} students`);
        } catch (error) {
            console.error('Error sending event cancelled notifications:', error);
            throw error;
        }
    }

    // System announcement (broadcast to all users)
    static async notifySystemAnnouncement(title, message, userIds, priority = 'medium') {
        const notifications = userIds.map(userId => ({
            recipient: userId,
            type: 'system_announcement',
            title,
            message,
            priority
        }));

        try {
            await Notification.insertMany(notifications);
            console.log(`System announcement sent to ${userIds.length} users`);
        } catch (error) {
            console.error('Error sending system announcement:', error);
            throw error;
        }
    }
}

module.exports = NotificationService;