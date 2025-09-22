package com.example.epet.ui.splash.view

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.example.epet.R
import android.widget.ImageView
import android.widget.TextView
import android.view.animation.AnimationUtils

class SplashActivity : AppCompatActivity() {

    private lateinit var tv_tettletext: TextView
    private lateinit var iv_icon_cat: ImageView
    private lateinit var iv_icon_trident: ImageView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_splash)

        val fadeIn = AnimationUtils.loadAnimation(this, R.anim.fade_in)
        tv_tettletext =  findViewById(R.id.tv_tettletext)
        iv_icon_cat =  findViewById(R.id.iv_icon_cat)
        iv_icon_trident =  findViewById(R.id.iv_icon_trident)

        tv_tettletext.startAnimation(fadeIn)
        iv_icon_cat.startAnimation(fadeIn)
        iv_icon_trident.startAnimation(fadeIn)
    }
}