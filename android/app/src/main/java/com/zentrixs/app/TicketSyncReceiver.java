package com.zentrixs.app;

import android.Manifest;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.media.RingtoneManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Build;
import android.os.PowerManager;
import android.util.Log;

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.content.ContextCompat;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class TicketSyncReceiver extends BroadcastReceiver {
    private static final String TAG = "TicketSyncReceiver";
    private static final String API_URL = "https://zentrix-rain-71e2.zentrix-ai8.workers.dev/api/tasks";
    private static final String PREFS_NAME = "zentrixs_ticket_cache";
    private static final ExecutorService executor = Executors.newSingleThreadExecutor();

    @Override
    public void onReceive(Context context, Intent intent) {
        PowerManager pm = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
        PowerManager.WakeLock wakeLock = null;
        if (pm != null) {
            wakeLock = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "zentrixs:ticket_sync_lock");
            wakeLock.acquire(15000); // 15 seconds max
        }

        final PowerManager.WakeLock finalWakeLock = wakeLock;
        final Context appContext = context.getApplicationContext();

        executor.execute(() -> {
            try {
                if (isNetworkAvailable(appContext)) {
                    checkAndNotifyNewTickets(appContext);
                } else {
                    Log.d(TAG, "No internet connection, skipping ticket check");
                }
            } catch (Exception e) {
                Log.e(TAG, "Error checking tickets in background", e);
            } finally {
                TicketSyncScheduler.scheduleNext(appContext);
                if (finalWakeLock != null && finalWakeLock.isHeld()) {
                    finalWakeLock.release();
                }
            }
        });
    }

    private boolean isNetworkAvailable(Context context) {
        ConnectivityManager cm = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
        if (cm == null) return false;
        NetworkInfo activeNetwork = cm.getActiveNetworkInfo();
        return activeNetwork != null && activeNetwork.isConnected();
    }

    private void checkAndNotifyNewTickets(Context context) {
        HttpURLConnection conn = null;
        BufferedReader reader = null;
        try {
            URL url = new URL(API_URL);
            conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setConnectTimeout(10000);
            conn.setReadTimeout(10000);
            conn.setRequestProperty("User-Agent", "Zentrixs-Android-App");
            conn.setRequestProperty("Accept", "application/json");

            int code = conn.getResponseCode();
            if (code != 200) {
                Log.w(TAG, "API returned non-200 code: " + code);
                return;
            }

            reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }

            JSONObject root = new JSONObject(sb.toString());
            JSONArray tasks = root.optJSONArray("tasks");
            if (tasks == null || tasks.length() == 0) return;

            SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
            boolean initialized = prefs.getBoolean("initialized", false);
            Set<String> seenIds = new HashSet<>(prefs.getStringSet("seen_ids", new HashSet<>()));

            if (!initialized) {
                // First run: Seed current existing tasks so we don't spam old notifications
                SharedPreferences.Editor editor = prefs.edit();
                for (int i = 0; i < tasks.length(); i++) {
                    JSONObject t = tasks.getJSONObject(i);
                    String id = t.optString("id");
                    if (!id.isEmpty()) {
                        seenIds.add(id);
                        editor.putString("status_" + id, t.optString("status", ""));
                    }
                }
                editor.putStringSet("seen_ids", seenIds);
                editor.putBoolean("initialized", true);
                editor.apply();
                Log.d(TAG, "Initialized ticket cache with " + seenIds.size() + " existing tickets");
                return;
            }

            SharedPreferences.Editor editor = prefs.edit();
            for (int i = 0; i < tasks.length(); i++) {
                JSONObject t = tasks.getJSONObject(i);
                String id = t.optString("id");
                if (id.isEmpty()) continue;

                String ticketNumber = t.optString("ticketNumber", id);
                String partyName = t.optString("partyName", "Client");
                String typeOfWork = t.optString("typeOfWork", "New Task");
                String systemName = t.optString("systemName", "");
                String status = t.optString("status", "Pending");

                // Check 1: Brand new ticket
                if (!seenIds.contains(id)) {
                    seenIds.add(id);
                    editor.putString("status_" + id, status);

                    String title = "🔔 New Ticket #" + ticketNumber;
                    String body = partyName + ": " + typeOfWork + (systemName.isEmpty() ? "" : " - " + systemName);
                    showNotification(context, id.hashCode(), title, body);
                    Log.i(TAG, "Fired background notification for new ticket: " + ticketNumber);
                } else {
                    // Check 2: Status update on existing ticket
                    String prevStatus = prefs.getString("status_" + id, "");
                    if (!prevStatus.isEmpty() && !prevStatus.equals(status)) {
                        editor.putString("status_" + id, status);

                        String title = "⚡ Ticket #" + ticketNumber + " " + status;
                        String body = partyName + " status updated: " + prevStatus + " ➔ " + status;
                        showNotification(context, id.hashCode() + 1, title, body);
                        Log.i(TAG, "Fired background notification for status update: " + ticketNumber);
                    }
                }
            }

            editor.putStringSet("seen_ids", seenIds);
            editor.apply();

        } catch (Exception e) {
            Log.e(TAG, "Error in checkAndNotifyNewTickets", e);
        } finally {
            if (reader != null) {
                try { reader.close(); } catch (Exception ignored) {}
            }
            if (conn != null) {
                conn.disconnect();
            }
        }
    }

    private void showNotification(Context context, int notifId, String title, String body) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(context, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                Log.w(TAG, "Notification permission not granted");
                return;
            }
        }

        TicketSyncScheduler.createNotificationChannel(context);

        Intent intent = new Intent(context, MainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent pendingIntent = PendingIntent.getActivity(
            context,
            notifId,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, TicketSyncScheduler.CHANNEL_ID)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentTitle(title)
            .setContentText(body)
            .setStyle(new NotificationCompat.BigTextStyle().bigText(body))
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setCategory(NotificationCompat.CATEGORY_MESSAGE)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .setSound(RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION))
            .setVibrate(new long[]{0, 300, 150, 300})
            .setContentIntent(pendingIntent)
            .setAutoCancel(true);

        try {
            NotificationManagerCompat.from(context).notify(notifId, builder.build());
        } catch (SecurityException se) {
            Log.e(TAG, "SecurityException while showing notification", se);
        }
    }
}
