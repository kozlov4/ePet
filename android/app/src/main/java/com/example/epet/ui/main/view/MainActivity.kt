package com.example.epet.ui.main.view

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.example.epet.R
import androidx.core.view.WindowInsetsControllerCompat
import android.view.View
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
// Белые кнопки навбара
        WindowInsetsControllerCompat(window, window.decorView).isAppearanceLightNavigationBars = false

        // Высота фейкового блока под навбар
        val fakeNavBar = findViewById<View>(R.id.v_fake_bar)
        ViewCompat.setOnApplyWindowInsetsListener(fakeNavBar) { view, insets ->
            val navHeight = insets.getInsets(WindowInsetsCompat.Type.navigationBars()).bottom
            view.layoutParams.height = navHeight
            view.requestLayout()
            insets
        }
    }
}