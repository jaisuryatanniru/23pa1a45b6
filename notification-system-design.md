# Notification System Design

## Stage 1 - Priority Notification Algorithm

I built a priority system that ranks notifications based on two things - what type they are and when they were sent.

### How Priority Works

For type importance, I gave Placement the highest weight because students care most about job opportunities. Result is next important and Event is least.

The weights I used are:
- Placement = 3 points
- Result = 2 points  
- Event = 1 point

For recency, I check how old each notification is. If a notification was sent more than 24 hours ago, it gets a lower score. The newer the notification, the higher the recency score.

The final priority score is the weight plus the recency score. Higher number means more important.

### Keeping Top N

I used a simple approach where all notifications are sorted by priority score and then I take the top N. This works well because the API doesn't return too many notifications at once. If there were thousands, I could use a heap structure but that's not needed here.

### Code

The main logic is in src/utils/priorityNotifications.js. I also added a class called PriorityNotificationManager that can maintain top N as new notifications come in.

### Screenshots

Below are some screenshots of the priority inbox working.

All notifications tab:
![All Notifications](capture_20260625151028575.bmp)

Priority Inbox showing top 10:
![Priority Inbox Top 10](capture_20260625151020098.bmp)

Priority Inbox with top 5:
![Priority Inbox Top 5](capture_20260625151042417.bmp)

Filtering by Result type:
![Filter by Result](capture_20260625151050905.bmp)

## Stage 2 - React Frontend

I built a React application that shows notifications from the API. The app has two tabs - one for all notifications and one for priority inbox.

### Features

The priorty inbox lets users choose how many notifications to show - 5, 10, 15 or 20. There is also a filter dropdown that can show only Placement, Result or Event notifications.

When users click on a notification, it gets marked as viewed. Viewed notifications have a slightly different background color and a "Viewed" label so users can track what they've already seen.

### Error Handling

If the API call fails, the app shows an error message and gives users a retry button. There is also a loading spinner while data is being fetched.

### Tech Stack

- React for the frontend
- Material UI for components
- Axios for API calls
- My custom logger for logging

### What I Learned

The most challenging part was getting the priority scoring right. I had to test different weight combinations to make sure the most important notifications showed up first. The recency calculation was also tricky because I had to make sure older notifications didn't completely disappear from the list.

