package com.example.epet.ui.main.view

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.example.epet.R
import android.widget.TextView
import androidx.appcompat.widget.AppCompatButton

class MenuFragment : Fragment() {

    private lateinit var tv_to_mail: TextView
    private lateinit var tv_to_settings: TextView
    private lateinit var tv_to_update_app: TextView
    private lateinit var tv_to_support: TextView
    private lateinit var tv_to_question: TextView

    private lateinit var bth_exit: AppCompatButton

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_menu, container, false)
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
        bth_exit = view.findViewById(R.id.bth_exit)
    }
}
