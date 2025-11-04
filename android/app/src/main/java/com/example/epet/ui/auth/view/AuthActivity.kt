package com.example.epet.ui.auth.view

import android.os.Bundle
import android.widget.Toast
import androidx.activity.addCallback
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.fragment.NavHostFragment
import com.example.epet.R
import com.example.epet.ui.main.view.AdFragment
import com.example.epet.ui.main.view.MenuFragment
import com.example.epet.ui.main.view.ServiceListFragment

class AuthActivity : AppCompatActivity() {

    private var lastBackPressedTime = 0L
    private val backPressThreshold = 2000L

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_auth)

        setupBackPressed()
    }

    /** Перевизначення поведінки кнопки назад **/
    private fun setupBackPressed() {
        val navHostFragment = supportFragmentManager.findFragmentById(R.id.fragment_conainer_auth) as NavHostFragment

        onBackPressedDispatcher.addCallback(this) {
            val currentFragment = navHostFragment.childFragmentManager.primaryNavigationFragment

            val fragmentsWithCustomBack = listOf(
                LoginFragment::class.java,
                RegistrationFragment::class.java,
            )

            if (currentFragment != null && fragmentsWithCustomBack.any { it.isInstance(currentFragment) }) {
                val currentTime = System.currentTimeMillis()
                if (currentTime - lastBackPressedTime < backPressThreshold) {
                    finish()
                } else {
                    lastBackPressedTime = currentTime
                    Toast.makeText(this@AuthActivity, "Для виходу, натисніть ще раз", Toast.LENGTH_SHORT).show()
                }
            } else {
                isEnabled = false
                onBackPressedDispatcher.onBackPressed()
                isEnabled = true
            }
        }
    }
}