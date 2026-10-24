package com.zentrixs.app;

import android.app.AlarmManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.media.AudioAttributes;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.util.Log;

public class TicketSyncScheduler {
    public static final String CHANNEL_ID = "zentrixs_tickets";
    public static final String ACTION_CHECK = "com.zentrixs.app.CHECK_TICKETS";
    private static final String TAG = "TicketSyncScheduler";
    private static final long INTERVAL_MILLIS = 30 * 1000; // Check every 30 seconds

    public static void createNotificationChannel(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            if (nm != null) {
                NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    "Zentrixs Tickets & Alerts",
                    NotificationManager.IMPORTANCE_HIGH
                );
                channel.setDescription("Instant ticket updates and task delegation notifications");
                channel.enableLights(true);
                channel.setLightColor(Color.parseColor("#EA552E"));
                channel.enableVibration(true);
                channel.setVibrationPattern(new long[]{0, 300, 150, 300});
                channel.setLockscreenVisibility(android.app.Notification.VISIBILITY_PUBLIC);

                Uri soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
                AudioAttributes audioAttributes = new AudioAttributes.Builder()
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                    .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                    .build();
                channel.setSound(soundUri, audioAttributes);

                nm.createNotificationChannel(channel);
            }
        }
    }

    public static void start(Context context) {
        createNotificationChannel(context);
        scheduleNext(context, 2000); // Trigger quick first check in 2s
    }

    public static void scheduleNext(Context context) {
        scheduleNext(context, INTERVAL_MILLIS);
    }

    public static void scheduleNext(Context context, long delayMillis) {
        try {
            AlarmManager am = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
            if (am == null) return;

            Intent intent = new Intent(context, TicketSyncReceiver.class);
            intent.setAction(ACTION_CHECK);

            PendingIntent pi = PendingIntent.getBroadcast(
                context,
                1001,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );

            long triggerAt = System.currentTimeMillis() + delayMillis;

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAt, pi);
            } else {
                am.setExact(AlarmManager.RTC_WAKEUP, triggerAt, pi);
            }
            Log.d(TAG, "Scheduled next ticket check in " + (delayMillis / 1000) + "s");
        } catch (SecurityException se) {
            Log.w(TAG, "Exact alarm permission not granted, using standard alarm", se);
            try {
                AlarmManager am = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
                if (am != null) {
                    Intent intent = new Intent(context, TicketSyncReceiver.class);
                    intent.setAction(ACTION_CHECK);
                    PendingIntent pi = PendingIntent.getBroadcast(
                        context,
                        1001,
                        intent,
                        PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
                    );
                    am.set(AlarmManager.RTC_WAKEUP, System.currentTimeMillis() + delayMillis, pi);
                }
            } catch (Exception e) {
                Log.e(TAG, "Failed fallback alarm scheduling", e);
            }
        } catch (Exception e) {
            Log.e(TAG, "Error scheduling ticket check", e);
        }
    }
}
