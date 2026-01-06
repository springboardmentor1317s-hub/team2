# Automatic Notification Triggers - Testing Guide

## Overview
The notification system now automatically triggers notifications for key events in your application.

## Automatic Triggers Implemented

### 1. Student Registration Flow
**When:** Student registers for an event
**Trigger:** `POST /api/registrations`
**Notifications:**
- ✅ Admin gets notified about new registration

**When:** Admin approves/rejects registration
**Trigger:** `PUT /api/registrations/:id/status`
**Notifications:**
- ✅ Student gets notified about approval/rejection

### 2. Event Management Flow
**When:** Admin creates new event
**Trigger:** `POST /api/events`
**Notifications:**
- ✅ All students get notified about new event

**When:** Admin updates event
**Trigger:** `PUT /api/events/:id`
**Notifications:**
- ✅ Registered students get notified about updates

**When:** Admin cancels event
**Trigger:** `PUT /api/events/:id/cancel`
**Notifications:**
- ✅ Registered students get notified about cancellation

### 3. System Announcements
**When:** Admin sends system announcement
**Trigger:** `POST /api/notifications/system-announcement`
**Notifications:**
- ✅ All users (or filtered by role) get the announcement

## Testing the Triggers

### Test 1: Registration Flow
```bash
# 1. Student registers for event
POST /api/registrations
{
  "eventId": "event_id_here"
}
# → Admin should receive "new_registration" notification

# 2. Admin approves registration
PUT /api/registrations/registration_id/status
{
  "status": "approved"
}
# → Student should receive "registration_approved" notification
```

### Test 2: Event Management
```bash
# 1. Admin creates event
POST /api/events
{
  "title": "Test Event",
  "collegeName": "Test College",
  // ... other fields
}
# → All students should receive "event_created" notification

# 2. Admin updates event
PUT /api/events/event_id
{
  "title": "Updated Test Event"
}
# → Registered students should receive "event_updated" notification

# 3. Admin cancels event
PUT /api/events/event_id/cancel
# → Registered students should receive "event_cancelled" notification
```

### Test 3: System Announcement
```bash
# Admin sends announcement to all students
POST /api/notifications/system-announcement
{
  "title": "Important Update",
  "message": "System maintenance scheduled for tonight",
  "priority": "high",
  "targetRole": "student"
}
# → All students should receive "system_announcement" notification
```

## Checking Notifications
After triggering any of the above actions, check notifications:

```bash
# Get user's notifications
GET /api/notifications

# Get unread count
GET /api/notifications/unread-count
```

## Error Handling
- If notification creation fails, the main operation (registration, event creation, etc.) still succeeds
- Errors are logged to console for debugging
- Notifications are created asynchronously to avoid blocking main operations

## Performance Notes
- Bulk notifications use `insertMany()` for better performance
- Database indexes on recipient and createdAt fields optimize queries
- Consider implementing background job queues for large-scale notifications in production