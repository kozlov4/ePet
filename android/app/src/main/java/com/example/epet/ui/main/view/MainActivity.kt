package com.example.epet.ui.main.view

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.example.epet.R
import androidx.core.view.WindowInsetsControllerCompat
import android.view.View
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.Toast
import androidx.activity.addCallback
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.navigation.fragment.NavHostFragment
import androidx.navigation.NavOptions
import androidx.navigation.NavController
import com.example.epet.ui.main.viewmodel.PassportViewModel
import androidx.activity.viewModels
import androidx.constraintlayout.widget.ConstraintLayout
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.lifecycleScope
import androidx.lifecycle.repeatOnLifecycle
import com.example.epet.ui.main.viewmodel.LoadingViewModel
import com.example.epet.ui.notification.viewmodel.NotificationsViewModel
import com.example.epet.ui.service.viewmodel.ServiceViewModel
import com.example.epet.ui.settings.viewmodel.SettingsViewModel
import kotlinx.coroutines.launch

class MainActivity : AppCompatActivity() {

    private val loadingViewModel: LoadingViewModel by viewModels()
    private val passportViewModel: PassportViewModel by viewModels()
    private val serviceViewModel: ServiceViewModel by viewModels()
    private val settingsViewModel: SettingsViewModel by viewModels()
    private val notificationsViewModel: NotificationsViewModel by viewModels()

    private var lastBackPressedTime = 0L
    private val backPressThreshold = 2000L

    private lateinit var ll_to_feed: LinearLayout
    private lateinit var ll_to_documents: LinearLayout
    private lateinit var ll_to_services: LinearLayout
    private lateinit var ll_to_menu: LinearLayout
    private lateinit var cc_loading: ConstraintLayout

    private lateinit var iv_icon_feed: ImageView
    private lateinit var iv_icon_documents: ImageView
    private lateinit var iv_icon_services: ImageView
    private lateinit var iv_icon_menu: ImageView

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
        setupBackPressed()

        loadUserData()
        initStateFlow()
    }

    /** Ініціалізація всіх елементів інтерфейсу **/
    private fun initViews() {
        ll_to_feed = findViewById(R.id.ll_to_feed)
        ll_to_documents = findViewById(R.id.ll_to_documents)
        ll_to_services = findViewById(R.id.ll_to_services)
        ll_to_menu = findViewById(R.id.ll_to_menu)
        cc_loading = findViewById(R.id.cc_loading)

        iv_icon_feed = findViewById(R.id.iv_icon_feed)
        iv_icon_documents = findViewById(R.id.iv_icon_documents)
        iv_icon_services = findViewById(R.id.iv_icon_services)
        iv_icon_menu = findViewById(R.id.iv_icon_menu)

        v_fake_bar = findViewById(R.id.v_fake_bar)
    }

    /** Завантаження даних користувача **/
    fun loadUserData() {
        val sharedPref = getSharedPreferences("UserPrefs", MODE_PRIVATE)
        val token = sharedPref.getString("access_token", null)

        passportViewModel.passportList(token)
        serviceViewModel.getPetsShelter(token)
        settingsViewModel.userDetail(token)
        notificationsViewModel.getNotifications(token)
    }

    /** Ініціалізація StateFlow **/
    private fun initStateFlow() {
        lifecycleScope.launch {
            repeatOnLifecycle(Lifecycle.State.STARTED) {
                loadingViewModel.loading.collect { state ->
                    if (state == true) {
                        cc_loading.visibility = View.VISIBLE
                    } else {
                        cc_loading.visibility = View.GONE
                    }
                }
            }
        }
    }

    /** Ініціалізація всіх кнопок інтерфейсу **/
    private fun initButtons() {
        val buttons = listOf(ll_to_feed, ll_to_documents, ll_to_services, ll_to_menu)
        val icons = listOf(iv_icon_feed, iv_icon_documents, iv_icon_services, iv_icon_menu)

        val selectedImages = listOf(R.drawable.icon_selected_feed, R.drawable.icon_selected_documents, R.drawable.icon_selected_services, R.drawable.icon_selected_menu)
        val defaultImages = listOf(R.drawable.icon_default_feed, R.drawable.icon_default_documents, R.drawable.icon_default_services, R.drawable.icon_default_menu)

        buttons.forEachIndexed { index, button ->
            button.setOnClickListener {
                updateIcons(icons, defaultImages, selectedImages, index)
                navigateToFragment(index)
            }
        }
    }

    /** Фуекція для зміни іконок */
    private fun updateIcons(
        icons: List<ImageView>,
        defaultImages: List<Int>,
        selectedImages: List<Int>,
        selectedIndex: Int) {
        icons.forEachIndexed { i, icon ->
            icon.setImageResource(if (i == selectedIndex) selectedImages[i] else defaultImages[i])
        }
    }

    /** Фуекція для навігації **/
    private fun navigateToFragment(index: Int) {
        val destinationId = when(index) {
            0 -> R.id.fragment_ad
            1 -> R.id.fragment_passport_list
            2 -> R.id.fragment_service_list
            3 -> R.id.fragment_menu
            else -> null
        }
        if (destinationId != null && navController.currentDestination?.id != destinationId) {
            navController.navigate(destinationId, null, navOptions)
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

    /** Перевизначення поведінки кнопки назад **/
    private fun setupBackPressed() {
        val navHostFragment = supportFragmentManager.findFragmentById(R.id.fragment_container_main) as NavHostFragment

        onBackPressedDispatcher.addCallback(this) {
            val currentFragment = navHostFragment.childFragmentManager.primaryNavigationFragment

            val fragmentsWithCustomBack = listOf(
                AdFragment::class.java,
                PassportListFragment::class.java,
                ServiceListFragment::class.java,
                MenuFragment::class.java
            )

            if (currentFragment != null && fragmentsWithCustomBack.any { it.isInstance(currentFragment) }) {
                val currentTime = System.currentTimeMillis()
                if (currentTime - lastBackPressedTime < backPressThreshold) {
                    finish()
                } else {
                    lastBackPressedTime = currentTime
                    Toast.makeText(this@MainActivity, "Для виходу, натисніть ще раз", Toast.LENGTH_SHORT).show()
                }
            } else {
                isEnabled = false
                onBackPressedDispatcher.onBackPressed()
                isEnabled = true
            }
        }
    }
}