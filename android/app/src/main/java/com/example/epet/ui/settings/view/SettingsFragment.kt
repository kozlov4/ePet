package com.example.epet.ui.settings.view

import android.content.Context
import android.os.Bundle
import android.view.View
import android.widget.EditText
import android.widget.ImageView
import android.widget.TextView
import androidx.appcompat.widget.AppCompatButton
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.lifecycleScope
import androidx.lifecycle.repeatOnLifecycle
import androidx.navigation.fragment.findNavController
import com.example.epet.R
import com.example.epet.data.model.settings.InputUpdateProfile
import com.example.epet.data.model.settings.OutputUpdateProfile
import com.example.epet.data.model.settings.OutputUserDetail
import com.example.epet.ui.settings.viewmodel.SettingsViewModel
import kotlinx.coroutines.launch
import com.example.epet.ui.main.viewmodel.LoadingViewModel

class SettingsFragment : Fragment(R.layout.fragment_settings) {

    private val settingsViewModel: SettingsViewModel by activityViewModels()
    private val loadingViewModel: LoadingViewModel by activityViewModels()

    private var outputUserDetail: OutputUserDetail = OutputUserDetail()

    private lateinit var iv_to_back: ImageView
    private lateinit var tv_tittletext: TextView
    private lateinit var tv_message: TextView
    private lateinit var tv_last_name: TextView
    private lateinit var tv_first_name: TextView
    private lateinit var tv_patronymic: TextView
    private lateinit var tv_passport_number: TextView
    private lateinit var tv_address: TextView
    private lateinit var tv_postal_code: TextView
    private lateinit var et_email_address: EditText
    private lateinit var et_password: EditText
    private lateinit var bth_edit: AppCompatButton

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        initViews(view)
        initButtons()
        initStateFlow()
    }

    /** Ініціалізація всіх елементів інтерфейсу **/
    private fun initViews(view: View) {
        iv_to_back = view.findViewById(R.id.iv_to_back)
        tv_tittletext = view.findViewById(R.id.tv_tittletext)
        tv_message = view.findViewById(R.id.tv_message)
        tv_last_name = view.findViewById(R.id.tv_last_name)
        tv_first_name = view.findViewById(R.id.tv_first_name)
        tv_patronymic = view.findViewById(R.id.tv_patronymic)
        tv_passport_number = view.findViewById(R.id.tv_passport_number)
        tv_address = view.findViewById(R.id.tv_address)
        tv_postal_code = view.findViewById(R.id.tv_postal_code)
        et_email_address = view.findViewById(R.id.et_email_address)
        et_password = view.findViewById(R.id.et_password)
        bth_edit = view.findViewById(R.id.bth_edit)
    }

    /** Ініціалізація всіх кнопок інтерфейсу **/
    private fun initButtons() {
        iv_to_back.setOnClickListener {
            findNavController().popBackStack()
        }

        bth_edit.setOnClickListener {
            if (bth_edit.text.toString() == "Редагувати") textViewSwitchMode(edit = true) else saveChanges()
        }
    }

    /** Ініціалізація StateFlow **/
    private fun initStateFlow() {
        viewLifecycleOwner.lifecycleScope.launch {
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {

                // Отримання даних користувача
                launch {
                    settingsViewModel.outputUserDetail.collect { state ->
                        val sharedPref = requireContext().getSharedPreferences("UserPrefs", Context.MODE_PRIVATE)
                        val user_password = sharedPref.getString("user_password", null)

                        outputUserDetail = state.copy(password = user_password)
                        updateTextView(outputUserDetail)
                    }
                }

                // Обробка оновлення профілю
                launch {
                    settingsViewModel.outputUpdateProfile.collect { state ->
                        when (state) {
                            is OutputUpdateProfile.Success -> {
                                val token = saveUserToken(state)
                                settingsViewModel.getUserDetail(token)
                                tv_message.text = ""
                                loadingViewModel.hide()
                                textViewSwitchMode(edit = false)
                            }

                            is OutputUpdateProfile.Error -> {
                                loadingViewModel.hide()
                                tv_message.text = state.detail
                            }
                        }
                    }
                }
            }
        }
    }

    /** Збереження змін */
    private fun saveChanges() {
        val sharedPref = requireContext().getSharedPreferences("UserPrefs", Context.MODE_PRIVATE)
        val token = sharedPref.getString("access_token", null)
        val user_password = sharedPref.getString("user_password", null)

        tv_message.text = ""

        val inputUpdateProfile = InputUpdateProfile(
            new_email = if (outputUserDetail.email != et_email_address.text.toString().trimEnd())
                et_email_address.text.toString().trimEnd()
            else null,

            old_password = if (user_password != et_password.text.toString().trimEnd())
                user_password
            else null,

            new_password = if (user_password != et_password.text.toString().trimEnd())
                et_password.text.toString().trimEnd()

            else null
        )

        if (inputUpdateProfile.new_email == null && inputUpdateProfile.old_password == null && inputUpdateProfile.new_password == null) {
            textViewSwitchMode(edit = false)
            return
        }

        loadingViewModel.show()
        settingsViewModel.updateProfile(token, inputUpdateProfile)
    }

    /** Зберешення токену користувача */
    private fun saveUserToken(state: OutputUpdateProfile.Success): String? {
        val sharedPref = requireContext().getSharedPreferences("UserPrefs", Context.MODE_PRIVATE)
        val token = sharedPref.getString("access_token", null)

        with(sharedPref.edit()) {
            putString("user_password", et_password.text.toString())
            if (state.access_token != null) putString("access_token", state.access_token)
            commit()
        }

        return token
    }

    /** Оновлення полів користувача **/
    private fun updateTextView(input: OutputUserDetail) {
        tv_last_name.text = input.last_name
        tv_first_name.text = input.first_name
        tv_patronymic.text = input.patronymic
        tv_passport_number.text = input.passport_number
        tv_address.text = input.full_address
        tv_postal_code.text = input.postal_index

        et_email_address.setText(input.email)
        et_password.setText(input.password)
    }

    /** Зміна полів на редагування/статику **/
    private fun textViewSwitchMode(edit: Boolean) {
        val color = ContextCompat.getColor(requireContext(), if (edit) R.color.gray_hint_text else R.color.black)
        listOf(tv_last_name, tv_first_name, tv_patronymic, tv_passport_number, tv_address, tv_postal_code).forEach { it.setTextColor(color) }

        et_email_address.apply {
            isFocusableInTouchMode = edit
            isFocusable = edit
            isClickable = edit
        }

        et_password.apply {
            isFocusableInTouchMode = edit
            isFocusable = edit
            isClickable = edit
        }

        bth_edit.text = if (edit) "Зберегти зміни" else "Редагувати"
    }
}
