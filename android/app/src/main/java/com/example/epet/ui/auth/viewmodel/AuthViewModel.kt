package com.example.epet.ui.auth.viewmodel

import com.example.epet.data.repository.AuthRepository
import androidx.lifecycle.ViewModel
import com.example.epet.data.model.auth.OutputAuth
import com.example.epet.data.model.auth.InputLogin
import com.example.epet.data.model.auth.InputRegistration
import androidx.lifecycle.viewModelScope
import com.example.epet.data.model.auth.InputResetPassword
import com.example.epet.data.model.auth.OutputResetPassword
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.flow.asSharedFlow

class AuthViewModel(private val repository: AuthRepository) : ViewModel() {

    private val _outputLogin = MutableSharedFlow<OutputAuth>()
    val outputLogin = _outputLogin.asSharedFlow()

    private val _outputRegisatration = MutableSharedFlow<OutputAuth>()
    val outputRegisatration = _outputRegisatration.asSharedFlow()

    private val _outputEmail = MutableSharedFlow<OutputResetPassword>()
    val outputEmail = _outputEmail.asSharedFlow()

    fun login(inputLogin: InputLogin) {
        viewModelScope.launch {
            val input = inputLogin
            val output = repository.login(input)
            _outputLogin.emit(output)
        }
    }

    fun registration(inputRegistration: InputRegistration, adress: String) {
        viewModelScope.launch {
            val input = inputRegistration
            val output = repository.registration(input, adress)
            _outputRegisatration.emit(output)
        }
    }

    fun resetPassword(inputResetPassword: InputResetPassword) {
        viewModelScope.launch {
            val input = inputResetPassword
            val output = repository.resetPassword(input)
            _outputEmail.emit(output)
        }
    }
}