package com.example.epet.ui.main.view

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.example.epet.R
import androidx.core.view.WindowInsetsControllerCompat
import android.view.View
import android.widget.LinearLayout
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.navigation.fragment.NavHostFragment
import androidx.navigation.NavOptions
import androidx.navigation.NavController

class MainActivity : AppCompatActivity() {

    private lateinit var ll_to_feed: LinearLayout
    private lateinit var ll_to_documents: LinearLayout
    private lateinit var ll_to_services: LinearLayout
    private lateinit var ll_to_menu: LinearLayout

    private lateinit var v_fake_bar: View

    private lateinit var navController: NavController
    private lateinit var navOptions: NavOptions

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        initViews()
        initNavigation()
        initNavigationBar()
        initButtons()
    }

    /** Ініціалізація всіх елементів інтерфейсу **/
    private fun initViews() {
        ll_to_feed = findViewById(R.id.ll_to_feed)
        ll_to_documents = findViewById(R.id.ll_to_documents)
        ll_to_services = findViewById(R.id.ll_to_services)
        ll_to_menu = findViewById(R.id.ll_to_menu)

        v_fake_bar = findViewById(R.id.v_fake_bar)
    }

    /** Ініціалізація всіх кнопок інтерфейсу **/
    private fun initButtons() {
        ll_to_feed.setOnClickListener {
            if (navController.currentDestination?.id != R.id.fragment_feed) {
                navController.navigate(R.id.fragment_feed, null, navOptions)
            }
        }

        ll_to_documents.setOnClickListener {
            if (navController.currentDestination?.id != R.id.fragment_documents) {
                navController.navigate(R.id.fragment_documents, null, navOptions)
            }
        }

        ll_to_services.setOnClickListener {
            if (navController.currentDestination?.id != R.id.fragment_services) {
                navController.navigate(R.id.fragment_services, null, navOptions)
            }
        }
    }

    /** Ініціалізація навігаційного інтерфейсу **/
    private fun initNavigationBar() {
        WindowInsetsControllerCompat(window, window.decorView).isAppearanceLightNavigationBars = false

        ViewCompat.setOnApplyWindowInsetsListener(v_fake_bar) { view, insets ->
            val navHeight = insets.getInsets(WindowInsetsCompat.Type.navigationBars()).bottom
            view.layoutParams.height = navHeight
            view.requestLayout()
            insets
        }
    }

    /** Ініціалізація NavController та NavOptions **/
    private fun initNavigation() {
        val navHostFragment = supportFragmentManager.findFragmentById(R.id.fragment_container_main) as NavHostFragment
        navController = navHostFragment.navController

        navOptions = NavOptions.Builder()
            .setEnterAnim(R.anim.fade_in_fragment)
            .setExitAnim(R.anim.fade_out_fragment)
            .setPopEnterAnim(R.anim.fade_in_fragment)
            .setPopExitAnim(R.anim.fade_out_fragment)
            .build()
    }
}