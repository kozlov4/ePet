package com.example.epet.ui.main.view

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.appcompat.widget.AppCompatButton
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.example.epet.R

class ServicesFragment : Fragment() {

    private lateinit var tv_to_mail: TextView
    private lateinit var tv_to_settings: TextView
    private lateinit var tv_to_update_app: TextView
    private lateinit var tv_to_support: TextView
    private lateinit var tv_to_question: TextView

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_services, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        initViews(view)
    }

    /** Ініціалізація всіх елементів інтерфейсу **/
    private fun initViews(view: View) {
        tv_to_mail = view.findViewById(R.id.tv_to_mail)
        tv_to_settings = view.findViewById(R.id.tv_to_settings)
        tv_to_update_app = view.findViewById(R.id.tv_to_update_app)
        tv_to_support = view.findViewById(R.id.tv_to_support)
        tv_to_question = view.findViewById(R.id.tv_to_question)
    }
}