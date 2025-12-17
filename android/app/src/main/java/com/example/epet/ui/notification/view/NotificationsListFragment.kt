package com.example.epet.ui.messages.view

import android.content.Context.MODE_PRIVATE
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.lifecycleScope
import androidx.lifecycle.repeatOnLifecycle
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.epet.R
import com.example.epet.data.model.notification.OutputNotification
import com.example.epet.ui.messages.adapter.NotificationsListAdapter
import com.example.epet.ui.notification.viewmodel.NotificationsViewModel
import kotlinx.coroutines.launch

class NotificationsListFragment : Fragment() {

    private val notificationsViewModel: NotificationsViewModel by activityViewModels()

    private lateinit var iv_to_back: ImageView
    private lateinit var tv_message: TextView
    private lateinit var rv_messages: RecyclerView

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_notification, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        initViews(view)
        initButtons()
        loadUserNotifications()
        initStateFlow()
    }

    /** Ініціалізація всіх елементів інтерфейсу **/
    private fun initViews(view: View) {
        iv_to_back = view.findViewById(R.id.iv_to_back)
        rv_messages = view.findViewById(R.id.rv_messages)
        tv_message = view.findViewById(R.id.tv_message)
    }

    /** Ініціалізація всіх кнопок інтерфейсу **/
    private fun initButtons() {
        iv_to_back.setOnClickListener {
            findNavController().popBackStack()
        }
    }

    /** Ініціалізація повідомлень користувача **/
    fun loadUserNotifications() {
        val sharedPref = requireContext().getSharedPreferences("UserPrefs", MODE_PRIVATE)
        val token = sharedPref.getString("access_token", null)
        notificationsViewModel.getNotificationsList(token)
    }

    /** Ініціалізація StateFlow **/
    private fun initStateFlow() {
        viewLifecycleOwner.lifecycleScope.launch {
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
                notificationsViewModel.outputNotificationsList.collect { state ->
                    if (state == emptyList<OutputNotification>())  {
                        tv_message.visibility = View.VISIBLE
                    } else {
                        tv_message.visibility = View.INVISIBLE
                        setupRecyclerView(state)
                    }
                }
            }
        }
    }

    /** Налаштування RecyclerView **/
    private fun setupRecyclerView(notificationsList: List<OutputNotification>) {
        val adapter = NotificationsListAdapter(notificationsList)
        rv_messages.layoutManager = LinearLayoutManager(requireContext())
        rv_messages.adapter = adapter
    }
}