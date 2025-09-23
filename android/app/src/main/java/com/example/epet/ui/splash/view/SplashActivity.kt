package com.example.epet.ui.splash.view

import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.animation.AnimationUtils
import android.widget.ImageView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.example.epet.R
import android.text.SpannableString
import android.text.Spanned
import android.text.style.ForegroundColorSpan
import android.graphics.Color

class SplashActivity : AppCompatActivity() {

    private val ANIM_DURATION: Long = 400
    private val GREETINGS_WORDS = listOf(
        "Привіт \uD83D\uDC3E",
        "Привіт \uD83D\uDC36",
        "Привіт \uD83D\uDE3A",
        "Привіт \uD83D\uDC39",
    )

    private lateinit var tv_tettletext: TextView
    private lateinit var iv_icon_cat: ImageView
    private lateinit var iv_icon_trident: ImageView

    private val handler = Handler(Looper.getMainLooper())
    private val fadeIn by lazy { AnimationUtils.loadAnimation(this, R.anim.fade_in) }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_splash)

        initViews()

        animateText(GREETINGS_WORDS.random(), 150)
        showImage(iv_icon_cat)
        showImage(iv_icon_trident)
    }

    private fun initViews() {
        tv_tettletext = findViewById(R.id.tv_tettletext)
        iv_icon_cat = findViewById(R.id.iv_icon_cat)
        iv_icon_trident = findViewById(R.id.iv_icon_trident)
    }

    /** Ефект друкарської машинки **/
    private fun animateText(text: String, delay: Long) {
        val spannable = SpannableString(text)
        tv_tettletext.text = spannable

        val symbols = text.codePoints().toArray()
        var currentDelay = 0L

        for (i in symbols.indices) {
            val charStart = text.offsetByCodePoints(0, i)
            val charEnd = text.offsetByCodePoints(0, i + 1)
            spannable.setSpan(
                ForegroundColorSpan(Color.TRANSPARENT),
                charStart, charEnd,
                Spanned.SPAN_EXCLUSIVE_EXCLUSIVE
            )
        }
        tv_tettletext.text = spannable

        for (i in symbols.indices) {
            val charStart = text.offsetByCodePoints(0, i)
            val charEnd = text.offsetByCodePoints(0, i + 1)
            val charStr = String(Character.toChars(symbols[i]))

            if (charStr.trim().isEmpty()) {
                spannable.setSpan(
                    ForegroundColorSpan(tv_tettletext.currentTextColor),
                    charStart, charEnd,
                    Spanned.SPAN_EXCLUSIVE_EXCLUSIVE
                )
                continue
            }

            handler.postDelayed({
                val animator = android.animation.ValueAnimator.ofInt(0, 255)
                animator.duration = ANIM_DURATION
                animator.addUpdateListener { valueAnimator ->
                    val alpha = valueAnimator.animatedValue as Int
                    val color = (alpha shl 24) or (tv_tettletext.currentTextColor and 0x00FFFFFF)
                    spannable.setSpan(
                        ForegroundColorSpan(color),
                        charStart, charEnd,
                        Spanned.SPAN_EXCLUSIVE_EXCLUSIVE
                    )
                    tv_tettletext.text = spannable
                }
                animator.start()
            }, currentDelay)

            currentDelay += delay
        }
    }

    /** Поява іконок **/
    private fun showImage(image: ImageView) {
        image.startAnimation(fadeIn)
        image.alpha = 1f
    }
}
