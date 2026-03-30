package angelitapp.brote;

import android.os.Bundle;
import androidx.core.splashscreen.SplashScreen;
import androidx.core.view.WindowCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.installSplashScreen(this);
    super.onCreate(savedInstanceState);

    // Force the app to NOT be edge-to-edge (restores the status bar container)
    // This is necessary because Android 15+ forces edge-to-edge by default.
    WindowCompat.setDecorFitsSystemWindows(getWindow(), true);
  }
}
