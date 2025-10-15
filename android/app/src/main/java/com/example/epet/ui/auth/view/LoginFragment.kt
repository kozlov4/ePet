package com.example.epet.ui.auth.view

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.example.epet.R
import android.widget.TextView
import androidx.appcompat.widget.AppCompatButton
import androidx.navigation.fragment.findNavController
import com.example.epet.data.repository.AuthRepository
import com.example.epet.ui.auth.viewmodel.AuthViewModel
import android.widget.EditText
import com.example.epet.data.model.InputLogin
import com.example.epet.data.model.OutputAuth
import com.example.epet.ui.main.view.MainActivity
import androidx.navigation.fragment.navArgs

class LoginFragment : Fragment() {

    private val args: LoginFragmentArgs by navArgs()
    private val viewModel: AuthViewModel by lazy { AuthViewModel(AuthRepository()) }

    private lateinit var tv_to_registration: TextView
    private lateinit var tv_reset_password: TextView
    private lateinit var tv_message: TextView

    private lateinit var  et_email_address: EditText
    private lateinit var  et_password: EditText

    private lateinit var bth_login: AppCompatButton

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_login, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        initViews(view)
        initButtons()
        initEmail()
        initLiveData()
    }

    /** Ініціалізація всіх елементів інтерфейсу **/
    private fun initViews(view: View) {
        tv_to_registration = view.findViewById(R.id.tv_to_registration)
        tv_reset_password = view.findViewById(R.id.tv_reset_password)
        tv_message = view.findViewById(R.id.tv_message)

        et_email_address = view.findViewById(R.id.et_email_address)
        et_password = view.findViewById(R.id.et_password)

        bth_login = view.findViewById(R.id.bth_login)
    }

    /** Ініціалізація всіх кнопок інтерфейсу **/
    private fun initButtons() {
        tv_to_registration.setOnClickListener {
            findNavController().navigate(R.id.action_login_to_registration)
        }

        tv_reset_password.setOnClickListener {
            val email = et_email_address.text.toString()
            val action = LoginFragmentDirections.actionLoginToResetPassword(email)
            findNavController().navigate(action)
        }

        bth_login.setOnClickListener {
            val email = et_email_address.text.toString()
            val password = et_password.text.toString()
            viewModel.login(InputLogin(email, password))
        }
    }

    /** Ініціалізація пошти **/
    private fun initEmail() {
        et_email_address.setText(args.email)
    }

    /** Ініціалізація LiveData **/
    private fun initLiveData() {
        viewModel.outputLogin.observe(viewLifecycleOwner) { output ->
            when(output) {
                is OutputAuth.Success -> {
                    tv_message.visibility = View.GONE
                    navigateToMainActivity()
                }

                is OutputAuth.Error -> {
                    tv_message.text = output.message
                    tv_message.visibility = View.VISIBLE
                }
            }
        }
    }

    /** Переход на наступну активність **/
    private fun navigateToMainActivity() {
        val intent = Intent(requireContext(), MainActivity::class.java)
        startActivity(intent)
        requireActivity().overridePendingTransition(R.anim.slide_in_bottom, 0)
        requireActivity().finish()
    }
}