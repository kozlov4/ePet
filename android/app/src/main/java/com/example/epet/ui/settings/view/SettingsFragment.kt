package com.example.epet.ui.settings.view

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.EditText
import android.widget.ImageView
import android.widget.TextView
import androidx.appcompat.widget.AppCompatButton
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.example.epet.R

class SettingsFragment : Fragment() {

    private lateinit var iv_to_back: ImageView
    private lateinit var tv_tittletext: TextView

    private lateinit var tv_message: TextView
    private lateinit var tv_surname: TextView
    private lateinit var tv_name: TextView
    private lateinit var tv_patronymic: TextView
    private lateinit var tv_passport_number: TextView
    private lateinit var tv_address: TextView
    private lateinit var tv_postal_code: TextView

    private lateinit var et_email_address: EditText
    private lateinit var et_password: EditText

    private lateinit var bth_edit: AppCompatButton

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_settings, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        initViews(view)
        initButtons()
    }

    /** Ініціалізація всіх елементів інтерфейсу **/
    private fun initViews(view: View) {
        iv_to_back = view.findViewById(R.id.iv_to_back)
        tv_tittletext = view.findViewById(R.id.tv_tittletext)
        tv_message = view.findViewById(R.id.tv_message)

        tv_surname = view.findViewById(R.id.tv_surname)
        tv_name = view.findViewById(R.id.tv_drug_name)
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
            if (bth_edit.text.toString() == "Редагувати")
                changeToEdit()
            else if (bth_edit.text.toString() == "Зберегти зміни")
                changeToStatic()
        }
    }

    /** Зміна на редагування **/
    private fun changeToEdit() {
        tv_surname.setTextColor(ContextCompat.getColor(requireContext(), R.color.gray_hint_text))
        tv_name.setTextColor(ContextCompat.getColor(requireContext(), R.color.gray_hint_text))
        tv_patronymic.setTextColor(ContextCompat.getColor(requireContext(), R.color.gray_hint_text))
        tv_passport_number.setTextColor(ContextCompat.getColor(requireContext(), R.color.gray_hint_text))
        tv_address.setTextColor(ContextCompat.getColor(requireContext(), R.color.gray_hint_text))
        tv_postal_code.setTextColor(ContextCompat.getColor(requireContext(), R.color.gray_hint_text))

        et_email_address.isFocusableInTouchMode = true
        et_email_address.isFocusable = true
        et_email_address.isClickable = true

        et_password.isFocusableInTouchMode = true
        et_password.isFocusable = true
        et_password.isClickable = true

        bth_edit.setText("Зберегти зміни")
    }

    /** Зміна на статичне **/
    private fun changeToStatic() {
        tv_surname.setTextColor(ContextCompat.getColor(requireContext(), R.color.black))
        tv_name.setTextColor(ContextCompat.getColor(requireContext(), R.color.black))
        tv_patronymic.setTextColor(ContextCompat.getColor(requireContext(), R.color.black))
        tv_passport_number.setTextColor(ContextCompat.getColor(requireContext(), R.color.black))
        tv_address.setTextColor(ContextCompat.getColor(requireContext(), R.color.black))
        tv_postal_code.setTextColor(ContextCompat.getColor(requireContext(), R.color.black))

        et_email_address.isFocusable = false
        et_email_address.isClickable = false

        et_password.isFocusable = false
        et_password.isClickable = false

        bth_edit.setText("Редагувати")
    }

}