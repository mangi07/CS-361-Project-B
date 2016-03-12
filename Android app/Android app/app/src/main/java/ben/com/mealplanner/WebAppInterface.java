package ben.com.mealplanner;

import android.content.Context;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;

/**
 * Created by ben on 3/11/2016.
 */
public class WebAppInterface {
    Context mContext;

    /**
     * Instantiate the interface and set the context
     */
    WebAppInterface(Context c) {
        mContext = c;
    }

    private static final String FILE_NAME = "userObject";
    /**
     * Alert user of errors
     */
    @JavascriptInterface
    public void showToast(String toast) {
        Toast.makeText(mContext, toast, Toast.LENGTH_LONG).show();
    }

    /**
     * Saves JSON string of user tdee and recipe information
     * to Android internal storage
     */
    @JavascriptInterface
    public void saveData(String userObject) {
        //String filename = "userObject";
        FileOutputStream outputStream;


        try {
            //if (hasData() == "true")
            //    mContext.deleteFile(FILE_NAME);
            outputStream = mContext.openFileOutput(FILE_NAME, Context.MODE_PRIVATE);
            outputStream.write(userObject.getBytes());
            outputStream.close();
            Log.i("MainActivity", "WebAppInterface.saveData(): ");
            Log.i("MainActivity", userObject);
        } catch (Exception e) {
            Log.e("MainActivity", "WebAppInterface.saveData():" + e.toString());
        }
    }

    /**
     * Returns "true" or "false" depending on whether the user has saved data on internal storage
     */
    @JavascriptInterface
    public String hasData() {
        //String filename = "userObject";

        /* Borrowed from user nishanth
        on http://stackoverflow.com/questions/10576930/trying-to-check-if-a-file-exists-in-internal-storage */
        String path = mContext.getFilesDir().getAbsolutePath() + "/" + FILE_NAME;
        File file = new File(path);
        String exists = (file.exists())?"true":"false";
        Log.i("MainActivity", "WebAppInterface.hasData(): " + exists);
        return exists;
    }

    /**
     * Returns JSON string of user tdee and recipe information
     * from Android internal storage
     */
    @JavascriptInterface
    public String loadData() {
        //String filename = "userObject";
        FileInputStream fin;
        StringBuilder userObject = new StringBuilder();

        try {
            fin = mContext.openFileInput(FILE_NAME);
            int c;
            while( (c = fin.read()) != -1){
                userObject.append(Character.toString((char) c));
            }
            fin.close();

            Log.i("MainActivity", "WebAppInterface.loadData(): ");
            Log.i("MainActivity", userObject.toString());

            return userObject.toString();
        } catch (Exception e) {
            Log.e("MainActivity", "WebAppInterface.loadData():" + e.toString());
        }

        throw new IllegalStateException(
                "WebAppInterface.loadData() should have never reached this line.");
    }
}
