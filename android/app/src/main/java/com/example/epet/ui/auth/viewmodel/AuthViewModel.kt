package com.example.epet.ui.auth.viewmodel

import com.example.epet.data.repository.AuthRepository
import androidx.lifecycle.ViewModel
import com.example.epet.data.model.OutputAuth
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.LiveData
import com.example.epet.data.model.InputLogin

class AuthViewModel(private val repository: AuthRepository) : ViewModel() {

    private val _outputLogin = MutableLiveData<OutputAuth>()
    val outputLogin: LiveData<OutputAuth> get() = _outputLogin

    fun login(inputLogin: InputLogin) {
        val input = inputLogin
        val output = repository.login(input)
        _outputLogin.value = output
    }
}