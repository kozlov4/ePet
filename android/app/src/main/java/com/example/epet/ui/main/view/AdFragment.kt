package com.example.epet.ui.main.view

import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import com.example.epet.R

class AdFragment : Fragment() {

    private lateinit var tv_tittletext: TextView
    
    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_ad, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        initViews(view)
        setUserName(requireContext())
    }

    /** Ініціалізація всіх елементів інтерфейсу **/
    private fun initViews(view: View) {
        tv_tittletext = view.findViewById(R.id.tv_tittletext)
    }

    /** Відображення імені користувача **/
    fun setUserName(context: Context) {
        val sharedPref = context.getSharedPreferences("UserPrefs", Context.MODE_PRIVATE)
        val user_name = sharedPref.getString("user_name", "Null")

        tv_tittletext.text = "Привіт, $user_name \uD83D\uDC4B"
    }
}