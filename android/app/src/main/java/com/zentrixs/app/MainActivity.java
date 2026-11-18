package com.zentrixs.app;

import android.Manifest;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowInsetsController;
import android.view.WindowManager;
import android.widget.Toast;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private long lastBackPressTime = 0;
    private Toast exitToast;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Ensure status bar is always visible and never hidden
        setupWindowDecor();

        // Request POST_NOTIFICATIONS on Android 13+ if not already granted
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.POST_NOTIFICATIONS}, 101);
            }
        }

        // Start native background ticket monitoring service
        TicketSyncScheduler.start(this);
    }

    private void setupWindowDecor() {
        Window window = getWindow();
        if (window == null) return;

        // Clear any fullscreen / hidden status bar flags
        window.clearFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
        window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);

        // Make sure decor does not fit system windows exclusively so status bar is real and persistent
        WindowCompat.setDecorFitsSystemWindows(window, true);
    }

    @Override
    public void onResume() {
        super.onResume();
        setupWindowDecor();
    }

    /**
     * Handle physical/gesture back button:
     * If user presses back button 2 times within 2 seconds, exit the app.
     */
    @Override
    public void onBackPressed() {
        // Check if webview can go back in internal history
        if (getBridge() != null && getBridge().getWebView() != null && getBridge().getWebView().canGoBack()) {
            getBridge().getWebView().goBack();
            return;
        }

        long currentTime = System.currentTimeMillis();
        if (currentTime - lastBackPressTime < 2000) {
            if (exitToast != null) {
                exitToast.cancel();
            }
            super.onBackPressed();
            finishAffinity();
            System.exit(0);
        } else {
            lastBackPressTime = currentTime;
            if (exitToast != null) {
                exitToast.cancel();
            }
            exitToast = Toast.makeText(this, "Press back again to exit Zentrixs Portal", Toast.LENGTH_SHORT);
            exitToast.show();
        }
    }
}
