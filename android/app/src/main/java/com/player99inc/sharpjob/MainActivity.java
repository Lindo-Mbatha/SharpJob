package com.player99inc.sharpjob;

import android.os.Bundle;
import androidx.activity.EdgeToEdge;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // The manifest launches this Activity with the splash theme (AppTheme.NoActionBarLaunch,
        // which sets android:background to the splash drawable). BridgeActivity.onCreate() swaps to
        // the real app theme (AppTheme.NoActionBar) before calling setContentView(), but
        // EdgeToEdge.enable() needs to run before setContentView() too — and its default system-bar
        // scrim is computed from whichever theme is active at the moment it's called, then never
        // re-evaluated. Calling it while the splash theme is still active locks in a stale scrim for
        // the lifetime of the Activity. Swap the theme ourselves first so EdgeToEdge.enable() reads
        // the real app theme instead.
        getApplication().setTheme(R.style.AppTheme_NoActionBar);
        setTheme(R.style.AppTheme_NoActionBar);
        EdgeToEdge.enable(this);
        super.onCreate(savedInstanceState);
    }
}
