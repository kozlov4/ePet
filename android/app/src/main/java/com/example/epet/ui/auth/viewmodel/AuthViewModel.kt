package com.example.epet.ui.auth.viewmodel

import com.example.epet.data.repository.AuthRepository
import androidx.lifecycle.ViewModel
import com.example.epet.data.model.OutputAuth
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.LiveData
import com.example.epet.data.model.InputLogin
import com.example.epet.data.model.InputRegistration
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.launch

class AuthViewModel(private val repository: AuthRepository) : ViewModel() {

    private val _outputLogin = MutableLiveData<OutputAuth>()
    val outputLogin: LiveData<OutputAuth> get() = _outputLogin

    private val _outputRegisatration = MutableLiveData<OutputAuth>()
    val outputRegisatration: LiveData<OutputAuth> get() = _outputRegisatration

    private val _outputEmail = MutableLiveData<String>()
    val outputEmail: LiveData<String> get() = _outputEmail

    fun login(inputLogin: InputLogin) {
        viewModelScope.launch {
            val input = inputLogin
            val output = repository.login(input)
            _outputLogin.value = output
        }
    }

    fun registration(inputRegistration: InputRegistration, adress: String) {
        viewModelScope.launch {
            val input = inputRegistration
            val output = repository.registration(input, adress)
            _outputRegisatration.value = output
        }
    }

    fun reset_password(inputEmail: String) {
        viewModelScope.launch {
            val input = inputEmail
            val output = repository.reset_password(input)
            _outputEmail.value = output
        }
    }
}