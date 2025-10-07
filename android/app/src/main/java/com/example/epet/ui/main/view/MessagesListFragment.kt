package com.example.epet.ui.main.view

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.epet.R
import com.example.epet.data.model.Message
import com.example.epet.ui.main.adapter.MessageAdapter

class MessagesListFragment : Fragment() {

    private lateinit var iv_to_back: ImageView
    private lateinit var rv_messages: RecyclerView

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_messages_list, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        initViews(view)
        initButtons()
        initInfo()
    }

    /** Ініціалізація всіх елементів інтерфейсу **/
    private fun initViews(view: View) {
        iv_to_back = view.findViewById(R.id.iv_to_back)
        rv_messages = view.findViewById(R.id.rv_messages)
    }

    /** Ініціалізація всіх кнопок інтерфейсу **/
    private fun initButtons() {
        iv_to_back.setOnClickListener {
            findNavController().popBackStack()
        }
    }

    /** Заповнення даних **/
    private fun initInfo() {
        setupRecyclerView(getSampleMessages())
    }

    /** Повертає приклад даних про повідомлення **/
    private fun getSampleMessages(): List<Message> = listOf(
        Message("Витяг сформовано!", "Документ про пухнастого буде надіслано вам найближчим часом на email"),
        Message("Витяг сформовано!", "Документ про пухнастого буде надіслано вам найближчим часом на email"),
        Message("Витяг сформовано!", "Документ про пухнастого буде надіслано вам найближчим часом на email"),
        Message("Витяг сформовано!", "Документ про пухнастого буде надіслано вам найближчим часом на email"),
        Message("Витяг сформовано!", "Документ про пухнастого буде надіслано вам найближчим часом на email")
    )

    /** Налаштування RecyclerView **/
    private fun setupRecyclerView(messages: List<Message>) {
        val adapter = MessageAdapter(messages)
        rv_messages.layoutManager = LinearLayoutManager(requireContext())
        rv_messages.adapter = adapter
    }
}