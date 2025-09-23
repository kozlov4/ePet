package com.example.epet.ui.auth.view

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.example.epet.R
import android.widget.TextView
import androidx.appcompat.widget.AppCompatButton
import androidx.navigation.fragment.findNavController

class LoginFragment : Fragment() {

    private lateinit var tv_tittletext: TextView

    private lateinit var bth_login: AppCompatButton
    private lateinit var bth_to_registration: AppCompatButton

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_login, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        initViews(view)
        initButtons()
    }

    /** Ініціалізація всіх елементів інтерфейсу **/
    private fun initViews(view: View) {
        tv_tittletext = view.findViewById(R.id.tv_tittletext)

        bth_login = view.findViewById(R.id.bth_login)
        bth_to_registration = view.findViewById(R.id.bth_to_registration)
    }

    /** Ініціалізація всіх кнопок інтерфейсу **/
    private fun initButtons() {
        bth_to_registration.setOnClickListener {
            findNavController().navigate(R.id.login_to_registration)
        }
    }
}