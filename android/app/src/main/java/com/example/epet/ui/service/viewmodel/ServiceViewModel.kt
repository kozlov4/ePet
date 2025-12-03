package com.example.epet.ui.service.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.epet.data.model.service.OutputExtractPet
import com.example.epet.data.repository.ServiceRepository
import com.example.epet.data.model.service.InputExtractPet
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.launch

class ServiceViewModel : ViewModel() {

    private val repository = ServiceRepository()

    private val _outputGenerateReport = MutableSharedFlow<OutputExtractPet>()
    val outputGenerateReport = _outputGenerateReport.asSharedFlow()


    fun generateReport(token: String?, inputExtractPet: InputExtractPet) {
        viewModelScope.launch {
            val output = repository.generateReport(token, inputExtractPet)
            _outputGenerateReport.emit(output)
        }
    }
}