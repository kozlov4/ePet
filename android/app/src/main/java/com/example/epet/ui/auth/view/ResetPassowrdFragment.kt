package com.example.epet.ui.auth.view

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.EditText
import android.widget.ImageView
import androidx.fragment.app.Fragment
import com.example.epet.R
import android.widget.TextView
import androidx.appcompat.widget.AppCompatButton
import androidx.navigation.fragment.findNavController
import com.example.epet.ui.main.view.ServicesExtractPetFragmentDirections

class ResetPassowrdFragment : Fragment() {

    private lateinit var iv_to_back: ImageView
    private lateinit var et_email_address: EditText
    private lateinit var tv_message: TextView
    private lateinit var bth_reset_password: AppCompatButton

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_reset_password, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        initViews(view)
        initButtons()
    }

    /** Ініціалізація всіх елементів інтерфейсу **/
    private fun initViews(view: View) {
        iv_to_back = view.findViewById(R.id.iv_to_back)
        et_email_address = view.findViewById(R.id.et_email_address)
        tv_message = view.findViewById(R.id.tv_message)
        bth_reset_password = view.findViewById(R.id.bth_reset_password)
    }

    /** Ініціалізація всіх кнопок інтерфейсу **/
    private fun initButtons() {
        iv_to_back.setOnClickListener {
            findNavController().popBackStack()
        }

        bth_reset_password.setOnClickListener {
            val action = ResetPassowrdFragmentDirections.actionResetPasswordToMessage(
                tittletext = "Відновлення паролю",
                emoji = "✅",
                main = "Пароль скинуто!",
                description = "Тимчасовий пароль буде надіслано вам найближчим часом на email"
            )

            findNavController().navigate(action)
        }
    }
}