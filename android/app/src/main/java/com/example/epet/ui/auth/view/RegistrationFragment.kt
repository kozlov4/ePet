package com.example.epet.ui.auth.view

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.TextView
import androidx.appcompat.widget.AppCompatButton
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.lifecycleScope
import androidx.lifecycle.repeatOnLifecycle
import androidx.navigation.fragment.findNavController
import com.example.epet.R
import com.example.epet.data.model.auth.InputRegistration
import com.example.epet.data.model.auth.OutputAuth
import com.example.epet.ui.auth.viewmodel.AuthViewModel
import com.example.epet.ui.main.view.MainActivity
import kotlinx.coroutines.launch

class RegistrationFragment : Fragment() {

    private val authViewModel: AuthViewModel by activityViewModels()

    private lateinit var tv_tittletext: TextView
    private lateinit var tv_message: TextView
    private lateinit var tv_to_login: TextView

    private lateinit var ll_fullname: LinearLayout
    private lateinit var ll_passport: LinearLayout
    private lateinit var ll_contact: LinearLayout
    private lateinit var ll_password: LinearLayout

    private lateinit var et_last_name: EditText
    private lateinit var et_first_name: EditText
    private lateinit var et_patronymic: EditText
    private lateinit var et_passport_number: EditText
    private lateinit var et_address: EditText
    private lateinit var et_postal_index: EditText
    private lateinit var et_email_address: EditText
    private lateinit var et_password: EditText

    private lateinit var bth_registration: AppCompatButton

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_registration, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        initViews(view)
        initButtons()
        initStateFlow()
    }

    /** Ініціалізація всіх елементів інтерфейсу **/
    private fun initViews(view: View) {
        tv_tittletext = view.findViewById(R.id.tv_tittletext)
        tv_message = view.findViewById(R.id.tv_message)
        tv_to_login = view.findViewById(R.id.tv_to_login)

        ll_fullname = view.findViewById(R.id.ll_fullname)
        ll_passport = view.findViewById(R.id.ll_passport)
        ll_contact = view.findViewById(R.id.ll_contact)
        ll_password = view.findViewById(R.id.ll_password)

        et_last_name = view.findViewById(R.id.et_last_name)
        et_first_name = view.findViewById(R.id.et_first_name)
        et_patronymic = view.findViewById(R.id.et_patronymic)
        et_passport_number = view.findViewById(R.id.et_passport_number)
        et_address = view.findViewById(R.id.et_address)
        et_postal_index = view.findViewById(R.id.et_postal_index)
        et_email_address = view.findViewById(R.id.et_email_address)
        et_password = view.findViewById(R.id.et_password)

        bth_registration = view.findViewById(R.id.bth_registration)
    }

    /** Ініціалізація всіх кнопок інтерфейсу **/
    private fun initButtons() {
        tv_to_login.setOnClickListener {
            findNavController().navigate(R.id.action_registration_to_login)
        }

        bth_registration.setOnClickListener {
            val last_name = et_last_name.text.toString().trimEnd()
            val first_name = et_first_name.text.toString().trimEnd()
            val patronymic = et_patronymic.text.toString().trimEnd()
            val passport_number = et_passport_number.text.toString().trimEnd()
            val address = et_address.text.toString().trimEnd()
            val postal_index = et_postal_index.text.toString().trimEnd()
            val email = et_email_address.text.toString().trimEnd()
            val password = et_password.text.toString().trimEnd()

            authViewModel.registration(
                InputRegistration(last_name, first_name, patronymic, passport_number, "", "", "", postal_index, email, password), address)
        }
    }

    /** Ініціалізація StateFlow **/
    private fun initStateFlow() {
        viewLifecycleOwner.lifecycleScope.launch {
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
                authViewModel.outputRegisatration.collect { state ->
                    when (state) {
                        is OutputAuth.Success -> {
                            tv_message.text = ""
                            saveUserInfo(requireContext(), state.access_token, state.user_name)
                            navigateToMainActivity()
                        }

                        is OutputAuth.Error -> {
                            tv_message.text = state.detail
                        }
                    }
                }
            }
        }
    }

    /** Збереження даних користувача **/
    private fun saveUserInfo(context: Context, access_token: String, user_name: String) {
        val sharedPref = context.getSharedPreferences("UserPrefs", Context.MODE_PRIVATE)
        with(sharedPref.edit()) {
            putString("access_token", access_token)
            putString("user_name", user_name)
            putString("user_password", et_password.text.toString())
            apply()
        }
    }

    /** Перехід на наступну активність **/
    private fun navigateToMainActivity() {
        val intent = Intent(requireContext(), MainActivity::class.java)
        startActivity(intent)
        requireActivity().overridePendingTransition(R.anim.slide_in_bottom, 0)
        requireActivity().finish()
    }
}