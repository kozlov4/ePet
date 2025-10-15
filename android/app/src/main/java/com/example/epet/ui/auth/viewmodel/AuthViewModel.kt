package com.example.epet.ui.auth.viewmodel

import com.example.epet.data.repository.AuthRepository
import androidx.lifecycle.ViewModel
import com.example.epet.data.model.OutputAuth
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.LiveData
import com.example.epet.data.model.InputLogin
import com.example.epet.data.model.InputRegistration

class AuthViewModel(private val repository: AuthRepository) : ViewModel() {

    private val _outputLogin = MutableLiveData<OutputAuth>()
    val outputLogin: LiveData<OutputAuth> get() = _outputLogin

    fun login(inputLogin: InputLogin) {
        val input = inputLogin
        val output = repository.login(input)
        _outputLogin.value = output
    }

    private val _outputRegisatration = MutableLiveData<OutputAuth>()
    val outputRegisatration: LiveData<OutputAuth> get() = _outputRegisatration

    fun registration(inputRegistration: InputRegistration) {
        val input = inputRegistration
        val output = repository.regisatration(input)
        _outputRegisatration.value = output
    }

    private val _outputEmail = MutableLiveData<String>()
    val outputEmail: LiveData<String> get() = _outputEmail

    fun reset_password(inputEmail: String) {
        val input = inputEmail
        val output = repository.reset_password(input)
        _outputEmail.value = output
    }
}