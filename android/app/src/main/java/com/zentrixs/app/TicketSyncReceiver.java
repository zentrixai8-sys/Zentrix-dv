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
    private static final String API_BASE = "https://zentrix-rain-71e2.zentrix-ai8.workers.dev";
    private static final String API_URL = API_BASE + "/api/tasks";
    // Constant-size change digest. Polled instead of the full ticket list so a
    // quiet check costs a few bytes of mobile data instead of the whole table.
    private static final String PULSE_URL = API_BASE + "/api/tasks/pulse";
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

    /** Simple JSON GET. Returns the response body, or null on any failure. */
    private String httpGet(String endpoint) {
        HttpURLConnection conn = null;
        BufferedReader reader = null;
        try {
            URL url = new URL(endpoint);
            conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setConnectTimeout(10000);
            conn.setReadTimeout(10000);
            conn.setRequestProperty("User-Agent", "Zentrixs-Android-App");
            conn.setRequestProperty("Accept", "application/json");

            int code = conn.getResponseCode();
            if (code != 200) {
                Log.w(TAG, "API " + endpoint + " returned non-200 code: " + code);
                return null;
            }

            reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
            return sb.toString();
        } catch (Exception e) {
            Log.e(TAG, "HTTP GET failed for " + endpoint, e);
            return null;
        } finally {
            if (reader != null) {
                try { reader.close(); } catch (Exception ignored) {}
            }
            if (conn != null) {
                conn.disconnect();
            }
        }
    }

    private void checkAndNotifyNewTickets(Context context) {
        try {
            SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
            boolean initialized = prefs.getBoolean("initialized", false);

            // Step 1: ask the cheap digest whether anything changed at all.
            // If it has not, we skip downloading the ticket list entirely.
            String signature = null;
            String pulseBody = httpGet(PULSE_URL);
            if (pulseBody != null) {
                try {
                    signature = new JSONObject(pulseBody).optString("signature", null);
                } catch (Exception ignored) {}
            }

            if (signature != null && initialized
                    && signature.equals(prefs.getString("pulse_signature", ""))) {
                Log.d(TAG, "No ticket changes (pulse unchanged), skipped full fetch");
                return;
            }

            // Step 2: something changed (or the digest is unavailable) - fetch the list.
            String body = httpGet(API_URL);
            if (body == null) return;

            JSONObject root = new JSONObject(body);
            JSONArray tasks = root.optJSONArray("tasks");
            if (tasks == null) return;

            Set<String> seenIds = new HashSet<>(prefs.getStringSet("seen_ids", new HashSet<>()));

            if (!initialized) {
                // First run: Seed current existing tasks so we don't spam old notifications.
                // Runs even when the list is empty, otherwise the very first ticket
                // ever created would be swallowed as a seed instead of notified.
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
                if (signature != null) editor.putString("pulse_signature", signature);
                editor.apply();
                Log.d(TAG, "Initialized ticket cache with " + seenIds.size() + " existing tickets");
                return;
            }

            SharedPreferences.Editor editor = prefs.edit();
            // A ticket is only recorded as seen once its notification actually
            // fired. Recording it up front meant that if the notification was
            // dropped (permission revoked, SecurityException) that ticket would
            // never alert again - it looked like notifications randomly skipped.
            boolean deliveryPending = false;

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
                    String title = "🔔 New Ticket #" + ticketNumber;
                    String text = partyName + ": " + typeOfWork + (systemName.isEmpty() ? "" : " - " + systemName);

                    if (showNotification(context, id.hashCode(), title, text)) {
                        seenIds.add(id);
                        editor.putString("status_" + id, status);
                        Log.i(TAG, "Fired background notification for new ticket: " + ticketNumber);
                    } else {
                        deliveryPending = true;
                        Log.w(TAG, "Notification not delivered, will retry next cycle: " + ticketNumber);
                    }
                } else {
                    // Check 2: Status update on existing ticket
                    String prevStatus = prefs.getString("status_" + id, "");
                    if (!prevStatus.isEmpty() && !prevStatus.equals(status)) {
                        String title = "⚡ Ticket #" + ticketNumber + " " + status;
                        String text = partyName + " status updated: " + prevStatus + " ➔ " + status;

                        if (showNotification(context, (id + status).hashCode(), title, text)) {
                            editor.putString("status_" + id, status);
                            Log.i(TAG, "Fired background notification for status update: " + ticketNumber);
                        } else {
                            deliveryPending = true;
                        }
                    }
                }
            }

            editor.putStringSet("seen_ids", seenIds);
            // Only remember this digest when everything was delivered, so a failed
            // notification is re-examined on the next cycle instead of skipped.
            if (signature != null && !deliveryPending) {
                editor.putString("pulse_signature", signature);
            }
            editor.apply();

        } catch (Exception e) {
            Log.e(TAG, "Error in checkAndNotifyNewTickets", e);
        }
    }

    /** @return true only when the notification was actually handed to the OS. */
    private boolean showNotification(Context context, int notifId, String title, String body) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(context, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                Log.w(TAG, "Notification permission not granted");
                return false;
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
            return true;
        } catch (SecurityException se) {
            Log.e(TAG, "SecurityException while showing notification", se);
            return false;
        } catch (Exception e) {
            Log.e(TAG, "Failed to show notification", e);
            return false;
        }
    }
}
