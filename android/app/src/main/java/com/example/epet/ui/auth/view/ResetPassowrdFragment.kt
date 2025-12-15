package com.example.epet.ui.auth.view

import android.content.Intent
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
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.lifecycleScope
import androidx.lifecycle.repeatOnLifecycle
import androidx.navigation.fragment.findNavController
import com.example.epet.ui.auth.viewmodel.AuthViewModel
import androidx.navigation.fragment.navArgs
import com.example.epet.data.model.auth.InputResetPassword
import kotlinx.coroutines.launch

class ResetPassowrdFragment : Fragment() {

    private val args: ResetPassowrdFragmentArgs by navArgs()
    private val authViewModel: AuthViewModel by activityViewModels()

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
        initEmail()
        initStateFlow()
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
            val email = et_email_address.text.toString()
            val action = ResetPassowrdFragmentDirections.actionResetPasswordToLogin(email)
            findNavController().navigate(action)
        }

        bth_reset_password.setOnClickListener {
            val email = et_email_address.text.toString().trimEnd()
            authViewModel.resetPassword(InputResetPassword(email))
        }
    }

    /** Ініціалізація пошти **/
    private fun initEmail() {
        et_email_address.setText(args.email)
    }

    /** Ініціалізація StateFlow **/
    private fun initStateFlow() {
        viewLifecycleOwner.lifecycleScope.launch {
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
                authViewModel.outputEmail.collect { state ->
                    if (state.msg == "Якщо електронна адреса існує, посилання для скидання паролю було надіслано на пошту.") {
                        tv_message.text = ""
                        navigateToMainActivity()

                    } else {
                        tv_message.text = state.msg
                    }
                }
            }
        }
    }

    /** Перехід на наступну активність **/
    private fun navigateToMainActivity() {
        val action = ResetPassowrdFragmentDirections.actionResetPasswordToMessage(
            tittletext = "Відновлення паролю",
            emoji = "✅",
            main = "Успішно!",
            description = "Посилання для скидання паролю було надіслано на пошту",
            email = et_email_address.text.toString()
        )
        findNavController().navigate(action)
    }
}